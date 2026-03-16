import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const createProductoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(150),
  categoria_id: z.number().int().positive("La categoria es requerida"),
  precio_mayoreo: z.number().positive("El precio debe ser mayor a 0"),
  unidad_medida: z.enum(["kg", "tonelada", "pieza", "caja", "manojo"]),
  cantidad_disponible: z.number().min(0, "La cantidad no puede ser negativa"),
  fecha_cosecha: z.string().optional(),
  fecha_caducidad: z.string().optional(),
  descripcion: z.string().max(1000).optional(),
  imagen_url: z.string().url().optional().or(z.literal("")),
})

export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { searchParams } = new URL(request.url)
  const filters = {
    categoria_id: searchParams.get("categoria_id") ? Number(searchParams.get("categoria_id")) : undefined,
    activo: searchParams.get("activo") ? searchParams.get("activo") === "true" : undefined,
    search: searchParams.get("search") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Math.min(Number(searchParams.get("limit")), 100) : 20,
    sort_by: searchParams.get("sort_by") || undefined,
    sort_order: (searchParams.get("sort_order") as "asc" | "desc") || undefined,
  }

  const { data, total } = db.getProductos(filters)
  return successResponse(data, "Productos obtenidos exitosamente", {
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
    const parsed = createProductoSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    // Validate categoria exists
    const cat = db.getCategoriaById(parsed.data.categoria_id)
    if (!cat) return errorResponse("INVALID_REFERENCE", "La categoria especificada no existe")

    const producto = db.createProducto(parsed.data)
    return successResponse(producto, "Producto creado exitosamente")
  } catch {
    return errorResponse("INVALID_BODY", "El cuerpo de la peticion no es JSON valido")
  }
}
