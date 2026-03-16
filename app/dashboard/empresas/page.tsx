"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Pencil, Trash2, Building2 } from "lucide-react"
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
import type { Empresa } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const tipos = [
  { value: "restaurante", label: "Restaurante" },
  { value: "supermercado", label: "Supermercado" },
  { value: "distribuidor", label: "Distribuidor" },
  { value: "catering", label: "Catering" },
  { value: "central_abasto", label: "Central de Abasto" },
]

const tipoColors: Record<string, string> = {
  restaurante: "bg-chart-1/20 text-chart-1",
  supermercado: "bg-chart-2/20 text-chart-2",
  distribuidor: "bg-chart-3/20 text-chart-3",
  catering: "bg-chart-4/20 text-chart-4",
  central_abasto: "bg-chart-5/20 text-chart-5",
}

export default function EmpresasPage() {
  const { data, mutate } = useSWR<{ data: Empresa[]; total: number }>(
    "/api/dashboard/empresas?limit=100",
    fetcher
  )
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Empresa | null>(null)
  const [form, setForm] = useState({
    nombre: "",
    tipo: "restaurante" as string,
    rfc: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
  })

  const empresas = data?.data || []

  function openCreate() {
    setEditing(null)
    setForm({ nombre: "", tipo: "restaurante", rfc: "", email: "", telefono: "", direccion: "", ciudad: "", estado: "" })
    setOpen(true)
  }

  function openEdit(e: Empresa) {
    setEditing(e)
    setForm({
      nombre: e.nombre,
      tipo: e.tipo,
      rfc: e.rfc,
      email: e.email,
      telefono: e.telefono,
      direccion: e.direccion,
      ciudad: e.ciudad,
      estado: e.estado,
    })
    setOpen(true)
  }

  async function handleSubmit() {
    if (editing) {
      await fetch(`/api/dashboard/empresas/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } else {
      await fetch("/api/dashboard/empresas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setOpen(false)
    mutate()
  }

  async function handleDelete(id: number) {
    await fetch(`/api/dashboard/empresas/${id}`, { method: "DELETE" })
    mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Empresas</h1>
          <p className="text-sm text-muted-foreground">
            Administra las empresas cliente registradas
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card text-card-foreground sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Empresa" : "Nueva Empresa"}</DialogTitle>
              <DialogDescription>Completa los datos de la empresa para registrarla en el sistema.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre</Label>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="border-border bg-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                    <SelectTrigger className="border-border bg-input"><SelectValue /></SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {tipos.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>RFC</Label>
                  <Input value={form.rfc} onChange={(e) => setForm({ ...form, rfc: e.target.value })} className="border-border bg-input" maxLength={13} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border-border bg-input" />
                </div>
                <div className="grid gap-2">
                  <Label>Telefono</Label>
                  <Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="border-border bg-input" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Direccion</Label>
                <Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="border-border bg-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Ciudad</Label>
                  <Input value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} className="border-border bg-input" />
                </div>
                <div className="grid gap-2">
                  <Label>Estado</Label>
                  <Input value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="border-border bg-input" />
                </div>
              </div>
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {editing ? "Guardar Cambios" : "Crear Empresa"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4 text-primary" />
            {empresas.length} empresas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Tipo</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">RFC</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Ciudad</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((e) => (
                  <tr key={e.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{e.id}</td>
                    <td className="px-3 py-3 font-medium">{e.nombre}</td>
                    <td className="px-3 py-3">
                      <Badge variant="secondary" className={tipoColors[e.tipo] || ""}>
                        {tipos.find((t) => t.value === e.tipo)?.label || e.tipo}
                      </Badge>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">{e.rfc}</td>
                    <td className="px-3 py-3 text-muted-foreground">{e.email}</td>
                    <td className="px-3 py-3 text-muted-foreground">{e.ciudad}</td>
                    <td className="px-3 py-3">
                      <Badge variant={e.activo ? "default" : "secondary"} className={e.activo ? "bg-primary/20 text-primary" : ""}>
                        {e.activo ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(e)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(e.id)}>
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
