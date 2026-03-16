"use client"

import useSWR from "swr"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Pedido, Empresa } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const estados = [
  { value: "pendiente", label: "Pendiente", color: "bg-chart-4/20 text-chart-4" },
  { value: "confirmado", label: "Confirmado", color: "bg-chart-1/20 text-chart-1" },
  { value: "en_preparacion", label: "En Preparacion", color: "bg-chart-2/20 text-chart-2" },
  { value: "enviado", label: "Enviado", color: "bg-chart-3/20 text-chart-3" },
  { value: "entregado", label: "Entregado", color: "bg-primary/20 text-primary" },
  { value: "cancelado", label: "Cancelado", color: "bg-destructive/20 text-destructive" },
]

export default function PedidosPage() {
  const { data, mutate } = useSWR<{ data: Pedido[]; total: number }>(
    "/api/dashboard/pedidos?limit=100",
    fetcher
  )
  const { data: empresasData } = useSWR<{ data: Empresa[]; total: number }>(
    "/api/dashboard/empresas?limit=100",
    fetcher
  )

  const pedidos = data?.data || []
  const empresas = empresasData?.data || []

  const getEmpresaNombre = (id: number) =>
    empresas.find((e) => e.id === id)?.nombre || `Empresa #${id}`

  async function changeEstado(pedidoId: number, estado: string) {
    await fetch(`/api/dashboard/pedidos/${pedidoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    })
    mutate()
  }

  async function cancelPedido(id: number) {
    await fetch(`/api/dashboard/pedidos/${id}`, { method: "DELETE" })
    mutate()
  }

  const getEstadoInfo = (estado: string) =>
    estados.find((e) => e.value === estado) || estados[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-sm text-muted-foreground">
          Administra y da seguimiento a los pedidos de las empresas
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-4 w-4 text-primary" />
            {pedidos.length} pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Empresa</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Total</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Entrega Est.</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Notas</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => {
                  const estadoInfo = getEstadoInfo(p.estado)
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                    >
                      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                        #{p.id}
                      </td>
                      <td className="px-3 py-3 font-medium">
                        {getEmpresaNombre(p.empresa_id)}
                      </td>
                      <td className="px-3 py-3 font-mono">
                        ${p.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="secondary" className={estadoInfo.color}>
                          {estadoInfo.label}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {p.fecha_entrega_estimada || "—"}
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-3 text-xs text-muted-foreground">
                        {p.notas || "—"}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Select
                            value={p.estado}
                            onValueChange={(v) => changeEstado(p.id, v)}
                          >
                            <SelectTrigger className="h-8 w-36 border-border bg-input text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-border bg-card">
                              {estados.map((e) => (
                                <SelectItem key={e.value} value={e.value}>
                                  {e.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {p.estado !== "cancelado" && p.estado !== "entregado" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs text-destructive hover:text-destructive"
                              onClick={() => cancelPedido(p.id)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
