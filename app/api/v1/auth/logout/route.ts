import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { successResponse } from "@/lib/auth"

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
  return successResponse(null, "Sesion cerrada")
}
