import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const updatePedidoSchema = z.object({
  estado: z.enum(["pendiente", "confirmado", "en_preparacion", "enviado", "entregado", "cancelado"]),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  const pedido = db.getPedidoById(Number(id))
  if (!pedido) return errorResponse("NOT_FOUND", "Pedido no encontrado", 404)

  return successResponse(pedido)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  try {
    const body = await request.json()
    const parsed = updatePedidoSchema.safeParse(body)
    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    const updated = db.updatePedidoEstado(Number(id), parsed.data.estado)
    if (!updated) return errorResponse("NOT_FOUND", "Pedido no encontrado", 404)

    return successResponse(updated, "Estado del pedido actualizado exitosamente")
  } catch {
    return errorResponse("INVALID_BODY", "El cuerpo de la peticion no es JSON valido")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const { id } = await params
  const deleted = db.deletePedido(Number(id))
  if (!deleted) return errorResponse("NOT_FOUND", "Pedido no encontrado", 404)

  return successResponse(null, "Pedido cancelado exitosamente")
}
