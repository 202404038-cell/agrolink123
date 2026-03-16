"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sprout, Building2, Lock, Mail, ArrowRight, Loader2, User, MapPin, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

const companyTypes = [
  { value: "restaurante", label: "Restaurante" },
  { value: "supermercado", label: "Supermercado" },
  { value: "distribuidor", label: "Distribuidor" },
  { value: "catering", label: "Catering" },
  { value: "central_abasto", label: "Central de Abasto" },
]

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    tipo: "restaurante",
    rfc: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: ""
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("¡Empresa registrada con éxito!")
        router.push("/shop")
        router.refresh()
      } else {
        toast.error(data.error?.message || "Error al registrar empresa")
      }
    } catch (err) {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_50%)]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />

      <Card className="w-full max-w-2xl border-border/50 bg-card/50 backdrop-blur-xl relative z-10">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4 shadow-lg shadow-primary/20">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Registro AgroLink</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Une tu empresa a la cadena agroalimentaria más grande de México
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-6 md:grid-cols-2">
            {/* Columna 1: Datos Básicos */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Información Básica</h3>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="nombre">Nombre de la Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="nombre" 
                    placeholder="AgroIndustrias S.A." 
                    className="pl-10" 
                    required 
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="tipo">Tipo de Empresa</label>
                <Select onValueChange={(val) => handleChange("tipo", val)} defaultValue={formData.tipo}>
                  <SelectTrigger id="tipo" className="bg-background">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="rfc">RFC</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="rfc" 
                    placeholder="RFC123456789" 
                    className="pl-10" 
                    required 
                    value={formData.rfc}
                    onChange={(e) => handleChange("rfc", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="email">Email Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="compras@empresa.com" 
                    className="pl-10" 
                    required 
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="password">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10" 
                    required 
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Columna 2: Contacto y Ubicación */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">Contacto y Ubicación</h3>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="telefono">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="telefono" 
                    placeholder="55 1234 5678" 
                    className="pl-10" 
                    value={formData.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground" htmlFor="direccion">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="direccion" 
                    placeholder="Av. Principal #123" 
                    className="pl-10" 
                    value={formData.direccion}
                    onChange={(e) => handleChange("direccion", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="ciudad">Ciudad</label>
                  <Input 
                    id="ciudad" 
                    placeholder="Acapulco" 
                    value={formData.ciudad}
                    onChange={(e) => handleChange("ciudad", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="estado">Estado</label>
                  <Input 
                    id="estado" 
                    placeholder="Guerrero" 
                    value={formData.estado}
                    onChange={(e) => handleChange("estado", e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Al registrarte, se generará automáticamente tu **API Key** para integraciones corporativas con tus sistemas internos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all font-semibold" type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center">
                  Crear Cuenta de Empresa <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Inicia Sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
