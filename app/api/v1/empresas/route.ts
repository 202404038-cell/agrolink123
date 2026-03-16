import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const createEmpresaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(200),
  tipo: z.enum(["restaurante", "supermercado", "distribuidor", "catering", "central_abasto"]),
  rfc: z.string().min(12, "El RFC debe tener al menos 12 caracteres").max(13),
  email: z.string().email("El email no es valido"),
  telefono: z.string().max(20).optional(),
  direccion: z.string().max(500).optional(),
  ciudad: z.string().max(100).optional(),
  estado: z.string().max(100).optional(),
})

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { searchParams } = new URL(request.url)
  const filters = {
    tipo: searchParams.get("tipo") || undefined,
    activo: searchParams.get("activo") ? searchParams.get("activo") === "true" : undefined,
    search: searchParams.get("search") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Math.min(Number(searchParams.get("limit")), 100) : 20,
  }

  const { data, total } = await db.getEmpresas(filters)
  return successResponse(data, "Empresas obtenidas exitosamente", {
    total,
    page: filters.page!,
    limit: filters.limit!,
  })
}

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  try {
    const body = await request.json()
    const parsed = createEmpresaSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    const empresa = await db.createEmpresa(parsed.data)
    return successResponse(empresa, "Empresa creada exitosamente")
  } catch (error) {
    console.error(error)
    return errorResponse("SERVER_ERROR", "Error interno del servidor")
  }
}
