"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sprout,
  ArrowLeft,
  Send,
  Copy,
  ChevronDown,
  ChevronRight,
  Lock,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE"
  path: string
  description: string
  auth: boolean
  params?: { name: string; type: string; required: boolean; description: string }[]
  body?: string
  response?: string
}

interface EndpointGroup {
  name: string
  endpoints: Endpoint[]
}

const apiGroups: EndpointGroup[] = [
  {
    name: "Autenticacion",
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/auth/register",
        description: "Registrar una nueva empresa y obtener API Key",
        auth: false,
        body: `{
  "nombre": "Mi Restaurante",
  "tipo": "restaurante",
  "rfc": "MRS210315AB1",
  "email": "contacto@mirestaurante.mx",
  "telefono": "442-123-4567",
  "ciudad": "Queretaro",
  "estado": "Queretaro"
}`,
        response: `{
  "success": true,
  "data": {
    "empresa": { "id": 8, "nombre": "Mi Restaurante", ... },
    "api_key": {
      "key": "ak_live_...",
      "nombre": "Produccion - Mi Restaurante"
    }
  },
  "message": "Empresa registrada exitosamente."
}`,
      },
      {
        method: "POST",
        path: "/api/v1/auth/validate",
        description: "Validar una API Key existente",
        auth: false,
        body: `{ "api_key": "ak_live_cocina_maria_2025_xK9mP2qR" }`,
        response: `{
  "success": true,
  "data": {
    "valid": true,
    "empresa": { "id": 1, "nombre": "La Cocina de Maria", "tipo": "restaurante" }
  }
}`,
      },
    ],
  },
  {
    name: "Productos",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/productos",
        description: "Listar todos los productos con filtros y paginacion",
        auth: true,
        params: [
          { name: "categoria_id", type: "number", required: false, description: "Filtrar por categoria" },
          { name: "activo", type: "boolean", required: false, description: "Filtrar por estado activo/inactivo" },
          { name: "search", type: "string", required: false, description: "Buscar por nombre o descripcion" },
          { name: "page", type: "number", required: false, description: "Numero de pagina (default: 1)" },
          { name: "limit", type: "number", required: false, description: "Resultados por pagina (default: 20, max: 100)" },
          { name: "sort_by", type: "string", required: false, description: "Campo de ordenamiento" },
          { name: "sort_order", type: "asc|desc", required: false, description: "Direccion del orden" },
        ],
        response: `{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Aguacate Hass",
      "categoria_id": 1,
      "precio_mayoreo": 45.50,
      "unidad_medida": "kg",
      "cantidad_disponible": 2500,
      "activo": true
    }
  ],
  "meta": { "total": 18, "page": 1, "limit": 20 }
}`,
      },
      {
        method: "GET",
        path: "/api/v1/productos/:id",
        description: "Obtener un producto por su ID",
        auth: true,
        response: `{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Aguacate Hass",
    "categoria_id": 1,
    "precio_mayoreo": 45.50,
    "unidad_medida": "kg",
    "cantidad_disponible": 2500,
    "fecha_cosecha": "2025-11-20",
    "fecha_caducidad": "2025-12-10",
    "descripcion": "Aguacate Hass de Michoacan...",
    "activo": true
  }
}`,
      },
      {
        method: "POST",
        path: "/api/v1/productos",
        description: "Crear un nuevo producto",
        auth: true,
        body: `{
  "nombre": "Tomate Cherry",
  "categoria_id": 2,
  "precio_mayoreo": 35.00,
  "unidad_medida": "kg",
  "cantidad_disponible": 500,
  "descripcion": "Tomate cherry organico"
}`,
        response: `{
  "success": true,
  "data": { "id": 19, "nombre": "Tomate Cherry", ... },
  "message": "Producto creado exitosamente"
}`,
      },
      {
        method: "PUT",
        path: "/api/v1/productos/:id",
        description: "Actualizar un producto existente",
        auth: true,
        body: `{ "precio_mayoreo": 40.00, "cantidad_disponible": 800 }`,
      },
      {
        method: "DELETE",
        path: "/api/v1/productos/:id",
        description: "Eliminar un producto",
        auth: true,
      },
    ],
  },
  {
    name: "Empresas",
    endpoints: [
      { method: "GET", path: "/api/v1/empresas", description: "Listar empresas con filtros", auth: true,
        params: [
          { name: "tipo", type: "string", required: false, description: "restaurante|supermercado|distribuidor|catering|central_abasto" },
          { name: "activo", type: "boolean", required: false, description: "Filtrar por estado" },
          { name: "search", type: "string", required: false, description: "Buscar por nombre o email" },
        ],
      },
      { method: "GET", path: "/api/v1/empresas/:id", description: "Obtener empresa por ID", auth: true },
      {
        method: "POST", path: "/api/v1/empresas", description: "Registrar nueva empresa", auth: true,
        body: `{
  "nombre": "Nuevo Restaurante",
  "tipo": "restaurante",
  "rfc": "NRS250101AB1",
  "email": "info@nuevo.mx"
}`,
      },
      { method: "PUT", path: "/api/v1/empresas/:id", description: "Actualizar datos de empresa", auth: true },
      { method: "DELETE", path: "/api/v1/empresas/:id", description: "Eliminar empresa", auth: true },
    ],
  },
  {
    name: "Pedidos",
    endpoints: [
      { method: "GET", path: "/api/v1/pedidos", description: "Listar pedidos con filtros", auth: true,
        params: [
          { name: "empresa_id", type: "number", required: false, description: "Filtrar por empresa" },
          { name: "estado", type: "string", required: false, description: "pendiente|confirmado|en_preparacion|enviado|entregado|cancelado" },
        ],
      },
      {
        method: "GET", path: "/api/v1/pedidos/:id", description: "Obtener pedido con detalles de productos", auth: true,
        response: `{
  "success": true,
  "data": {
    "id": 1,
    "empresa_id": 1,
    "empresa_nombre": "La Cocina de Maria",
    "estado": "entregado",
    "total": 4575.00,
    "detalles": [
      { "producto_id": 1, "producto_nombre": "Aguacate Hass", "cantidad": 50, "precio_unitario": 45.50, "subtotal": 2275.00 }
    ]
  }
}`,
      },
      {
        method: "POST", path: "/api/v1/pedidos", description: "Crear nuevo pedido con items", auth: true,
        body: `{
  "empresa_id": 1,
  "notas": "Entregar temprano",
  "fecha_entrega_estimada": "2025-12-01",
  "items": [
    { "producto_id": 1, "cantidad": 50 },
    { "producto_id": 2, "cantidad": 30 }
  ]
}`,
      },
      {
        method: "PUT", path: "/api/v1/pedidos/:id", description: "Actualizar estado del pedido", auth: true,
        body: `{ "estado": "confirmado" }`,
      },
      { method: "DELETE", path: "/api/v1/pedidos/:id", description: "Cancelar pedido", auth: true },
    ],
  },
  {
    name: "Categorias",
    endpoints: [
      { method: "GET", path: "/api/v1/categorias", description: "Listar todas las categorias", auth: true },
      { method: "GET", path: "/api/v1/categorias/:id", description: "Obtener categoria por ID", auth: true },
      {
        method: "POST", path: "/api/v1/categorias", description: "Crear nueva categoria", auth: true,
        body: `{ "nombre": "Flores Comestibles", "descripcion": "Flores para cocina gourmet" }`,
      },
      { method: "PUT", path: "/api/v1/categorias/:id", description: "Actualizar categoria", auth: true },
      { method: "DELETE", path: "/api/v1/categorias/:id", description: "Eliminar categoria", auth: true },
    ],
  },
  {
    name: "Estadisticas",
    endpoints: [
      {
        method: "GET", path: "/api/v1/stats", description: "Obtener estadisticas generales del sistema", auth: true,
        response: `{
  "success": true,
  "data": {
    "total_productos": 18,
    "total_empresas": 7,
    "total_pedidos": 10,
    "ingresos_totales": 249995.00,
    "productos_activos": 17,
    "pedidos_pendientes": 2,
    "productos_por_categoria": [...],
    "ventas_mensuales": [...],
    "productos_mas_vendidos": [...]
  }
}`,
      },
    ],
  },
]

const methodColors: Record<string, string> = {
  GET: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  POST: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  PUT: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  DELETE: "bg-destructive/20 text-destructive border-destructive/30",
}

export default function DocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(
    apiGroups[0].endpoints[0]
  )
  const [apiKey, setApiKey] = useState("ak_live_cocina_maria_2025_xK9mP2qR")
  const [tryResponse, setTryResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(apiGroups.map((g) => g.name))
  )
  const [copied, setCopied] = useState(false)

  function toggleGroup(name: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  async function tryEndpoint() {
    setLoading(true)
    setTryResponse("")
    try {
      let url = selectedEndpoint.path
      // Replace :id with 1 for demo
      url = url.replace(":id", "1")

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }
      if (selectedEndpoint.auth) {
        headers["X-API-Key"] = apiKey
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      }

      if (
        selectedEndpoint.body &&
        (selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT")
      ) {
        options.body = selectedEndpoint.body
      }

      const res = await fetch(url, options)
      const data = await res.json()
      setTryResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setTryResponse(
        JSON.stringify({ error: "Error de conexion", details: String(err) }, null, 2)
      )
    }
    setLoading(false)
  }

  function copyCurl() {
    let url = selectedEndpoint.path.replace(":id", "1")
    let curl = `curl -X ${selectedEndpoint.method} "${window.location.origin}${url}"`
    if (selectedEndpoint.auth) {
      curl += ` \\\n  -H "X-API-Key: ${apiKey}"`
    }
    curl += ` \\\n  -H "Content-Type: application/json"`
    if (selectedEndpoint.body && (selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT")) {
      curl += ` \\\n  -d '${selectedEndpoint.body.replace(/\n/g, "").replace(/\s+/g, " ")}'`
    }
    navigator.clipboard.writeText(curl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              <span className="font-bold">AgroLink</span>
            </Link>
            <span className="text-sm text-muted-foreground">/ Documentacion API</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Dashboard
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              v1.0
            </Badge>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-0">
        {/* Sidebar - endpoints list */}
        <aside className="hidden w-72 shrink-0 border-r border-border lg:block">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Autenticacion
              </h3>
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <label className="mb-1 text-xs text-muted-foreground">API Key</label>
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="h-8 border-border bg-input font-mono text-xs"
                />
              </div>
            </div>

            {apiGroups.map((group) => (
              <div key={group.name} className="mb-2">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                >
                  {expandedGroups.has(group.name) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  {group.name}
                </button>
                {expandedGroups.has(group.name) && (
                  <div className="ml-2 space-y-0.5">
                    {group.endpoints.map((ep) => (
                      <button
                        key={`${ep.method}-${ep.path}`}
                        onClick={() => {
                          setSelectedEndpoint(ep)
                          setTryResponse("")
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                          selectedEndpoint.path === ep.path &&
                            selectedEndpoint.method === ep.method
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50"
                        )}
                      >
                        <span
                          className={cn(
                            "inline-flex w-14 shrink-0 items-center justify-center rounded px-1.5 py-0.5 font-mono text-[10px] font-bold",
                            methodColors[ep.method]
                          )}
                        >
                          {ep.method}
                        </span>
                        <span className="truncate font-mono">
                          {ep.path.replace("/api/v1/", "/")}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Endpoint info */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2.5 py-1 font-mono text-sm font-bold",
                  methodColors[selectedEndpoint.method]
                )}
              >
                {selectedEndpoint.method}
              </span>
              <code className="font-mono text-lg text-foreground">
                {selectedEndpoint.path}
              </code>
              {selectedEndpoint.auth ? (
                <Lock className="h-4 w-4 text-chart-4" />
              ) : (
                <Globe className="h-4 w-4 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedEndpoint.description}
            </p>
            {selectedEndpoint.auth && (
              <p className="mt-1 text-xs text-chart-4">
                Requiere header: X-API-Key
              </p>
            )}
          </div>

          {/* Query params */}
          {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold">Query Parameters</h3>
              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Parametro
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Tipo
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Requerido
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                        Descripcion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEndpoint.params.map((p) => (
                      <tr
                        key={p.name}
                        className="border-b border-border/50"
                      >
                        <td className="px-4 py-2 font-mono text-xs text-primary">
                          {p.name}
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">
                          {p.type}
                        </td>
                        <td className="px-4 py-2">
                          <Badge
                            variant="secondary"
                            className={
                              p.required
                                ? "bg-destructive/20 text-destructive"
                                : "text-muted-foreground"
                            }
                          >
                            {p.required ? "Si" : "No"}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-xs text-muted-foreground">
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Request body */}
          {selectedEndpoint.body && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold">Request Body</h3>
              <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/30 p-4 font-mono text-sm text-muted-foreground">
                {selectedEndpoint.body}
              </pre>
            </div>
          )}

          {/* Example response */}
          {selectedEndpoint.response && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold">Ejemplo de Respuesta</h3>
              <pre className="overflow-x-auto rounded-lg border border-border bg-secondary/30 p-4 font-mono text-sm text-muted-foreground">
                {selectedEndpoint.response}
              </pre>
            </div>
          )}

          {/* Try It panel */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
              <Send className="h-4 w-4 text-primary" />
              Probar Endpoint
            </h3>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
                <span
                  className={cn(
                    "rounded px-2 py-0.5 font-mono text-xs font-bold",
                    methodColors[selectedEndpoint.method]
                  )}
                >
                  {selectedEndpoint.method}
                </span>
                <code className="font-mono text-sm text-muted-foreground">
                  {selectedEndpoint.path.replace(":id", "1")}
                </code>
              </div>
              <Button
                onClick={tryEndpoint}
                disabled={loading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                {loading ? (
                  <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="mr-2 h-3 w-3" />
                )}
                Enviar
              </Button>
              <Button
                onClick={copyCurl}
                variant="outline"
                size="sm"
                className="border-border text-foreground"
              >
                <Copy className="mr-2 h-3 w-3" />
                {copied ? "Copiado" : "Copiar cURL"}
              </Button>
            </div>

            {tryResponse && (
              <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground">
                  Respuesta:
                </h4>
                <pre className="max-h-96 overflow-auto rounded-lg border border-border bg-card p-4 font-mono text-xs text-muted-foreground">
                  {tryResponse}
                </pre>
              </div>
            )}
          </div>

          {/* Error codes */}
          <div className="mt-8">
            <h3 className="mb-4 text-base font-semibold">Codigos de Error</h3>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">HTTP</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Codigo</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">Descripcion</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { http: 400, code: "VALIDATION_ERROR", desc: "Los datos enviados no pasan la validacion" },
                    { http: 400, code: "INVALID_BODY", desc: "El cuerpo de la peticion no es JSON valido" },
                    { http: 401, code: "MISSING_API_KEY", desc: "No se proporciono el header X-API-Key" },
                    { http: 401, code: "INVALID_API_KEY", desc: "La API Key es invalida o esta desactivada" },
                    { http: 404, code: "NOT_FOUND", desc: "El recurso solicitado no existe" },
                    { http: 400, code: "INVALID_REFERENCE", desc: "Referencia a un recurso inexistente (FK)" },
                  ].map((e) => (
                    <tr key={e.code} className="border-b border-border/50">
                      <td className="px-4 py-2 font-mono text-xs">{e.http}</td>
                      <td className="px-4 py-2 font-mono text-xs text-destructive">{e.code}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
