import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  nombre: z.string().min(1, "El nombre de la empresa es requerido").max(200),
  tipo: z.enum(["restaurante", "supermercado", "distribuidor", "catering", "central_abasto"]),
  rfc: z.string().min(12).max(13),
  email: z.string().email("El email no es valido"),
  telefono: z.string().max(20).optional(),
  direccion: z.string().max(500).optional(),
  ciudad: z.string().max(100).optional(),
  estado: z.string().max(100).optional(),
  api_key_nombre: z.string().min(1).max(100).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    const { api_key_nombre, ...empresaData } = parsed.data

    // Create empresa
    const empresa = db.createEmpresa(empresaData)

    // Create API key
    const apiKey = db.createApiKey(empresa.id, api_key_nombre || `Produccion - ${empresa.nombre}`)

    return successResponse(
      {
        empresa,
        api_key: {
          key: apiKey.api_key,
          nombre: apiKey.nombre,
          created_at: apiKey.created_at,
        },
      },
      "Empresa registrada exitosamente. Guarda tu API key, no se mostrara de nuevo."
    )
  } catch {
    return errorResponse("INVALID_BODY", "El cuerpo de la peticion no es JSON valido")
  }
}
