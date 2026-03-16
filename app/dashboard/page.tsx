"use client"

import useSWR from "swr"
import {
  Package,
  Building2,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import type { Stats } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const COLORS = [
  "oklch(0.55 0.17 152)",
  "oklch(0.65 0.13 85)",
  "oklch(0.50 0.12 250)",
  "oklch(0.70 0.16 60)",
  "oklch(0.60 0.15 30)",
  "oklch(0.45 0.15 200)",
]

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  en_preparacion: "En Preparacion",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
}

export default function DashboardPage() {
  const { data: stats } = useSWR<Stats>("/api/dashboard/stats", fetcher, {
    refreshInterval: 5000,
  })

  if (!stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const statCards = [
    {
      label: "Productos Totales",
      value: stats.total_productos,
      icon: Package,
      sub: `${stats.productos_activos} activos`,
    },
    {
      label: "Empresas",
      value: stats.total_empresas,
      icon: Building2,
      sub: "registradas",
    },
    {
      label: "Pedidos",
      value: stats.total_pedidos,
      icon: ShoppingCart,
      sub: `${stats.pedidos_pendientes} pendientes`,
    },
    {
      label: "Ingresos Totales",
      value: `$${stats.ingresos_totales.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      sub: `${stats.pedidos_entregados} entregados`,
    },
  ]

  const pedidosEstadoData = stats.pedidos_por_estado
    .filter((p) => p.cantidad > 0)
    .map((p) => ({
      name: estadoLabels[p.estado] || p.estado,
      value: p.cantidad,
    }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Vista general de la huerta AgroLink
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="border-border bg-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <card.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </p>
                <p className="truncate text-xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ventas mensuales */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Ventas Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.ventas_mensuales}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.015 155)"
                  />
                  <XAxis
                    dataKey="mes"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                    tickFormatter={(v) =>
                      `$${(v / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `$${value.toLocaleString("es-MX")}`,
                      "Ventas",
                    ]}
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.008 155)",
                      border: "1px solid oklch(0.28 0.015 155)",
                      borderRadius: "8px",
                      color: "oklch(0.97 0 0)",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="oklch(0.55 0.17 152)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pedidos por estado */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Pedidos por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pedidosEstadoData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {pedidosEstadoData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.008 155)",
                      border: "1px solid oklch(0.28 0.015 155)",
                      borderRadius: "8px",
                      color: "oklch(0.97 0 0)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Productos por categoria */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4 text-primary" />
              Productos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.productos_por_categoria}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.28 0.015 155)"
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                  />
                  <YAxis
                    dataKey="categoria"
                    type="category"
                    width={120}
                    tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.17 0.008 155)",
                      border: "1px solid oklch(0.28 0.015 155)",
                      borderRadius: "8px",
                      color: "oklch(0.97 0 0)",
                    }}
                  />
                  <Bar
                    dataKey="cantidad"
                    fill="oklch(0.65 0.13 85)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top productos vendidos */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Productos Mas Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.productos_mas_vendidos.slice(0, 6).map((prod, i) => (
                <div key={prod.nombre} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {prod.nombre}
                    </p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${(prod.cantidad / stats.productos_mas_vendidos[0].cantidad) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">
                    {prod.cantidad.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
