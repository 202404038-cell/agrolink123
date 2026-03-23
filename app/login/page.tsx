"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sprout, Lock, Mail, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      // Verificamos si la respuesta es exitosa (status 200)
      if (res.ok) {
        const data = await res.json()
        toast.success("¡Bienvenido de nuevo!")
        
        // REDIRECCIÓN DIRECTA A SHOP
        router.push("/shop")
        router.refresh() 
      } else {
        const errorData = await res.json()
        toast.error(errorData.error?.message || "Credenciales incorrectas")
      }
    } catch (err: any) {
      console.error("[Login Error]", err)
      toast.error("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.05),transparent_50%)]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-xl relative z-10 shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4 shadow-lg shadow-primary/20">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-emerald-800">AgroLink</CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Ingresa tus credenciales para acceder a la tienda
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="rostifeliz@gmail.com"
                  type="email"
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-background/50"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center">
                  Iniciar Sesión <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
            <div className="text-sm text-muted-foreground text-center">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-emerald-600 hover:underline font-medium">
                Regístrate aquí
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}