import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filters = {
    categoria_id: searchParams.get("categoria_id") ? Number(searchParams.get("categoria_id")) : undefined,
    activo: searchParams.get("activo") ? searchParams.get("activo") === "true" : undefined,
    search: searchParams.get("search") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Math.min(Number(searchParams.get("limit")), 100) : 20,
  }
  const result = await db.getProductos(filters)
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const producto = await db.createProducto(body)
    return NextResponse.json(producto, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
