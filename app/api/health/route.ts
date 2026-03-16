import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const uptimeSeconds = typeof process !== "undefined" && typeof process.uptime === "function" ? Math.floor(process.uptime()) : 0
  const stats = db.getStats()

  return NextResponse.json({
    service: "AgroLink WS",
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime_seconds: uptimeSeconds,
    summary: {
      total_productos: stats.total_productos,
      total_empresas: stats.total_empresas,
      total_pedidos: stats.total_pedidos,
    },
    endpoints: [
      "/api/v1/productos",
      "/api/v1/categorias",
      "/api/v1/empresas",
      "/api/v1/pedidos",
      "/api/v1/stats",
      "/api/sql?file=schema",
    ],
  })
}
