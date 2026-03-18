import { getSession, successResponse, errorResponse } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) return errorResponse("UNAUTHORIZED", "No hay sesión activa", 401)

  // Obtener API Key de la empresa
  const keys = await db.getApiKeysByEmpresa(session.empresaId)
  const activeKey = keys.find(k => k.activo)?.api_key

  return successResponse({
    ...session,
    apiKey: activeKey || "No hay API Key activa"
  })
}
