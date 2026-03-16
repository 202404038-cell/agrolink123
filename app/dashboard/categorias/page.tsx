"use client"

import { useState } from "react"
import useSWR from "swr"
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import type { Categoria } from "@/lib/types"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function CategoriasPage() {
  const { data: categorias, mutate } = useSWR<Categoria[]>(
    "/api/dashboard/categorias",
    fetcher
  )
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Categoria | null>(null)
  const [form, setForm] = useState({ nombre: "", descripcion: "" })

  const cats = categorias || []

  function openCreate() {
    setEditing(null)
    setForm({ nombre: "", descripcion: "" })
    setOpen(true)
  }

  function openEdit(c: Categoria) {
    setEditing(c)
    setForm({ nombre: c.nombre, descripcion: c.descripcion })
    setOpen(true)
  }

  async function handleSubmit() {
    if (editing) {
      await fetch(`/api/dashboard/categorias/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } else {
      await fetch("/api/dashboard/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setOpen(false)
    mutate()
  }

  async function handleDelete(id: number) {
    await fetch(`/api/dashboard/categorias/${id}`, { method: "DELETE" })
    mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-sm text-muted-foreground">
            Administra las categorias de productos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card text-card-foreground sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Categoria" : "Nueva Categoria"}</DialogTitle>
              <DialogDescription>Define el nombre y descripcion de la categoria.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre</Label>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="border-border bg-input" />
              </div>
              <div className="grid gap-2">
                <Label>Descripcion</Label>
                <Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="border-border bg-input" />
              </div>
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {editing ? "Guardar Cambios" : "Crear Categoria"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderTree className="h-4 w-4 text-primary" />
            {cats.length} categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-3 py-3 font-medium text-muted-foreground">ID</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Descripcion</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Creada</th>
                  <th className="px-3 py-3 font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cats.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                    <td className="px-3 py-3 font-medium">{c.nombre}</td>
                    <td className="max-w-[300px] truncate px-3 py-3 text-muted-foreground">{c.descripcion}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("es-MX")}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => openEdit(c)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(c.id)}>
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
