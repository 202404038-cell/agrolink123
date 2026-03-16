import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const createPedidoSchema = z.object({
  empresa_id: z.number().int().positive("La empresa es requerida"),
  notas: z.string().max(1000).optional(),
  fecha_entrega_estimada: z.string().optional(),
  items: z.array(z.object({
    producto_id: z.number().int().positive(),
    cantidad: z.number().positive("La cantidad debe ser mayor a 0"),
  })).min(1, "Se requiere al menos un producto en el pedido"),
})

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { searchParams } = new URL(request.url)
  const filters = {
    empresa_id: searchParams.get("empresa_id") ? Number(searchParams.get("empresa_id")) : undefined,
    estado: searchParams.get("estado") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Math.min(Number(searchParams.get("limit")), 100) : 20,
  }

  const { data, total } = db.getPedidos(filters)
  return successResponse(data, "Pedidos obtenidos exitosamente", {
    total,
    page: filters.page!,
    limit: filters.limit!,
  })
}

export async function POST(request: NextRequest) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  try {
    const body = await request.json()
    const parsed = createPedidoSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    // Validate empresa exists
    const empresa = db.getEmpresaById(parsed.data.empresa_id)
    if (!empresa) return errorResponse("INVALID_REFERENCE", "La empresa especificada no existe")

    // Validate all products exist
    for (const item of parsed.data.items) {
      const prod = db.getProductoById(item.producto_id)
      if (!prod) return errorResponse("INVALID_REFERENCE", `El producto con ID ${item.producto_id} no existe`)
      if (!prod.activo) return errorResponse("PRODUCT_INACTIVE", `El producto "${prod.nombre}" no esta activo`)
    }

    const pedido = db.createPedido(parsed.data)
    return successResponse(pedido, "Pedido creado exitosamente")
  } catch {
    return errorResponse("INVALID_BODY", "El cuerpo de la peticion no es JSON valido")
  }
}
