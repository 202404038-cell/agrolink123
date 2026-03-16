import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET() {
  const keys = db.getApiKeys()
  return NextResponse.json(keys)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const key = db.createApiKey(body.empresa_id, body.nombre)
    return NextResponse.json(key, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }
}
