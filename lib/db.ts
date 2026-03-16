import type {
  Categoria,
  Producto,
  Empresa,
  ApiKey,
  Pedido,
  DetallePedido,
  CreateProductoDTO,
  CreateEmpresaDTO,
  CreatePedidoDTO,
  CreateCategoriaDTO,
  EstadoPedido,
  Stats,
} from "./types"
import {
  categoriasSeed,
  productosSeed,
  empresasSeed,
  apiKeysSeed,
  pedidosSeed,
  detallePedidosSeed,
} from "./seed-data"

// In-memory database simulating MySQL structure
class Database {
  categorias: Categoria[]
  productos: Producto[]
  empresas: Empresa[]
  api_keys: ApiKey[]
  pedidos: Pedido[]
  detalle_pedidos: DetallePedido[]

  private nextIds: Record<string, number>

  constructor() {
    this.categorias = [...categoriasSeed]
    this.productos = [...productosSeed]
    this.empresas = [...empresasSeed]
    this.api_keys = [...apiKeysSeed]
    this.pedidos = [...pedidosSeed]
    this.detalle_pedidos = [...detallePedidosSeed]

    this.nextIds = {
      categorias: 7,
      productos: 19,
      empresas: 8,
      api_keys: 8,
      pedidos: 11,
      detalle_pedidos: 63,
    }
  }

  private getNextId(table: string): number {
    const id = this.nextIds[table]
    this.nextIds[table] = id + 1
    return id
  }

  private now(): string {
    return new Date().toISOString()
  }

  // --- CATEGORIAS ---
  getCategorias(): Categoria[] {
    return [...this.categorias]
  }

  getCategoriaById(id: number): Categoria | undefined {
    return this.categorias.find((c) => c.id === id)
  }

  createCategoria(data: CreateCategoriaDTO): Categoria {
    const cat: Categoria = {
      id: this.getNextId("categorias"),
      nombre: data.nombre,
      descripcion: data.descripcion || "",
      created_at: this.now(),
    }
    this.categorias.push(cat)
    return cat
  }

  updateCategoria(id: number, data: Partial<CreateCategoriaDTO>): Categoria | null {
    const idx = this.categorias.findIndex((c) => c.id === id)
    if (idx === -1) return null
    this.categorias[idx] = { ...this.categorias[idx], ...data }
    return this.categorias[idx]
  }

  deleteCategoria(id: number): boolean {
    const idx = this.categorias.findIndex((c) => c.id === id)
    if (idx === -1) return false
    this.categorias.splice(idx, 1)
    return true
  }

  // --- PRODUCTOS ---
  getProductos(filters?: {
    categoria_id?: number
    activo?: boolean
    search?: string
    page?: number
    limit?: number
    sort_by?: string
    sort_order?: "asc" | "desc"
  }): { data: Producto[]; total: number } {
    let results = [...this.productos]

    if (filters?.categoria_id) {
      results = results.filter((p) => p.categoria_id === filters.categoria_id)
    }
    if (filters?.activo !== undefined) {
      results = results.filter((p) => p.activo === filters.activo)
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      results = results.filter(
        (p) => p.nombre.toLowerCase().includes(s) || p.descripcion.toLowerCase().includes(s)
      )
    }

    if (filters?.sort_by) {
      const order = filters.sort_order === "desc" ? -1 : 1
      results.sort((a, b) => {
        const aVal = a[filters.sort_by as keyof Producto]
        const bVal = b[filters.sort_by as keyof Producto]
        if (typeof aVal === "number" && typeof bVal === "number") return (aVal - bVal) * order
        return String(aVal).localeCompare(String(bVal)) * order
      })
    }

    const total = results.length
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const start = (page - 1) * limit
    results = results.slice(start, start + limit)

    return { data: results, total }
  }

  getProductoById(id: number): Producto | undefined {
    return this.productos.find((p) => p.id === id)
  }

  createProducto(data: CreateProductoDTO): Producto {
    const prod: Producto = {
      id: this.getNextId("productos"),
      nombre: data.nombre,
      categoria_id: data.categoria_id,
      precio_mayoreo: data.precio_mayoreo,
      unidad_medida: data.unidad_medida,
      cantidad_disponible: data.cantidad_disponible,
      fecha_cosecha: data.fecha_cosecha || "",
      fecha_caducidad: data.fecha_caducidad || "",
      descripcion: data.descripcion || "",
      imagen_url: data.imagen_url || "",
      activo: true,
      created_at: this.now(),
      updated_at: this.now(),
    }
    this.productos.push(prod)
    return prod
  }

  updateProducto(id: number, data: Partial<CreateProductoDTO & { activo: boolean }>): Producto | null {
    const idx = this.productos.findIndex((p) => p.id === id)
    if (idx === -1) return null
    this.productos[idx] = { ...this.productos[idx], ...data, updated_at: this.now() }
    return this.productos[idx]
  }

  deleteProducto(id: number): boolean {
    const idx = this.productos.findIndex((p) => p.id === id)
    if (idx === -1) return false
    this.productos.splice(idx, 1)
    return true
  }

  // --- EMPRESAS ---
  getEmpresas(filters?: {
    tipo?: string
    activo?: boolean
    search?: string
    page?: number
    limit?: number
  }): { data: Empresa[]; total: number } {
    let results = [...this.empresas]

    if (filters?.tipo) {
      results = results.filter((e) => e.tipo === filters.tipo)
    }
    if (filters?.activo !== undefined) {
      results = results.filter((e) => e.activo === filters.activo)
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      results = results.filter(
        (e) => e.nombre.toLowerCase().includes(s) || e.email.toLowerCase().includes(s)
      )
    }

    const total = results.length
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const start = (page - 1) * limit
    results = results.slice(start, start + limit)

    return { data: results, total }
  }

  getEmpresaById(id: number): Empresa | undefined {
    return this.empresas.find((e) => e.id === id)
  }

  createEmpresa(data: CreateEmpresaDTO): Empresa {
    const emp: Empresa = {
      id: this.getNextId("empresas"),
      nombre: data.nombre,
      tipo: data.tipo,
      rfc: data.rfc,
      email: data.email,
      telefono: data.telefono || "",
      direccion: data.direccion || "",
      ciudad: data.ciudad || "",
      estado: data.estado || "",
      activo: true,
      created_at: this.now(),
    }
    this.empresas.push(emp)
    return emp
  }

  updateEmpresa(id: number, data: Partial<CreateEmpresaDTO & { activo: boolean }>): Empresa | null {
    const idx = this.empresas.findIndex((e) => e.id === id)
    if (idx === -1) return null
    this.empresas[idx] = { ...this.empresas[idx], ...data }
    return this.empresas[idx]
  }

  deleteEmpresa(id: number): boolean {
    const idx = this.empresas.findIndex((e) => e.id === id)
    if (idx === -1) return false
    this.empresas.splice(idx, 1)
    return true
  }

  // --- API KEYS ---
  getApiKeys(): ApiKey[] {
    return [...this.api_keys]
  }

  getApiKeysByEmpresa(empresaId: number): ApiKey[] {
    return this.api_keys.filter((k) => k.empresa_id === empresaId)
  }

  validateApiKey(key: string): { valid: boolean; empresa?: Empresa } {
    const apiKey = this.api_keys.find((k) => k.api_key === key && k.activo)
    if (!apiKey) return { valid: false }

    const empresa = this.empresas.find((e) => e.id === apiKey.empresa_id && e.activo)
    if (!empresa) return { valid: false }

    // Update last use
    const idx = this.api_keys.findIndex((k) => k.id === apiKey.id)
    if (idx !== -1) this.api_keys[idx].ultimo_uso = this.now()

    return { valid: true, empresa }
  }

  createApiKey(empresaId: number, nombre: string): ApiKey {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let randomPart = ""
    for (let i = 0; i < 24; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const key: ApiKey = {
      id: this.getNextId("api_keys"),
      empresa_id: empresaId,
      api_key: `ak_live_${randomPart}`,
      nombre,
      activo: true,
      ultimo_uso: null,
      created_at: this.now(),
    }
    this.api_keys.push(key)
    return key
  }

  toggleApiKey(id: number): ApiKey | null {
    const idx = this.api_keys.findIndex((k) => k.id === id)
    if (idx === -1) return null
    this.api_keys[idx].activo = !this.api_keys[idx].activo
    return this.api_keys[idx]
  }

  deleteApiKey(id: number): boolean {
    const idx = this.api_keys.findIndex((k) => k.id === id)
    if (idx === -1) return false
    this.api_keys.splice(idx, 1)
    return true
  }

  // --- PEDIDOS ---
  getPedidos(filters?: {
    empresa_id?: number
    estado?: string
    page?: number
    limit?: number
  }): { data: Pedido[]; total: number } {
    let results = [...this.pedidos]

    if (filters?.empresa_id) {
      results = results.filter((p) => p.empresa_id === filters.empresa_id)
    }
    if (filters?.estado) {
      results = results.filter((p) => p.estado === filters.estado)
    }

    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    const total = results.length
    const page = filters?.page || 1
    const limit = filters?.limit || 20
    const start = (page - 1) * limit
    results = results.slice(start, start + limit)

    return { data: results, total }
  }

  getPedidoById(id: number): (Pedido & { detalles: (DetallePedido & { producto_nombre?: string })[], empresa_nombre?: string }) | null {
    const pedido = this.pedidos.find((p) => p.id === id)
    if (!pedido) return null

    const detalles = this.detalle_pedidos
      .filter((d) => d.pedido_id === id)
      .map((d) => {
        const prod = this.productos.find((p) => p.id === d.producto_id)
        return { ...d, producto_nombre: prod?.nombre }
      })
    const empresa = this.empresas.find((e) => e.id === pedido.empresa_id)

    return { ...pedido, detalles, empresa_nombre: empresa?.nombre }
  }

  createPedido(data: CreatePedidoDTO): Pedido & { detalles: DetallePedido[] } {
    let total = 0
    const detalles: DetallePedido[] = []

    for (const item of data.items) {
      const producto = this.productos.find((p) => p.id === item.producto_id)
      if (!producto) continue
      const subtotal = producto.precio_mayoreo * item.cantidad
      total += subtotal
      detalles.push({
        id: this.getNextId("detalle_pedidos"),
        pedido_id: 0, // will set below
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: producto.precio_mayoreo,
        subtotal,
      })
    }

    const pedido: Pedido = {
      id: this.getNextId("pedidos"),
      empresa_id: data.empresa_id,
      estado: "pendiente",
      total,
      notas: data.notas || "",
      fecha_entrega_estimada: data.fecha_entrega_estimada || "",
      created_at: this.now(),
      updated_at: this.now(),
    }

    this.pedidos.push(pedido)

    for (const d of detalles) {
      d.pedido_id = pedido.id
      this.detalle_pedidos.push(d)
    }

    return { ...pedido, detalles }
  }

  updatePedidoEstado(id: number, estado: EstadoPedido): Pedido | null {
    const idx = this.pedidos.findIndex((p) => p.id === id)
    if (idx === -1) return null
    this.pedidos[idx].estado = estado
    this.pedidos[idx].updated_at = this.now()
    return this.pedidos[idx]
  }

  deletePedido(id: number): boolean {
    const idx = this.pedidos.findIndex((p) => p.id === id)
    if (idx === -1) return false
    this.pedidos[idx].estado = "cancelado"
    this.pedidos[idx].updated_at = this.now()
    return true
  }

  // --- STATS ---
  getStats(): Stats {
    const productosActivos = this.productos.filter((p) => p.activo)
    const pedidosNoCancel = this.pedidos.filter((p) => p.estado !== "cancelado")

    const productosPorCategoria = this.categorias.map((c) => ({
      categoria: c.nombre,
      cantidad: this.productos.filter((p) => p.categoria_id === c.id).length,
    }))

    const estados: EstadoPedido[] = ["pendiente", "confirmado", "en_preparacion", "enviado", "entregado", "cancelado"]
    const pedidosPorEstado = estados.map((e) => ({
      estado: e,
      cantidad: this.pedidos.filter((p) => p.estado === e).length,
    }))

    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const ventasMensuales = meses.map((mes, idx) => {
      const pedidosMes = pedidosNoCancel.filter((p) => {
        const d = new Date(p.created_at)
        return d.getMonth() === idx
      })
      return { mes, total: pedidosMes.reduce((sum, p) => sum + p.total, 0) }
    })

    // Productos mas vendidos
    const productoVentas: Record<number, number> = {}
    for (const d of this.detalle_pedidos) {
      const pedido = this.pedidos.find((p) => p.id === d.pedido_id)
      if (pedido && pedido.estado !== "cancelado") {
        productoVentas[d.producto_id] = (productoVentas[d.producto_id] || 0) + d.cantidad
      }
    }
    const productosMasVendidos = Object.entries(productoVentas)
      .map(([prodId, cantidad]) => {
        const prod = this.productos.find((p) => p.id === Number(prodId))
        return { nombre: prod?.nombre || "Desconocido", cantidad }
      })
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 8)

    return {
      total_productos: this.productos.length,
      total_empresas: this.empresas.length,
      total_pedidos: this.pedidos.length,
      ingresos_totales: pedidosNoCancel.reduce((sum, p) => sum + p.total, 0),
      productos_activos: productosActivos.length,
      pedidos_pendientes: this.pedidos.filter((p) => p.estado === "pendiente").length,
      pedidos_entregados: this.pedidos.filter((p) => p.estado === "entregado").length,
      productos_por_categoria: productosPorCategoria,
      pedidos_por_estado: pedidosPorEstado,
      ventas_mensuales: ventasMensuales,
      productos_mas_vendidos: productosMasVendidos,
    }
  }
}

// Singleton instance
const globalForDb = globalThis as unknown as { db: Database | undefined }
export const db = globalForDb.db ?? new Database()
if (process.env.NODE_ENV !== "production") globalForDb.db = db
