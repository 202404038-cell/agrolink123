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

    const user = await db.getEmpresaByEmail(email)
    
    if (!user) {
      return errorResponse("INVALID_CREDENTIALS", "Credenciales invalidas")
    }

    const passwordMatch = await bcrypt.compare(password, user.password || "")

    if (!passwordMatch) {
      return errorResponse("INVALID_CREDENTIALS", "Credenciales invalidas")
    }

    const token = await createToken({
      empresaId: user.id,
      name: user.nombre,
      email: user.email,
      rol: user.rol
    })

    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 // 1 day
    })

    return successResponse({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol
    }, "Inicio de sesion exitoso")

  } catch (error) {
    console.error("Login error:", error)
    return errorResponse("SERVER_ERROR", "Error interno del servidor")
  }
}
