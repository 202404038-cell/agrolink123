import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, successResponse } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  const stats = await db.getStats()
  return successResponse(stats, "Estadisticas obtenidas exitosamente")
}
