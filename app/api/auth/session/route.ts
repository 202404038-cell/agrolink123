import { getSession, successResponse, errorResponse } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) return errorResponse("UNAUTHORIZED", "No hay sesion activa", 401)
  return successResponse(session)
}
