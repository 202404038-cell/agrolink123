import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const toggled = db.toggleApiKey(Number(id))
  if (!toggled) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(toggled)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deleted = db.deleteApiKey(Number(id))
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ success: true })
}
