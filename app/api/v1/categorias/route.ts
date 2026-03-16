import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const createCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100),
  descripcion: z.string().max(500).optional(),
})

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const categorias = await db.getCategorias()
  return successResponse(categorias, "Categorias obtenidas exitosamente")
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  try {
    const body = await request.json()
    const parsed = createCategoriaSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    const categoria = await db.createCategoria(parsed.data)
    return successResponse(categoria, "Categoria creada exitosamente")
  } catch (error) {
    console.error(error)
    return errorResponse("SERVER_ERROR", "Error interno del servidor")
  }
}
