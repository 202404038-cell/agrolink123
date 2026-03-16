import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const updateProductoSchema = z.object({
  nombre: z.string().min(1).max(150).optional(),
  categoria_id: z.number().int().positive().optional(),
  precio_mayoreo: z.number().positive().optional(),
  unidad_medida: z.enum(["kg", "tonelada", "pieza", "caja", "manojo"]).optional(),
  cantidad_disponible: z.number().min(0).optional(),
  fecha_cosecha: z.string().optional(),
  fecha_caducidad: z.string().optional(),
  descripcion: z.string().max(1000).optional(),
  imagen_url: z.string().url().optional().or(z.literal("")),
  activo: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  const producto = db.getProductoById(Number(id))
  if (!producto) return errorResponse("NOT_FOUND", "Producto no encontrado", 404)

  return successResponse(producto)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  try {
    const body = await request.json()
    const parsed = updateProductoSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    const updated = db.updateProducto(Number(id), parsed.data)
    if (!updated) return errorResponse("NOT_FOUND", "Producto no encontrado", 404)

    return successResponse(updated, "Producto actualizado exitosamente")
  } catch {
    return errorResponse("INVALID_BODY", "El cuerpo de la peticion no es JSON valido")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  const deleted = db.deleteProducto(Number(id))
  if (!deleted) return errorResponse("NOT_FOUND", "Producto no encontrado", 404)

  return successResponse(null, "Producto eliminado exitosamente")
}
