"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sprout,
  ArrowRight,
  ShoppingCart,
  Building2,
  BarChart3,
  Shield,
  Code2,
  Truck,
  Database,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Code2,
    title: "API REST Completa",
    description:
      "Endpoints CRUD para productos, empresas, pedidos y categorias con validacion Zod y respuestas estandarizadas.",
  },
  {
    icon: Shield,
    title: "Autenticacion API Keys",
    description:
      "Sistema de autenticacion por API Keys para controlar el acceso de cada empresa a los recursos.",
  },
  {
    icon: ShoppingCart,
    title: "Gestion de Pedidos",
    description:
      "Control completo del ciclo de vida de pedidos: pendiente, confirmado, preparacion, envio, entrega.",
  },
  {
    icon: Building2,
    title: "Multi-Empresa",
    description:
      "Soporte para restaurantes, supermercados, distribuidores, catering y centrales de abasto.",
  },
  {
    icon: BarChart3,
    title: "Estadisticas en Tiempo Real",
    description:
      "Dashboard con metricas de ventas, productos mas vendidos, estados de pedidos y tendencias.",
  },
  {
    icon: Database,
    title: "MySQL Workbench Ready",
    description:
      "Scripts SQL completos listos para importar en MySQL Workbench con estructura profesional.",
  },
]

const steps = [
  {
    step: "01",
    icon: Building2,
    title: "Registro de Empresa",
    description: "La empresa se registra via API y obtiene su API Key unica para autenticarse.",
  },
  {
    step: "02",
    icon: Sprout,
    title: "Consulta de Catalogo",
    description: "Accede al catalogo de productos frescos con precios, disponibilidad y categorias.",
  },
  {
    step: "03",
    icon: ShoppingCart,
    title: "Creacion de Pedido",
    description: "Crea pedidos con multiples productos, cantidades y notas de entrega.",
  },
  {
    step: "04",
    icon: Truck,
    title: "Seguimiento y Entrega",
    description: "Rastrea el estado del pedido desde confirmacion hasta entrega final.",
  },
]

export default function LandingPage() {
  const [wsInfo, setWsInfo] = useState<any | null>(null)
  const [wsError, setWsError] = useState<string | null>(null)
  const [wsLoading, setWsLoading] = useState(false)

  async function consultaWS() {
    setWsError(null)
    setWsInfo(null)
    setWsLoading(true)
    try {
      const res = await fetch("/api/health")
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data = await res.json()
      setWsInfo(data)
    } catch (err: any) {
      setWsError(err?.message || "Error desconocido")
    } finally {
      setWsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              AgroLink
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Funcionalidades
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Como Funciona
            </Link>
            <Link
              href="/docs"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Documentacion API
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/shop">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-primary hover:text-primary/80">
                Mercado
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Dashboard
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.25_0.06_152),transparent_70%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Zap className="h-3.5 w-3.5" />
            Web Service Profesional v1.0
          </div>
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Conectando la{" "}
            <span className="text-primary">huerta</span>{" "}
            con la{" "}
            <span className="text-primary">empresa</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            AgroLink es una API REST empresarial B2B que permite a restaurantes,
            supermercados y distribuidores acceder al catalogo de productos
            agricolas frescos, gestionar pedidos y automatizar su cadena de
            suministro.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 bg-primary px-8 text-base text-primary-foreground hover:bg-primary/90"
              >
                Abrir Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                variant="outline"
                size="lg"
                className="h-12 border-border px-8 text-base text-foreground hover:bg-secondary"
              >
                <Code2 className="mr-2 h-5 w-5" />
                Ver Documentacion API
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={consultaWS}
              className="h-12 border border-primary px-6 text-base text-foreground bg-card hover:bg-card/90"
            >
              {wsLoading ? "Consultando..." : "Consulta WS"}
            </Button>
          </div>

          {/* API preview snippet */}
          {/* Panel: Resultado de Consulta WS */}
          {wsInfo || wsError ? (
            <div className="mt-6 rounded-md border border-border bg-muted/5 p-4 text-left">
              <h4 className="mb-2 text-sm font-semibold">Información del WS</h4>
              {wsError ? (
                <div className="text-destructive">Error: {wsError}</div>
              ) : (
                <pre className="max-h-48 overflow-auto rounded bg-card p-3 font-mono text-sm">
                  {JSON.stringify(wsInfo, null, 2)}
                </pre>
              )}
            </div>
          ) : null}
          <div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-destructive/60" />
              <div className="h-3 w-3 rounded-full bg-chart-4/60" />
              <div className="h-3 w-3 rounded-full bg-chart-1/60" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                GET /api/v1/productos
              </span>
            </div>
            <pre className="overflow-x-auto p-4 text-left font-mono text-sm leading-relaxed text-muted-foreground">
              <code>
{`{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Aguacate Hass",
      "precio_mayoreo": 45.50,
      "unidad_medida": "kg",
      "cantidad_disponible": 2500,
      "categoria": "Frutas"
    }
  ],
  "meta": { "total": 18, "page": 1, "limit": 20 }
}`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">
              Arquitectura Profesional
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              Disenado con estandares de la industria: validacion de datos,
              autenticacion, paginacion, y formato de respuestas consistente.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-border bg-secondary/30 px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-balance text-3xl font-bold md:text-4xl">
              Como Funciona
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
              Flujo simplificado de integracion para empresas que desean
              conectarse con la huerta.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="relative">
                <span className="absolute -top-2 right-2 font-mono text-5xl font-bold text-primary/10">
                  {item.step}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">
            Explora la API Ahora
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Accede al dashboard para administrar productos, empresas y pedidos,
            o consulta la documentacion interactiva de la API.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                Ir al Dashboard
              </Button>
            </Link>
            <Link href="/docs">
              <Button
                variant="outline"
                size="lg"
                className="h-12 border-border px-8 text-foreground hover:bg-secondary"
              >
                Documentacion API
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            <span className="font-semibold">AgroLink</span>
            <span className="text-sm text-muted-foreground">
              | Web Service v1.0
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Proyecto Universitario - Computacion en la Nube
          </p>
        </div>
      </footer>
    </div>
  )
}
