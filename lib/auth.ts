import { NextRequest, NextResponse } from "next/server"
import { db } from "./db"
import type { ApiResponse } from "./types"

export function authenticateRequest(
  request: NextRequest
): { authenticated: true; empresaId: number; empresaNombre: string } | NextResponse<ApiResponse> {
  const apiKey = request.headers.get("X-API-Key")

  if (!apiKey) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: "MISSING_API_KEY",
          message: "Se requiere el header X-API-Key para acceder a este recurso",
        },
      },
      { status: 401 }
    )
  }

  const result = db.validateApiKey(apiKey)

  if (!result.valid || !result.empresa) {
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: {
          code: "INVALID_API_KEY",
          message: "La API key proporcionada es invalida o esta desactivada",
        },
      },
      { status: 401 }
    )
  }

  return {
    authenticated: true,
    empresaId: result.empresa.id,
    empresaNombre: result.empresa.nombre,
  }
}

export function isAuthenticated(
  result: ReturnType<typeof authenticateRequest>
): result is { authenticated: true; empresaId: number; empresaNombre: string } {
  return "authenticated" in result && result.authenticated === true
}

export function errorResponse(code: string, message: string, status: number = 400) {
  return NextResponse.json<ApiResponse>(
    { success: false, error: { code, message } },
    { status }
  )
}

export function successResponse<T>(data: T, message?: string, meta?: { total: number; page: number; limit: number }) {
  return NextResponse.json<ApiResponse<T>>({
    success: true,
    data,
    message,
    ...(meta ? { meta } : {}),
  })
}
