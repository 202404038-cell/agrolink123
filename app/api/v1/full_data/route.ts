import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { authenticateRequest, isAuthenticated, successResponse } from "@/lib/auth"

export async function GET(request: NextRequest) {
  // Intentar obtener API Key de query param si no está en header
  const { searchParams } = new URL(request.url)
  const queryKey = searchParams.get("key")
  
  if (queryKey) {
    request.headers.set("X-API-Key", queryKey)
  }

  // Autenticar con X-API-Key
  const auth = await authenticateRequest(request)
  if (!isAuthenticated(auth)) return auth

  // Obtener toda la información relevante de una vez
  const categorias = await db.getCategorias()
  const productos = await db.getProductos({ limit: 100 })
  const stats = await db.getStats()

  return successResponse({
    empresa: auth.empresaNombre,
    timestamp: new Date().toISOString(),
    data: {
      categorias,
      productos: productos.data,
      resumen: {
        total_productos: stats.total_productos,
        productos_activos: stats.productos_activos,
      }
    }
  }, "Información completa obtenida exitosamente")
}
