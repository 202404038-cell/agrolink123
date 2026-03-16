"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Pencil, Trash2, Package } from "lucide-react"
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
import type { Producto, Categoria } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const unidades = [
  { value: "kg", label: "Kilogramo" },
  { value: "tonelada", label: "Tonelada" },
  { value: "pieza", label: "Pieza" },
  { value: "caja", label: "Caja" },
  { value: "manojo", label: "Manojo" },
]

export default function ProductosPage() {
  const { data, mutate } = useSWR<{ data: Producto[]; total: number }>(
    "/api/dashboard/productos?limit=100",
    fetcher
  )
  const { data: categorias } = useSWR<Categoria[]>(
    "/api/dashboard/categorias",
    fetcher
  )
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Producto | null>(null)
  const [form, setForm] = useState({
    nombre: "",
    categoria_id: 0,
    precio_mayoreo: 0,
    unidad_medida: "kg",
    cantidad_disponible: 0,
    descripcion: "",
    fecha_cosecha: "",
    fecha_caducidad: "",
  })

  const productos = data?.data || []
  const cats = categorias || []

  function openCreate() {
    setEditing(null)
    setForm({
      nombre: "",
      categoria_id: cats[0]?.id || 1,
      precio_mayoreo: 0,
      unidad_medida: "kg",
      cantidad_disponible: 0,
      descripcion: "",
      fecha_cosecha: "",
      fecha_caducidad: "",
    })
    setOpen(true)
  }

  function openEdit(p: Producto) {
    setEditing(p)
    setForm({
      nombre: p.nombre,
      categoria_id: p.categoria_id,
      precio_mayoreo: p.precio_mayoreo,
      unidad_medida: p.unidad_medida,
      cantidad_disponible: p.cantidad_disponible,
      descripcion: p.descripcion,
      fecha_cosecha: p.fecha_cosecha,
      fecha_caducidad: p.fecha_caducidad,
    })
    setOpen(true)
  }

  async function handleSubmit() {
    if (editing) {
      await fetch(`/api/dashboard/productos/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } else {
      await fetch("/api/dashboard/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setOpen(false)
    mutate()
  }

  async function handleDelete(id: number) {
    await fetch(`/api/dashboard/productos/${id}`, { method: "DELETE" })
    mutate()
  }

  async function toggleActivo(p: Producto) {
    await fetch(`/api/dashboard/productos/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !p.activo }),
    })
    mutate()
  }

  const getCatName = (id: number) =>
    cats.find((c) => c.id === id)?.nombre || "—"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el catalogo de productos agricolas
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreate}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card text-card-foreground sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>Completa la informacion del producto agricola.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="border-border bg-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select
                    value={String(form.categoria_id)}
                    onValueChange={(v) =>
                      setForm({ ...form, categoria_id: Number(v) })
                    }
                  >
                    <SelectTrigger className="border-border bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {cats.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Unidad</Label>
                  <Select
                    value={form.unidad_medida}
                    onValueChange={(v) =>
                      setForm({ ...form, unidad_medida: v })
                    }
                  >
                    <SelectTrigger className="border-border bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {unidades.map((u) => (
                        <SelectItem key={u.value} value={u.value}>
                          {u.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Precio Mayoreo</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.precio_mayoreo}
                    onChange={(e) =>
                      setForm({ ...form, precio_mayoreo: Number(e.target.value) })
                    }
                    className="border-border bg-input"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Cantidad Disponible</Label>
                  <Input
                    type="number"
                    value={form.cantidad_disponible}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cantidad_disponible: Number(e.target.value),
                      })
                    }
                    className="border-border bg-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Fecha Cosecha</Label>
                  <Input
                    type="date"
                    value={form.fecha_cosecha}
                    onChange={(e) =>
                      setForm({ ...form, fecha_cosecha: e.target.value })
                    }
                    className="border-border bg-input"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Fecha Caducidad</Label>
                  <Input
                    type="date"
                    value={form.fecha_caducidad}
                    onChange={(e) =>
                      setForm({ ...form, fecha_caducidad: e.target.value })
                    }
                    className="border-border bg-input"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Descripcion</Label>
                <Input
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({ ...form, descripcion: e.target.value })
                  }
                  className="border-border bg-input"
                />
              </div>
              <Button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {editing ? "Guardar Cambios" : "Crear Producto"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="h-4 w-4 text-primary" />
            {productos.length} productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Categoria</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Precio</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Stock</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Unidad</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border/50 transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                      {p.id}
                    </td>
                    <td className="px-3 py-3 font-medium">{p.nombre}</td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {getCatName(p.categoria_id)}
                    </td>
                    <td className="px-3 py-3 font-mono">
                      ${p.precio_mayoreo.toFixed(2)}
                    </td>
                    <td className="px-3 py-3 font-mono">
                      {p.cantidad_disponible.toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {p.unidad_medida}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant={p.activo ? "default" : "secondary"}
                        className={
                          p.activo
                            ? "cursor-pointer bg-primary/20 text-primary hover:bg-primary/30"
                            : "cursor-pointer"
                        }
                        onClick={() => toggleActivo(p)}
                      >
                        {p.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => openEdit(p)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(p.id)}
                        >
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
