import { type NextRequest } from "next/server"
import { db } from "@/lib/db"
import { errorResponse, successResponse } from "@/lib/auth"
import { z } from "zod"

const validateSchema = z.object({
  api_key: z.string().min(1, "La API key es requerida"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = validateSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse("VALIDATION_ERROR", parsed.error.errors.map((e) => e.message).join(", "))
    }

    const result = db.validateApiKey(parsed.data.api_key)

    if (!result.valid) {
      return errorResponse("INVALID_API_KEY", "La API key proporcionada es invalida o esta desactivada", 401)
    }

    return successResponse(
      {
        valid: true,
        empresa: {
          id: result.empresa!.id,
          nombre: result.empresa!.nombre,
          tipo: result.empresa!.tipo,
        },
      },
      "API key valida"
    )
  } catch {
    return errorResponse("INVALID_BODY", "El cuerpo de la peticion no es JSON valido")
  }
}
