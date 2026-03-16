import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const stats = db.getStats()
  return NextResponse.json(stats)
}
