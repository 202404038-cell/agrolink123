import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createToken, successResponse, errorResponse } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return errorResponse("MISSING_FIELDS", "Email y contraseña son requeridos")
    }

    const empresa = await db.getEmpresaByEmail(email)

    if (!empresa) {
      return errorResponse("INVALID_CREDENTIALS", "Credenciales invalidas")
    }

    const passwordMatch = await bcrypt.compare(password, empresa.password || "")

    if (!passwordMatch) {
      return errorResponse("INVALID_CREDENTIALS", "Credenciales invalidas")
    }

    const token = await createToken({
      empresaId: empresa.id,
      name: empresa.nombre,
      email: empresa.email
    })

    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 1 day
    })

    return successResponse({
      id: empresa.id,
      nombre: empresa.nombre,
      email: empresa.email
    }, "Inicio de sesion exitoso")

  } catch (error) {
    console.error("Login error:", error)
    return errorResponse("SERVER_ERROR", "Error interno del servidor")
  }
}
