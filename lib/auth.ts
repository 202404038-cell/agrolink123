import { NextRequest, NextResponse } from "next/server"
import { db } from "./db"
import type { ApiResponse } from "./types"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "agrolink_secret_key_2026")

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET)
}

export async function getSession() {
  const token = (await cookies()).get("session")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { empresaId: number; name: string; email: string }
  } catch {
    return null
  }
}

export async function authenticateRequest(
  request: NextRequest
): Promise<{ authenticated: true; empresaId: number; empresaNombre: string } | NextResponse<ApiResponse>> {
  let apiKey = request.headers.get("X-API-Key")
  
  if (!apiKey) {
    const { searchParams } = new URL(request.url)
    apiKey = searchParams.get("key")
  }

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

  const result = await db.validateApiKey(apiKey)

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
  result: Awaited<ReturnType<typeof authenticateRequest>>
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
