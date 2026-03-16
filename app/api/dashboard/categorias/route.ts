import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const categorias = db.getCategorias()
  return NextResponse.json(categorias)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const categoria = db.createCategoria(body)
    return NextResponse.json(categoria, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
