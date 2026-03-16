import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const updateEmpresaSchema = z.object({
  nombre: z.string().min(1).max(200).optional(),
  tipo: z.enum(["restaurante", "supermercado", "distribuidor", "catering", "central_abasto"]).optional(),
  rfc: z.string().min(12).max(13).optional(),
  email: z.string().email().optional(),
  telefono: z.string().max(20).optional(),
  direccion: z.string().max(500).optional(),
  ciudad: z.string().max(100).optional(),
  estado: z.string().max(100).optional(),
  activo: z.boolean().optional(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  const empresa = db.getEmpresaById(Number(id))
  if (!empresa) return errorResponse("NOT_FOUND", "Empresa no encontrada", 404)

  return successResponse(empresa)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  try {
    const body = await request.json()
    const parsed = updateEmpresaSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    const updated = db.updateEmpresa(Number(id), parsed.data)
    if (!updated) return errorResponse("NOT_FOUND", "Empresa no encontrada", 404)

    return successResponse(updated, "Empresa actualizada exitosamente")
  } catch {
    return errorResponse("INVALID_BODY", "El cuerpo de la peticion no es JSON valido")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  const deleted = db.deleteEmpresa(Number(id))
  if (!deleted) return errorResponse("NOT_FOUND", "Empresa no encontrada", 404)

  return successResponse(null, "Empresa eliminada exitosamente")
}
