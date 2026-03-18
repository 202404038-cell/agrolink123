import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createToken, successResponse, errorResponse } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, password, tipo, rfc, telefono, direccion, ciudad, estado } = body

    if (!nombre || !email || !password || !tipo || !rfc) {
      console.log(`[Register Failed] Missing fields: ${JSON.stringify({ nombre: !!nombre, email: !!email, password: !!password, tipo: !!tipo, rfc: !!rfc })}`);
      return errorResponse("MISSING_FIELDS", "Nombre, email, password, tipo y RFC son requeridos")
    }
    
    console.log(`[Register Attempt] Email: ${email}, Empresa: ${nombre}`);

    // Verificar si ya existe el email
    const existingEmail = await db.getEmpresaByEmail(email)
    if (existingEmail) {
      return errorResponse("ALREADY_EXISTS", "El correo ya está registrado")
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear empresa
    const empresa = await db.createEmpresa({
      nombre,
      email,
      password: hashedPassword,
      tipo,
      rfc,
      telefono,
      direccion,
      ciudad,
      estado
    } as any)

    // Crear API Key por defecto para la empresa
    await db.createApiKey(empresa.id, "Default Key (Web Generated)")

    // Crear token de sesión
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
    }, "Empresa registrada exitosamente")

  } catch (error: any) {
    console.error(`[Register ERROR] ${error.message}`, error);
    return errorResponse("SERVER_ERROR", `Error interno del servidor: ${error.message}`, 500)
  }
}
