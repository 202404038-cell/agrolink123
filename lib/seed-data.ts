import type {
  Categoria,
  Producto,
  Empresa,
  ApiKey,
  Pedido,
  DetallePedido,
} from "./types"

export const categoriasSeed: Categoria[] = [
  { id: 1, nombre: "Frutas", descripcion: "Frutas frescas de temporada cultivadas en nuestras huertas", created_at: "2025-01-15T08:00:00Z" },
  { id: 2, nombre: "Verduras", descripcion: "Verduras organicas y de alta calidad para consumo directo", created_at: "2025-01-15T08:00:00Z" },
  { id: 3, nombre: "Hortalizas", descripcion: "Hortalizas frescas cosechadas diariamente", created_at: "2025-01-15T08:00:00Z" },
  { id: 4, nombre: "Hierbas Aromaticas", descripcion: "Hierbas frescas para cocina gourmet y medicina tradicional", created_at: "2025-01-15T08:00:00Z" },
  { id: 5, nombre: "Cereales y Granos", descripcion: "Granos basicos de la agricultura mexicana", created_at: "2025-01-15T08:00:00Z" },
  { id: 6, nombre: "Tuberculos", descripcion: "Tuberculos y raices de cultivo organico", created_at: "2025-01-15T08:00:00Z" },
]

export const productosSeed: Producto[] = [
  { id: 1, nombre: "Aguacate Hass", categoria_id: 1, precio_mayoreo: 45.50, unidad_medida: "kg", cantidad_disponible: 2500, fecha_cosecha: "2025-11-20", fecha_caducidad: "2025-12-10", descripcion: "Aguacate Hass de Michoacan, calibre mediano, madurez optima para distribucion", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-20T10:00:00Z" },
  { id: 2, nombre: "Tomate Saladette", categoria_id: 2, precio_mayoreo: 18.00, unidad_medida: "kg", cantidad_disponible: 5000, fecha_cosecha: "2025-11-22", fecha_caducidad: "2025-12-05", descripcion: "Tomate saladette rojo firme, ideal para salsas y ensaladas", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-22T10:00:00Z" },
  { id: 3, nombre: "Chile Jalapeno", categoria_id: 3, precio_mayoreo: 22.00, unidad_medida: "kg", cantidad_disponible: 1800, fecha_cosecha: "2025-11-18", fecha_caducidad: "2025-12-08", descripcion: "Chile jalapeno fresco de Veracruz, picor medio-alto", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-18T10:00:00Z" },
  { id: 4, nombre: "Limon Persa", categoria_id: 1, precio_mayoreo: 15.00, unidad_medida: "kg", cantidad_disponible: 8000, fecha_cosecha: "2025-11-21", fecha_caducidad: "2025-12-15", descripcion: "Limon persa sin semilla, alto contenido de jugo", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-21T10:00:00Z" },
  { id: 5, nombre: "Calabaza Criolla", categoria_id: 2, precio_mayoreo: 12.50, unidad_medida: "kg", cantidad_disponible: 3000, fecha_cosecha: "2025-11-19", fecha_caducidad: "2025-12-20", descripcion: "Calabaza criolla de Oaxaca, ideal para cremas y guisos", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-19T10:00:00Z" },
  { id: 6, nombre: "Maiz Blanco", categoria_id: 5, precio_mayoreo: 8.50, unidad_medida: "kg", cantidad_disponible: 15000, fecha_cosecha: "2025-10-15", fecha_caducidad: "2026-04-15", descripcion: "Maiz blanco criollo para tortillas, tamales y pozole", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-10-15T10:00:00Z" },
  { id: 7, nombre: "Frijol Negro Veracruzano", categoria_id: 5, precio_mayoreo: 28.00, unidad_medida: "kg", cantidad_disponible: 6000, fecha_cosecha: "2025-10-20", fecha_caducidad: "2026-06-20", descripcion: "Frijol negro de Veracruz, grano seleccionado y limpio", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-10-20T10:00:00Z" },
  { id: 8, nombre: "Cilantro Fresco", categoria_id: 4, precio_mayoreo: 35.00, unidad_medida: "manojo", cantidad_disponible: 800, fecha_cosecha: "2025-11-23", fecha_caducidad: "2025-11-30", descripcion: "Manojos de cilantro fresco y aromatico, corte del dia", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-23T10:00:00Z" },
  { id: 9, nombre: "Epazote", categoria_id: 4, precio_mayoreo: 30.00, unidad_medida: "manojo", cantidad_disponible: 500, fecha_cosecha: "2025-11-23", fecha_caducidad: "2025-12-01", descripcion: "Epazote fresco para frijoles, quesadillas y sopas", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-23T10:00:00Z" },
  { id: 10, nombre: "Cebolla Blanca", categoria_id: 2, precio_mayoreo: 14.00, unidad_medida: "kg", cantidad_disponible: 4000, fecha_cosecha: "2025-11-20", fecha_caducidad: "2025-12-20", descripcion: "Cebolla blanca mediana, firme y de sabor intenso", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-20T10:00:00Z" },
  { id: 11, nombre: "Papa Alpha", categoria_id: 6, precio_mayoreo: 16.00, unidad_medida: "kg", cantidad_disponible: 7000, fecha_cosecha: "2025-11-15", fecha_caducidad: "2026-01-15", descripcion: "Papa alpha de Puebla, tamano uniforme ideal para restaurantes", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-15T10:00:00Z" },
  { id: 12, nombre: "Zanahoria", categoria_id: 6, precio_mayoreo: 10.00, unidad_medida: "kg", cantidad_disponible: 3500, fecha_cosecha: "2025-11-18", fecha_caducidad: "2025-12-28", descripcion: "Zanahoria organica de Guanajuato, calibre standard", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-18T10:00:00Z" },
  { id: 13, nombre: "Mango Ataulfo", categoria_id: 1, precio_mayoreo: 32.00, unidad_medida: "kg", cantidad_disponible: 1200, fecha_cosecha: "2025-11-10", fecha_caducidad: "2025-11-28", descripcion: "Mango Ataulfo de Chiapas, dulce y sin fibra", imagen_url: "", activo: false, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-10T10:00:00Z" },
  { id: 14, nombre: "Naranja Valencia", categoria_id: 1, precio_mayoreo: 11.00, unidad_medida: "kg", cantidad_disponible: 10000, fecha_cosecha: "2025-11-22", fecha_caducidad: "2025-12-22", descripcion: "Naranja valencia para jugo, alto rendimiento en jugo", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-22T10:00:00Z" },
  { id: 15, nombre: "Nopal Verdura", categoria_id: 3, precio_mayoreo: 20.00, unidad_medida: "kg", cantidad_disponible: 2000, fecha_cosecha: "2025-11-23", fecha_caducidad: "2025-12-03", descripcion: "Nopal limpio y despinado, listo para cocinar", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-23T10:00:00Z" },
  { id: 16, nombre: "Chile Habanero", categoria_id: 3, precio_mayoreo: 65.00, unidad_medida: "kg", cantidad_disponible: 600, fecha_cosecha: "2025-11-20", fecha_caducidad: "2025-12-10", descripcion: "Chile habanero naranja de Yucatan, extra picante", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-20T10:00:00Z" },
  { id: 17, nombre: "Lechuga Romana", categoria_id: 2, precio_mayoreo: 18.50, unidad_medida: "pieza", cantidad_disponible: 1500, fecha_cosecha: "2025-11-23", fecha_caducidad: "2025-11-30", descripcion: "Lechuga romana hidroponica, crujiente y fresca", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-23T10:00:00Z" },
  { id: 18, nombre: "Chayote", categoria_id: 2, precio_mayoreo: 9.00, unidad_medida: "kg", cantidad_disponible: 2200, fecha_cosecha: "2025-11-21", fecha_caducidad: "2025-12-15", descripcion: "Chayote sin espinas de Veracruz, tierno y fresco", imagen_url: "", activo: true, created_at: "2025-01-20T10:00:00Z", updated_at: "2025-11-21T10:00:00Z" },
]

export const empresasSeed: Empresa[] = [
  { id: 1, nombre: "La Cocina de Maria", tipo: "restaurante", rfc: "CMR210315AB1", email: "contacto@lacocinademaria.mx", telefono: "442-123-4567", direccion: "Av. Universidad 234, Col. Centro", ciudad: "Queretaro", estado: "Queretaro", activo: true, created_at: "2025-02-01T09:00:00Z" },
  { id: 2, nombre: "Super Frescos del Norte", tipo: "supermercado", rfc: "SFN190820CD2", email: "compras@superfrescos.mx", telefono: "818-234-5678", direccion: "Blvd. Rogelio Cantu 500, Col. Valle", ciudad: "Monterrey", estado: "Nuevo Leon", activo: true, created_at: "2025-02-10T09:00:00Z" },
  { id: 3, nombre: "Distribuidora Agricola del Bajio", tipo: "distribuidor", rfc: "DAB180512EF3", email: "ventas@disbajio.mx", telefono: "461-345-6789", direccion: "Carr. Celaya-Salamanca Km 5", ciudad: "Celaya", estado: "Guanajuato", activo: true, created_at: "2025-03-05T09:00:00Z" },
  { id: 4, nombre: "Catering Gourmet CDMX", tipo: "catering", rfc: "CGC200105GH4", email: "pedidos@cateringgourmet.mx", telefono: "555-456-7890", direccion: "Calle Durango 180, Col. Roma Norte", ciudad: "Ciudad de Mexico", estado: "CDMX", activo: true, created_at: "2025-03-15T09:00:00Z" },
  { id: 5, nombre: "Central de Abasto Puebla", tipo: "central_abasto", rfc: "CAP170830IJ5", email: "operaciones@cabpuebla.mx", telefono: "222-567-8901", direccion: "Central de Abasto, Nave 3 Local 15", ciudad: "Puebla", estado: "Puebla", activo: true, created_at: "2025-04-01T09:00:00Z" },
  { id: 6, nombre: "Restaurante El Fogon Oaxaqueno", tipo: "restaurante", rfc: "RFO210710KL6", email: "chef@elfogon.mx", telefono: "951-678-9012", direccion: "Calle Macedonio Alcala 307", ciudad: "Oaxaca", estado: "Oaxaca", activo: true, created_at: "2025-04-20T09:00:00Z" },
  { id: 7, nombre: "Mercado Organico Guadalajara", tipo: "supermercado", rfc: "MOG200220MN7", email: "compras@mercadoorganico.mx", telefono: "333-789-0123", direccion: "Av. Chapultepec Sur 15, Col. Americana", ciudad: "Guadalajara", estado: "Jalisco", activo: false, created_at: "2025-05-10T09:00:00Z" },
]

export const apiKeysSeed: ApiKey[] = [
  { id: 1, empresa_id: 1, api_key: "ak_live_cocina_maria_2025_xK9mP2qR", nombre: "Produccion - La Cocina de Maria", activo: true, ultimo_uso: "2025-11-23T14:30:00Z", created_at: "2025-02-01T09:00:00Z" },
  { id: 2, empresa_id: 2, api_key: "ak_live_super_frescos_2025_jL4nT8vW", nombre: "Produccion - Super Frescos", activo: true, ultimo_uso: "2025-11-22T18:00:00Z", created_at: "2025-02-10T09:00:00Z" },
  { id: 3, empresa_id: 3, api_key: "ak_live_dis_bajio_2025_hF7wY3bN", nombre: "Produccion - Dist. Bajio", activo: true, ultimo_uso: "2025-11-23T11:00:00Z", created_at: "2025-03-05T09:00:00Z" },
  { id: 4, empresa_id: 4, api_key: "ak_live_catering_gourmet_2025_pQ2kR9mX", nombre: "Produccion - Catering Gourmet", activo: true, ultimo_uso: "2025-11-20T16:45:00Z", created_at: "2025-03-15T09:00:00Z" },
  { id: 5, empresa_id: 5, api_key: "ak_live_cab_puebla_2025_zV5tG1cJ", nombre: "Produccion - CAB Puebla", activo: true, ultimo_uso: "2025-11-23T09:15:00Z", created_at: "2025-04-01T09:00:00Z" },
  { id: 6, empresa_id: 6, api_key: "ak_live_fogon_oax_2025_wN8dF4hL", nombre: "Produccion - El Fogon", activo: true, ultimo_uso: null, created_at: "2025-04-20T09:00:00Z" },
  { id: 7, empresa_id: 1, api_key: "ak_test_cocina_maria_dev_aB3cD5eF", nombre: "Desarrollo - La Cocina de Maria", activo: false, ultimo_uso: "2025-06-15T10:00:00Z", created_at: "2025-02-01T09:00:00Z" },
]

export const pedidosSeed: Pedido[] = [
  { id: 1, empresa_id: 1, estado: "entregado", total: 4575.00, notas: "Entregar antes de las 7am en cocina trasera", fecha_entrega_estimada: "2025-11-18", created_at: "2025-11-15T14:00:00Z", updated_at: "2025-11-18T07:30:00Z" },
  { id: 2, empresa_id: 2, estado: "entregado", total: 18250.00, notas: "Pedido semanal regular. Verificar peso en bascula", fecha_entrega_estimada: "2025-11-19", created_at: "2025-11-16T09:00:00Z", updated_at: "2025-11-19T06:00:00Z" },
  { id: 3, empresa_id: 3, estado: "enviado", total: 45800.00, notas: "Distribucion a 3 sucursales. Incluir guia de remision", fecha_entrega_estimada: "2025-11-24", created_at: "2025-11-20T11:00:00Z", updated_at: "2025-11-23T08:00:00Z" },
  { id: 4, empresa_id: 4, estado: "en_preparacion", total: 8920.00, notas: "Evento corporativo 50 personas. Todo debe ser organico", fecha_entrega_estimada: "2025-11-25", created_at: "2025-11-21T15:00:00Z", updated_at: "2025-11-23T10:00:00Z" },
  { id: 5, empresa_id: 5, estado: "confirmado", total: 125000.00, notas: "Pedido mayorista mensual. Precios pactados por contrato", fecha_entrega_estimada: "2025-11-28", created_at: "2025-11-22T08:00:00Z", updated_at: "2025-11-22T14:00:00Z" },
  { id: 6, empresa_id: 1, estado: "pendiente", total: 3200.00, notas: "Menu especial fin de semana", fecha_entrega_estimada: "2025-11-29", created_at: "2025-11-23T10:00:00Z", updated_at: "2025-11-23T10:00:00Z" },
  { id: 7, empresa_id: 6, estado: "pendiente", total: 6750.00, notas: "Ingredientes para festival gastronomico", fecha_entrega_estimada: "2025-11-30", created_at: "2025-11-23T12:00:00Z", updated_at: "2025-11-23T12:00:00Z" },
  { id: 8, empresa_id: 2, estado: "cancelado", total: 9500.00, notas: "Cancelado por exceso de inventario", fecha_entrega_estimada: "2025-11-20", created_at: "2025-11-17T10:00:00Z", updated_at: "2025-11-18T09:00:00Z" },
  { id: 9, empresa_id: 3, estado: "entregado", total: 32100.00, notas: "Entrega parcial aceptada", fecha_entrega_estimada: "2025-11-15", created_at: "2025-11-12T08:00:00Z", updated_at: "2025-11-15T12:00:00Z" },
  { id: 10, empresa_id: 4, estado: "confirmado", total: 5400.00, notas: "Brunch dominical para 30 personas", fecha_entrega_estimada: "2025-12-01", created_at: "2025-11-23T16:00:00Z", updated_at: "2025-11-23T17:00:00Z" },
]

export const detallePedidosSeed: DetallePedido[] = [
  // Pedido 1 - La Cocina de Maria
  { id: 1, pedido_id: 1, producto_id: 1, cantidad: 50, precio_unitario: 45.50, subtotal: 2275.00 },
  { id: 2, pedido_id: 1, producto_id: 2, cantidad: 30, precio_unitario: 18.00, subtotal: 540.00 },
  { id: 3, pedido_id: 1, producto_id: 8, cantidad: 20, precio_unitario: 35.00, subtotal: 700.00 },
  { id: 4, pedido_id: 1, producto_id: 4, cantidad: 40, precio_unitario: 15.00, subtotal: 600.00 },
  { id: 5, pedido_id: 1, producto_id: 10, cantidad: 20, precio_unitario: 14.00, subtotal: 280.00 },
  { id: 27, pedido_id: 1, producto_id: 15, cantidad: 9, precio_unitario: 20.00, subtotal: 180.00 },

  // Pedido 2 - Super Frescos del Norte
  { id: 6, pedido_id: 2, producto_id: 1, cantidad: 200, precio_unitario: 45.50, subtotal: 9100.00 },
  { id: 7, pedido_id: 2, producto_id: 14, cantidad: 300, precio_unitario: 11.00, subtotal: 3300.00 },
  { id: 8, pedido_id: 2, producto_id: 11, cantidad: 150, precio_unitario: 16.00, subtotal: 2400.00 },
  { id: 9, pedido_id: 2, producto_id: 2, cantidad: 100, precio_unitario: 18.00, subtotal: 1800.00 },
  { id: 10, pedido_id: 2, producto_id: 17, cantidad: 50, precio_unitario: 18.50, subtotal: 925.00 },
  { id: 26, pedido_id: 2, producto_id: 12, cantidad: 72.5, precio_unitario: 10.00, subtotal: 725.00 },

  // Pedido 3 - Distribuidora Agricola del Bajio
  { id: 11, pedido_id: 3, producto_id: 6, cantidad: 2000, precio_unitario: 8.50, subtotal: 17000.00 },
  { id: 12, pedido_id: 3, producto_id: 7, cantidad: 500, precio_unitario: 28.00, subtotal: 14000.00 },
  { id: 13, pedido_id: 3, producto_id: 11, cantidad: 500, precio_unitario: 16.00, subtotal: 8000.00 },
  { id: 14, pedido_id: 3, producto_id: 12, cantidad: 400, precio_unitario: 10.00, subtotal: 4000.00 },
  { id: 25, pedido_id: 3, producto_id: 18, cantidad: 200, precio_unitario: 9.00, subtotal: 1800.00 },
  { id: 28, pedido_id: 3, producto_id: 10, cantidad: 100, precio_unitario: 14.00, subtotal: 1000.00 },

  // Pedido 4 - Catering Gourmet CDMX
  { id: 15, pedido_id: 4, producto_id: 1, cantidad: 80, precio_unitario: 45.50, subtotal: 3640.00 },
  { id: 16, pedido_id: 4, producto_id: 8, cantidad: 30, precio_unitario: 35.00, subtotal: 1050.00 },
  { id: 17, pedido_id: 4, producto_id: 16, cantidad: 10, precio_unitario: 65.00, subtotal: 650.00 },
  { id: 18, pedido_id: 4, producto_id: 15, cantidad: 40, precio_unitario: 20.00, subtotal: 800.00 },
  { id: 19, pedido_id: 4, producto_id: 17, cantidad: 30, precio_unitario: 18.50, subtotal: 555.00 },
  { id: 29, pedido_id: 4, producto_id: 9, cantidad: 7.5, precio_unitario: 30.00, subtotal: 225.00 },

  // Pedido 5 - Central de Abasto Puebla
  { id: 20, pedido_id: 5, producto_id: 6, cantidad: 5000, precio_unitario: 8.50, subtotal: 42500.00 },
  { id: 21, pedido_id: 5, producto_id: 7, cantidad: 1500, precio_unitario: 28.00, subtotal: 42000.00 },
  { id: 22, pedido_id: 5, producto_id: 11, cantidad: 1000, precio_unitario: 16.00, subtotal: 16000.00 },
  { id: 23, pedido_id: 5, producto_id: 2, cantidad: 500, precio_unitario: 18.00, subtotal: 9000.00 },
  { id: 24, pedido_id: 5, producto_id: 10, cantidad: 500, precio_unitario: 14.00, subtotal: 7000.00 },
  { id: 30, pedido_id: 5, producto_id: 14, cantidad: 500, precio_unitario: 11.00, subtotal: 5500.00 },
  { id: 31, pedido_id: 5, producto_id: 4, cantidad: 200, precio_unitario: 15.00, subtotal: 3000.00 },

  // Pedido 6 - La Cocina de Maria (pendiente)
  { id: 32, pedido_id: 6, producto_id: 3, cantidad: 25, precio_unitario: 22.00, subtotal: 550.00 },
  { id: 33, pedido_id: 6, producto_id: 15, cantidad: 30, precio_unitario: 20.00, subtotal: 600.00 },
  { id: 34, pedido_id: 6, producto_id: 2, cantidad: 50, precio_unitario: 18.00, subtotal: 900.00 },
  { id: 35, pedido_id: 6, producto_id: 9, cantidad: 15, precio_unitario: 30.00, subtotal: 450.00 },
  { id: 36, pedido_id: 6, producto_id: 18, cantidad: 50, precio_unitario: 9.00, subtotal: 450.00 },
  { id: 37, pedido_id: 6, producto_id: 5, cantidad: 20, precio_unitario: 12.50, subtotal: 250.00 },

  // Pedido 7 - El Fogon Oaxaqueno (pendiente)
  { id: 38, pedido_id: 7, producto_id: 16, cantidad: 15, precio_unitario: 65.00, subtotal: 975.00 },
  { id: 39, pedido_id: 7, producto_id: 6, cantidad: 200, precio_unitario: 8.50, subtotal: 1700.00 },
  { id: 40, pedido_id: 7, producto_id: 7, cantidad: 50, precio_unitario: 28.00, subtotal: 1400.00 },
  { id: 41, pedido_id: 7, producto_id: 9, cantidad: 25, precio_unitario: 30.00, subtotal: 750.00 },
  { id: 42, pedido_id: 7, producto_id: 3, cantidad: 40, precio_unitario: 22.00, subtotal: 880.00 },
  { id: 43, pedido_id: 7, producto_id: 15, cantidad: 25, precio_unitario: 20.00, subtotal: 500.00 },
  { id: 44, pedido_id: 7, producto_id: 8, cantidad: 10, precio_unitario: 35.00, subtotal: 350.00 },
  { id: 45, pedido_id: 7, producto_id: 10, cantidad: 14, precio_unitario: 14.00, subtotal: 195.00 },

  // Pedido 8 - Super Frescos (cancelado)
  { id: 46, pedido_id: 8, producto_id: 1, cantidad: 100, precio_unitario: 45.50, subtotal: 4550.00 },
  { id: 47, pedido_id: 8, producto_id: 4, cantidad: 200, precio_unitario: 15.00, subtotal: 3000.00 },
  { id: 48, pedido_id: 8, producto_id: 12, cantidad: 100, precio_unitario: 10.00, subtotal: 1000.00 },
  { id: 49, pedido_id: 8, producto_id: 5, cantidad: 76, precio_unitario: 12.50, subtotal: 950.00 },

  // Pedido 9 - Distribuidora (entregado)
  { id: 50, pedido_id: 9, producto_id: 2, cantidad: 800, precio_unitario: 18.00, subtotal: 14400.00 },
  { id: 51, pedido_id: 9, producto_id: 10, cantidad: 500, precio_unitario: 14.00, subtotal: 7000.00 },
  { id: 52, pedido_id: 9, producto_id: 3, cantidad: 300, precio_unitario: 22.00, subtotal: 6600.00 },
  { id: 53, pedido_id: 9, producto_id: 5, cantidad: 200, precio_unitario: 12.50, subtotal: 2500.00 },
  { id: 54, pedido_id: 9, producto_id: 18, cantidad: 100, precio_unitario: 9.00, subtotal: 900.00 },
  { id: 55, pedido_id: 9, producto_id: 17, cantidad: 40, precio_unitario: 18.50, subtotal: 700.00 },

  // Pedido 10 - Catering Gourmet (confirmado)
  { id: 56, pedido_id: 10, producto_id: 1, cantidad: 30, precio_unitario: 45.50, subtotal: 1365.00 },
  { id: 57, pedido_id: 10, producto_id: 14, cantidad: 100, precio_unitario: 11.00, subtotal: 1100.00 },
  { id: 58, pedido_id: 10, producto_id: 8, cantidad: 25, precio_unitario: 35.00, subtotal: 875.00 },
  { id: 59, pedido_id: 10, producto_id: 17, cantidad: 40, precio_unitario: 18.50, subtotal: 740.00 },
  { id: 60, pedido_id: 10, producto_id: 12, cantidad: 80, precio_unitario: 10.00, subtotal: 800.00 },
  { id: 61, pedido_id: 10, producto_id: 3, cantidad: 15, precio_unitario: 22.00, subtotal: 330.00 },
  { id: 62, pedido_id: 10, producto_id: 9, cantidad: 6, precio_unitario: 30.00, subtotal: 190.00 },
]
