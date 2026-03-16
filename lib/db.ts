import { Pool } from 'pg';
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

// Configuración del Pool de PostgreSQL (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para Supabase en muchas configuraciones de cliente
  }
});

class Database {
  private async query<T>(text: string, params?: any[]): Promise<T[]> {
    const client = await pool.connect();
    try {
      const res = await client.query(text, params);
      return res.rows;
    } finally {
      client.release();
    }
  }

  // --- CATEGORIAS ---
  async getCategorias(): Promise<Categoria[]> {
    return this.query<Categoria>("SELECT * FROM categorias ORDER BY nombre ASC");
  }

  async getCategoriaById(id: number): Promise<Categoria | undefined> {
    const rows = await this.query<Categoria>("SELECT * FROM categorias WHERE id = $1", [id]);
    return rows[0];
  }

  async createCategoria(data: CreateCategoriaDTO): Promise<Categoria> {
    const rows = await this.query<Categoria>(
      "INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING *",
      [data.nombre, data.descripcion || ""]
    );
    return rows[0];
  }

  async updateCategoria(id: number, data: Partial<CreateCategoriaDTO>): Promise<Categoria | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.nombre) { fields.push(`nombre = $${idx++}`); values.push(data.nombre); }
    if (data.descripcion !== undefined) { fields.push(`descripcion = $${idx++}`); values.push(data.descripcion); }

    if (fields.length === 0) return this.getCategoriaById(id).then(c => c || null);

    values.push(id);
    const rows = await this.query<Categoria>(
      `UPDATE categorias SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  }

  async deleteCategoria(id: number): Promise<boolean> {
    const res = await pool.query("DELETE FROM categorias WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- PRODUCTOS ---
  async getProductos(filters?: {
    categoria_id?: number
    activo?: boolean
    search?: string
    page?: number
    limit?: number
    sort_by?: string
    sort_order?: "asc" | "desc"
  }): Promise<{ data: Producto[]; total: number }> {
    let where = "WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (filters?.categoria_id) {
      where += ` AND categoria_id = $${idx++}`;
      params.push(filters.categoria_id);
    }
    if (filters?.activo !== undefined) {
      where += ` AND activo = $${idx++}`;
      params.push(filters.activo);
    }
    if (filters?.search) {
      where += ` AND (LOWER(nombre) LIKE $${idx} OR LOWER(descripcion) LIKE $${idx})`;
      params.push(`%${filters.search.toLowerCase()}%`);
      idx++;
    }

    const countRes = await this.query<{ count: string }>(`SELECT COUNT(*) FROM productos ${where}`, params);
    const total = parseInt(countRes[0].count);

    let orderBy = "ORDER BY created_at DESC";
    if (filters?.sort_by) {
      const direction = filters.sort_order === "desc" ? "DESC" : "ASC";
      // Validar sort_by para evitar inyección SQL simple
      const allowed = ["id", "nombre", "precio_mayoreo", "cantidad_disponible", "created_at"];
      if (allowed.includes(filters.sort_by)) {
        orderBy = `ORDER BY ${filters.sort_by} ${direction}`;
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    const dataParams = [...params, limit, offset];
    const data = await this.query<Producto>(
      `SELECT * FROM productos ${where} ${orderBy} LIMIT $${idx++} OFFSET $${idx++}`,
      dataParams
    );

    return { data, total };
  }

  async getProductoById(id: number): Promise<Producto | undefined> {
    const rows = await this.query<Producto>("SELECT * FROM productos WHERE id = $1", [id]);
    return rows[0];
  }

  async createProducto(data: CreateProductoDTO): Promise<Producto> {
    const rows = await this.query<Producto>(
      `INSERT INTO productos (nombre, categoria_id, precio_mayoreo, unidad_medida, cantidad_disponible, fecha_cosecha, fecha_caducidad, descripcion, imagen_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [data.nombre, data.categoria_id, data.precio_mayoreo, data.unidad_medida, data.cantidad_disponible, data.fecha_cosecha || null, data.fecha_caducidad || null, data.descripcion || "", data.imagen_url || ""]
    );
    return rows[0];
  }

  async updateProducto(id: number, data: Partial<CreateProductoDTO & { activo: boolean }>): Promise<Producto | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowedFields = ["nombre", "categoria_id", "precio_mayoreo", "unidad_medida", "cantidad_disponible", "fecha_cosecha", "fecha_caducidad", "descripcion", "imagen_url", "activo"];
    
    for (const key of allowedFields) {
      if ((data as any)[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push((data as any)[key]);
      }
    }

    if (fields.length === 0) return this.getProductoById(id).then(p => p || null);

    fields.push(`updated_at = NOW()`);
    values.push(id);
    const rows = await this.query<Producto>(
      `UPDATE productos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  }

  async deleteProducto(id: number): Promise<boolean> {
    const res = await pool.query("DELETE FROM productos WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- EMPRESAS ---
  async getEmpresas(filters?: {
    tipo?: string
    activo?: boolean
    search?: string
    page?: number
    limit?: number
  }): Promise<{ data: Empresa[]; total: number }> {
    let where = "WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (filters?.tipo) {
      where += ` AND tipo = $${idx++}`;
      params.push(filters.tipo);
    }
    if (filters?.activo !== undefined) {
      where += ` AND activo = $${idx++}`;
      params.push(filters.activo);
    }
    if (filters?.search) {
      where += ` AND (LOWER(nombre) LIKE $${idx} OR LOWER(email) LIKE $${idx})`;
      params.push(`%${filters.search.toLowerCase()}%`);
      idx++;
    }

    const countRes = await this.query<{ count: string }>(`SELECT COUNT(*) FROM empresas ${where}`, params);
    const total = parseInt(countRes[0].count);

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    const dataParams = [...params, limit, offset];
    const data = await this.query<Empresa>(
      `SELECT * FROM empresas ${where} ORDER BY nombre ASC LIMIT $${idx++} OFFSET $${idx++}`,
      dataParams
    );

    return { data, total };
  }

  async getEmpresaById(id: number): Promise<Empresa | undefined> {
    const rows = await this.query<Empresa>("SELECT * FROM empresas WHERE id = $1", [id]);
    return rows[0];
  }

  async getEmpresaByEmail(email: string): Promise<(Empresa & { password?: string }) | undefined> {
    const rows = await this.query<any>("SELECT * FROM empresas WHERE email = $1", [email]);
    return rows[0];
  }

  async createEmpresa(data: CreateEmpresaDTO): Promise<Empresa> {
    const rows = await this.query<Empresa>(
      `INSERT INTO empresas (nombre, tipo, rfc, email, telefono, direccion, ciudad, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [data.nombre, data.tipo, data.rfc, data.email, data.telefono || "", data.direccion || "", data.ciudad || "", data.estado || ""]
    );
    return rows[0];
  }

  async updateEmpresa(id: number, data: Partial<CreateEmpresaDTO & { activo: boolean }>): Promise<Empresa | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    const allowedFields = ["nombre", "tipo", "rfc", "email", "telefono", "direccion", "ciudad", "estado", "activo"];
    for (const key of allowedFields) {
      if ((data as any)[key] !== undefined) {
        fields.push(`${key} = $${idx++}`);
        values.push((data as any)[key]);
      }
    }

    if (fields.length === 0) return this.getEmpresaById(id).then(e => e || null);

    values.push(id);
    const rows = await this.query<Empresa>(
      `UPDATE empresas SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  }

  async deleteEmpresa(id: number): Promise<boolean> {
    const res = await pool.query("DELETE FROM empresas WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- API KEYS ---
  async getApiKeys(): Promise<ApiKey[]> {
    return this.query<ApiKey>("SELECT * FROM api_keys ORDER BY created_at DESC");
  }

  async getApiKeysByEmpresa(empresaId: number): Promise<ApiKey[]> {
    return this.query<ApiKey>("SELECT * FROM api_keys WHERE empresa_id = $1", [empresaId]);
  }

  async validateApiKey(key: string): Promise<{ valid: boolean; empresa?: Empresa }> {
    const query = `
      SELECT a.*, e.nombre as empresa_nombre, e.activo as empresa_activo
      FROM api_keys a
      JOIN empresas e ON a.empresa_id = e.id
      WHERE a.api_key = $1 AND a.activo = true AND e.activo = true
    `;
    const rows = await this.query<any>(query, [key]);
    
    if (rows.length === 0) return { valid: false };

    // Update last use async
    pool.query("UPDATE api_keys SET ultimo_uso = NOW() WHERE api_key = $1", [key]);

    // Re-fetch full empresa for compatibility
    const empresa = await this.getEmpresaById(rows[0].empresa_id);

    return { valid: true, empresa };
  }

  async createApiKey(empresaId: number, nombre: string): Promise<ApiKey> {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let randomPart = ""
    for (let i = 0; i < 24; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const keyString = `ak_live_${randomPart}`;
    
    const rows = await this.query<ApiKey>(
      "INSERT INTO api_keys (empresa_id, api_key, nombre) VALUES ($1, $2, $3) RETURNING *",
      [empresaId, keyString, nombre]
    );
    return rows[0];
  }

  async toggleApiKey(id: number): Promise<ApiKey | null> {
    const rows = await this.query<ApiKey>(
      "UPDATE api_keys SET activo = NOT activo WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0] || null;
  }

  async deleteApiKey(id: number): Promise<boolean> {
    const res = await pool.query("DELETE FROM api_keys WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // --- PEDIDOS ---
  async getPedidos(filters?: {
    empresa_id?: number
    estado?: string
    page?: number
    limit?: number
  }): Promise<{ data: Pedido[]; total: number }> {
    let where = "WHERE 1=1";
    const params: any[] = [];
    let idx = 1;

    if (filters?.empresa_id) {
      where += ` AND empresa_id = $${idx++}`;
      params.push(filters.empresa_id);
    }
    if (filters?.estado) {
      where += ` AND estado = $${idx++}`;
      params.push(filters.estado);
    }

    const countRes = await this.query<{ count: string }>(`SELECT COUNT(*) FROM pedidos ${where}`, params);
    const total = parseInt(countRes[0].count);

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;

    const dataParams = [...params, limit, offset];
    const data = await this.query<Pedido>(
      `SELECT * FROM pedidos ${where} ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`,
      dataParams
    );

    return { data, total };
  }

  async getPedidoById(id: number): Promise<(Pedido & { detalles: (DetallePedido & { producto_nombre?: string })[], empresa_nombre?: string }) | null> {
    const pedidoRows = await this.query<Pedido>("SELECT * FROM pedidos WHERE id = $1", [id]);
    if (pedidoRows.length === 0) return null;
    const pedido = pedidoRows[0];

    const detalles = await this.query<any>(`
      SELECT d.*, p.nombre as producto_nombre
      FROM detalle_pedidos d
      LEFT JOIN productos p ON d.producto_id = p.id
      WHERE d.pedido_id = $1
    `, [id]);

    const empresaRows = await this.query<Empresa>("SELECT nombre FROM empresas WHERE id = $1", [pedido.empresa_id]);
    
    return { 
      ...pedido, 
      detalles, 
      empresa_nombre: empresaRows[0]?.nombre 
    };
  }

  async createPedido(data: CreatePedidoDTO): Promise<Pedido & { detalles: DetallePedido[] }> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      let total = 0;
      const itemsConPrecio = [];

      for (const item of data.items) {
        const prodRes = await client.query("SELECT precio_mayoreo FROM productos WHERE id = $1", [item.producto_id]);
        if (prodRes.rows.length > 0) {
          const precio = prodRes.rows[0].precio_mayoreo;
          const subtotal = precio * item.cantidad;
          total += subtotal;
          itemsConPrecio.push({ ...item, precio, subtotal });
        }
      }

      const pedidoRes = await client.query(
        `INSERT INTO pedidos (empresa_id, estado, total, notas, fecha_entrega_estimada) 
         VALUES ($1, 'pendiente', $2, $3, $4) RETURNING *`,
        [data.empresa_id, total, data.notas || "", data.fecha_entrega_estimada || null]
      );
      const pedido = pedidoRes.rows[0];

      const detalles = [];
      for (const item of itemsConPrecio) {
        const detRes = await client.query(
          `INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [pedido.id, item.producto_id, item.cantidad, item.precio, item.subtotal]
        );
        detalles.push(detRes.rows[0]);
      }

      await client.query('COMMIT');
      return { ...pedido, detalles };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async updatePedidoEstado(id: number, estado: EstadoPedido): Promise<Pedido | null> {
    const rows = await this.query<Pedido>(
      "UPDATE pedidos SET estado = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [estado, id]
    );
    return rows[0] || null;
  }

  async deletePedido(id: number): Promise<boolean> {
    // Soft delete or just cancel
    const res = await pool.query(
      "UPDATE pedidos SET estado = 'cancelado', updated_at = NOW() WHERE id = $1",
      [id]
    );
    return (res.rowCount ?? 0) > 0;
  }

  // --- STATS ---
  async getStats(): Promise<Stats> {
    const totalProd = await this.query<{ count: string }>("SELECT COUNT(*) FROM productos");
    const totalEmp = await this.query<{ count: string }>("SELECT COUNT(*) FROM empresas");
    const totalPed = await this.query<{ count: string }>("SELECT COUNT(*) FROM pedidos");
    const ingresos = await this.query<{ sum: string }>("SELECT SUM(total) FROM pedidos WHERE estado != 'cancelado'");
    const prodActivos = await this.query<{ count: string }>("SELECT COUNT(*) FROM productos WHERE activo = true");
    const pedPend = await this.query<{ count: string }>("SELECT COUNT(*) FROM pedidos WHERE estado = 'pendiente'");
    const pedEnt = await this.query<{ count: string }>("SELECT COUNT(*) FROM pedidos WHERE estado = 'entregado'");

    const prodPorCat = await this.query<any>(`
      SELECT c.nombre as categoria, COUNT(p.id) as cantidad
      FROM categorias c
      LEFT JOIN productos p ON c.id = p.categoria_id
      GROUP BY c.id, c.nombre
    `);

    const pedPorEstado = await this.query<any>(`
      SELECT estado, COUNT(*) as cantidad
      FROM pedidos
      GROUP BY estado
    `);

    // Ventas mensuales (últimos 12 meses simplificado)
    const ventasMensuales = await this.query<any>(`
      SELECT 
        TO_CHAR(created_at, 'Mon') as mes,
        EXTRACT(MONTH FROM created_at) as mes_num,
        SUM(total) as total
      FROM pedidos
      WHERE estado != 'cancelado'
      GROUP BY mes, mes_num
      ORDER BY mes_num
    `);

    const prodMasVendidos = await this.query<any>(`
      SELECT p.nombre, SUM(d.cantidad) as cantidad
      FROM detalle_pedidos d
      JOIN productos p ON d.producto_id = p.id
      JOIN pedidos ped ON d.pedido_id = ped.id
      WHERE ped.estado != 'cancelado'
      GROUP BY p.id, p.nombre
      ORDER BY cantidad DESC
      LIMIT 8
    `);

    return {
      total_productos: parseInt(totalProd[0].count),
      total_empresas: parseInt(totalEmp[0].count),
      total_pedidos: parseInt(totalPed[0].count),
      ingresos_totales: parseFloat(ingresos[0].sum || "0"),
      productos_activos: parseInt(prodActivos[0].count),
      pedidos_pendientes: parseInt(pedPend[0].count),
      pedidos_entregados: parseInt(pedEnt[0].count),
      productos_por_categoria: prodPorCat.map((r: any) => ({ ...r, cantidad: parseInt(r.cantidad) })),
      pedidos_por_estado: pedPorEstado.map((r: any) => ({ ...r, cantidad: parseInt(r.cantidad) })),
      ventas_mensuales: ventasMensuales.map((r: any) => ({ mes: r.mes, total: parseFloat(r.total) })),
      productos_mas_vendidos: prodMasVendidos.map((r: any) => ({ ...r, cantidad: parseInt(r.cantidad) })),
    };
  }
}

// Singleton instance
const globalForDb = globalThis as unknown as { db: Database | undefined }
export const db = globalForDb.db ?? new Database()
if (process.env.NODE_ENV !== "production") globalForDb.db = db
