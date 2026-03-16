import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const updateCategoriaSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().max(500).optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  const categoria = db.getCategoriaById(Number(id))
  if (!categoria) return errorResponse("NOT_FOUND", "Categoria no encontrada", 404)

  return successResponse(categoria)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  try {
    const body = await request.json()
    const parsed = updateCategoriaSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    const updated = db.updateCategoria(Number(id), parsed.data)
    if (!updated) return errorResponse("NOT_FOUND", "Categoria no encontrada", 404)

    return successResponse(updated, "Categoria actualizada exitosamente")
  } catch {
    return errorResponse("INVALID_BODY", "El cuerpo de la peticion no es JSON valido")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  const deleted = db.deleteCategoria(Number(id))
  if (!deleted) return errorResponse("NOT_FOUND", "Categoria no encontrada", 404)

  return successResponse(null, "Categoria eliminada exitosamente")
}
