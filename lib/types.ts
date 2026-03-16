// AgroLink - Tipos de datos principales

export type UnidadMedida = "kg" | "tonelada" | "pieza" | "caja" | "manojo"

export type TipoEmpresa =
  | "restaurante"
  | "supermercado"
  | "distribuidor"
  | "catering"
  | "central_abasto"

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "en_preparacion"
  | "enviado"
  | "entregado"
  | "cancelado"

export interface Categoria {
  id: number
  nombre: string
  descripcion: string
  created_at: string
}

export interface Producto {
  id: number
  nombre: string
  categoria_id: number
  precio_mayoreo: number
  unidad_medida: UnidadMedida
  cantidad_disponible: number
  fecha_cosecha: string
  fecha_caducidad: string
  descripcion: string
  imagen_url: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Empresa {
  id: number
  nombre: string
  tipo: TipoEmpresa
  rfc: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  estado: string
  activo: boolean
  created_at: string
}

export interface ApiKey {
  id: number
  empresa_id: number
  api_key: string
  nombre: string
  activo: boolean
  ultimo_uso: string | null
  created_at: string
}

export interface Pedido {
  id: number
  empresa_id: number
  estado: EstadoPedido
  total: number
  notas: string
  fecha_entrega_estimada: string
  created_at: string
  updated_at: string
}

export interface DetallePedido {
  id: number
  pedido_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}

// DTOs para crear/actualizar
export interface CreateProductoDTO {
  nombre: string
  categoria_id: number
  precio_mayoreo: number
  unidad_medida: UnidadMedida
  cantidad_disponible: number
  fecha_cosecha?: string
  fecha_caducidad?: string
  descripcion?: string
  imagen_url?: string
}

export interface CreateEmpresaDTO {
  nombre: string
  tipo: TipoEmpresa
  rfc: string
  email: string
  telefono?: string
  direccion?: string
  ciudad?: string
  estado?: string
}

export interface CreatePedidoDTO {
  empresa_id: number
  notas?: string
  fecha_entrega_estimada?: string
  items: {
    producto_id: number
    cantidad: number
  }[]
}

export interface CreateCategoriaDTO {
  nombre: string
  descripcion?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
  }
  meta?: {
    total: number
    page: number
    limit: number
  }
}

export interface Stats {
  total_productos: number
  total_empresas: number
  total_pedidos: number
  ingresos_totales: number
  productos_activos: number
  pedidos_pendientes: number
  pedidos_entregados: number
  productos_por_categoria: { categoria: string; cantidad: number }[]
  pedidos_por_estado: { estado: string; cantidad: number }[]
  ventas_mensuales: { mes: string; total: number }[]
  productos_mas_vendidos: { nombre: string; cantidad: number }[]
}
