import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pedido = db.getPedidoById(Number(id))
  if (!pedido) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(pedido)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const updated = db.updatePedidoEstado(Number(id), body.estado)
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = db.deletePedido(Number(id))
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
