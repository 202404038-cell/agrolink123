"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Trash2, Key, Copy, ToggleLeft, ToggleRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ApiKey, Empresa } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ApiKeysPage() {
  const { data: keys, mutate } = useSWR<ApiKey[]>(
    "/api/dashboard/api-keys",
    fetcher
  )
  const { data: empresasData } = useSWR<{ data: Empresa[]; total: number }>(
    "/api/dashboard/empresas?limit=100",
    fetcher
  )
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ empresa_id: 0, nombre: "" })
  const [copied, setCopied] = useState<number | null>(null)

  const apiKeys = keys || []
  const empresas = empresasData?.data || []

  const getEmpresaNombre = (id: number) =>
    empresas.find((e) => e.id === id)?.nombre || `Empresa #${id}`

  function openCreate() {
    setForm({ empresa_id: empresas[0]?.id || 1, nombre: "" })
    setOpen(true)
  }

  async function handleCreate() {
    await fetch("/api/dashboard/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setOpen(false)
    mutate()
  }

  async function handleToggle(id: number) {
    await fetch(`/api/dashboard/api-keys/${id}`, { method: "PUT" })
    mutate()
  }

  async function handleDelete(id: number) {
    await fetch(`/api/dashboard/api-keys/${id}`, { method: "DELETE" })
    mutate()
  }

  function copyKey(id: number, key: string) {
    navigator.clipboard.writeText(key)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las llaves de acceso a la API para cada empresa
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nueva API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card text-card-foreground sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generar Nueva API Key</DialogTitle>
              <DialogDescription>Asigna una nueva clave de acceso a una empresa registrada.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Empresa</Label>
                <Select value={String(form.empresa_id)} onValueChange={(v) => setForm({ ...form, empresa_id: Number(v) })}>
                  <SelectTrigger className="border-border bg-input"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-border bg-card">
                    {empresas.map((e) => (<SelectItem key={e.id} value={String(e.id)}>{e.nombre}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Nombre descriptivo</Label>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Ej: Produccion - Mi Empresa" className="border-border bg-input" />
              </div>
              <Button onClick={handleCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Generar API Key
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info box */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
        <p className="text-sm text-muted-foreground">
          Las API Keys se usan en el header <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-primary">X-API-Key</code> de cada peticion a la API.
          Las empresas necesitan una API Key activa para acceder a los endpoints protegidos.
        </p>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Key className="h-4 w-4 text-primary" />
            {apiKeys.length} API keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Empresa</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">API Key</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Ultimo Uso</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((k) => (
                  <tr key={k.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{k.id}</td>
                    <td className="px-3 py-3 font-medium">{k.nombre}</td>
                    <td className="px-3 py-3 text-muted-foreground">{getEmpresaNombre(k.empresa_id)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <code className="max-w-[200px] truncate rounded bg-secondary px-2 py-1 font-mono text-xs">
                          {k.api_key}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={() => copyKey(k.id, k.api_key)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {copied === k.id && (
                          <span className="text-xs text-primary">Copiado</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="secondary" className={k.activo ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}>
                        {k.activo ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {k.ultimo_uso ? new Date(k.ultimo_uso).toLocaleString("es-MX") : "Nunca"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleToggle(k.id)} title={k.activo ? "Desactivar" : "Activar"}>
                          {k.activo ? <ToggleRight className="h-4 w-4 text-primary" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(k.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
