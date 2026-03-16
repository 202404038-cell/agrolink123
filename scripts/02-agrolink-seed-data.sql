-- ============================================================
-- AgroLink - Web Service Empresarial para Cadena Agroalimentaria
-- Script 2: Datos de Ejemplo (Seed Data)
-- Compatible con MySQL Workbench 8.0+
-- Ejecutar DESPUES de 01-agrolink-schema.sql
-- ============================================================

USE agrolink_db;

-- ============================================================
-- CATEGORIAS
-- ============================================================
INSERT INTO categorias (id, nombre, descripcion, created_at) VALUES
(1, 'Frutas', 'Frutas frescas de temporada cultivadas en nuestras huertas', '2025-01-15 08:00:00'),
(2, 'Verduras', 'Verduras organicas y de alta calidad para consumo directo', '2025-01-15 08:00:00'),
(3, 'Hortalizas', 'Hortalizas frescas cosechadas diariamente', '2025-01-15 08:00:00'),
(4, 'Hierbas Aromaticas', 'Hierbas frescas para cocina gourmet y medicina tradicional', '2025-01-15 08:00:00'),
(5, 'Cereales y Granos', 'Granos basicos de la agricultura mexicana', '2025-01-15 08:00:00'),
(6, 'Tuberculos', 'Tuberculos y raices de cultivo organico', '2025-01-15 08:00:00');

-- ============================================================
-- PRODUCTOS (18 productos agricolas mexicanos)
-- ============================================================
INSERT INTO productos (id, nombre, categoria_id, precio_mayoreo, unidad_medida, cantidad_disponible, fecha_cosecha, fecha_caducidad, descripcion, imagen_url, activo, created_at, updated_at) VALUES
(1,  'Aguacate Hass',          1, 45.50, 'kg',     2500,  '2025-11-20', '2025-12-10', 'Aguacate Hass de Michoacan, calibre mediano, madurez optima para distribucion', '', TRUE,  '2025-01-20 10:00:00', '2025-11-20 10:00:00'),
(2,  'Tomate Saladette',       2, 18.00, 'kg',     5000,  '2025-11-22', '2025-12-05', 'Tomate saladette rojo firme, ideal para salsas y ensaladas', '', TRUE,  '2025-01-20 10:00:00', '2025-11-22 10:00:00'),
(3,  'Chile Jalapeno',         3, 22.00, 'kg',     1800,  '2025-11-18', '2025-12-08', 'Chile jalapeno fresco de Veracruz, picor medio-alto', '', TRUE,  '2025-01-20 10:00:00', '2025-11-18 10:00:00'),
(4,  'Limon Persa',            1, 15.00, 'kg',     8000,  '2025-11-21', '2025-12-15', 'Limon persa sin semilla, alto contenido de jugo', '', TRUE,  '2025-01-20 10:00:00', '2025-11-21 10:00:00'),
(5,  'Calabaza Criolla',       2, 12.50, 'kg',     3000,  '2025-11-19', '2025-12-20', 'Calabaza criolla de Oaxaca, ideal para cremas y guisos', '', TRUE,  '2025-01-20 10:00:00', '2025-11-19 10:00:00'),
(6,  'Maiz Blanco',            5,  8.50, 'kg',    15000,  '2025-10-15', '2026-04-15', 'Maiz blanco criollo para tortillas, tamales y pozole', '', TRUE,  '2025-01-20 10:00:00', '2025-10-15 10:00:00'),
(7,  'Frijol Negro Veracruzano', 5, 28.00, 'kg',   6000,  '2025-10-20', '2026-06-20', 'Frijol negro de Veracruz, grano seleccionado y limpio', '', TRUE,  '2025-01-20 10:00:00', '2025-10-20 10:00:00'),
(8,  'Cilantro Fresco',        4, 35.00, 'manojo',  800,  '2025-11-23', '2025-11-30', 'Manojos de cilantro fresco y aromatico, corte del dia', '', TRUE,  '2025-01-20 10:00:00', '2025-11-23 10:00:00'),
(9,  'Epazote',                4, 30.00, 'manojo',  500,  '2025-11-23', '2025-12-01', 'Epazote fresco para frijoles, quesadillas y sopas', '', TRUE,  '2025-01-20 10:00:00', '2025-11-23 10:00:00'),
(10, 'Cebolla Blanca',         2, 14.00, 'kg',     4000,  '2025-11-20', '2025-12-20', 'Cebolla blanca mediana, firme y de sabor intenso', '', TRUE,  '2025-01-20 10:00:00', '2025-11-20 10:00:00'),
(11, 'Papa Alpha',             6, 16.00, 'kg',     7000,  '2025-11-15', '2026-01-15', 'Papa alpha de Puebla, tamano uniforme ideal para restaurantes', '', TRUE,  '2025-01-20 10:00:00', '2025-11-15 10:00:00'),
(12, 'Zanahoria',              6, 10.00, 'kg',     3500,  '2025-11-18', '2025-12-28', 'Zanahoria organica de Guanajuato, calibre standard', '', TRUE,  '2025-01-20 10:00:00', '2025-11-18 10:00:00'),
(13, 'Mango Ataulfo',          1, 32.00, 'kg',     1200,  '2025-11-10', '2025-11-28', 'Mango Ataulfo de Chiapas, dulce y sin fibra', '', FALSE, '2025-01-20 10:00:00', '2025-11-10 10:00:00'),
(14, 'Naranja Valencia',       1, 11.00, 'kg',    10000,  '2025-11-22', '2025-12-22', 'Naranja valencia para jugo, alto rendimiento en jugo', '', TRUE,  '2025-01-20 10:00:00', '2025-11-22 10:00:00'),
(15, 'Nopal Verdura',          3, 20.00, 'kg',     2000,  '2025-11-23', '2025-12-03', 'Nopal limpio y despinado, listo para cocinar', '', TRUE,  '2025-01-20 10:00:00', '2025-11-23 10:00:00'),
(16, 'Chile Habanero',         3, 65.00, 'kg',      600,  '2025-11-20', '2025-12-10', 'Chile habanero naranja de Yucatan, extra picante', '', TRUE,  '2025-01-20 10:00:00', '2025-11-20 10:00:00'),
(17, 'Lechuga Romana',         2, 18.50, 'pieza',  1500,  '2025-11-23', '2025-11-30', 'Lechuga romana hidroponica, crujiente y fresca', '', TRUE,  '2025-01-20 10:00:00', '2025-11-23 10:00:00'),
(18, 'Chayote',                2,  9.00, 'kg',     2200,  '2025-11-21', '2025-12-15', 'Chayote sin espinas de Veracruz, tierno y fresco', '', TRUE,  '2025-01-20 10:00:00', '2025-11-21 10:00:00');

-- ============================================================
-- EMPRESAS (7 empresas ficticias mexicanas)
-- ============================================================
INSERT INTO empresas (id, nombre, tipo, rfc, email, telefono, direccion, ciudad, estado, activo, created_at) VALUES
(1, 'La Cocina de Maria',               'restaurante',    'CMR210315AB1', 'contacto@lacocinademaria.mx',  '442-123-4567', 'Av. Universidad 234, Col. Centro',          'Queretaro',        'Queretaro',    TRUE,  '2025-02-01 09:00:00'),
(2, 'Super Frescos del Norte',           'supermercado',   'SFN190820CD2', 'compras@superfrescos.mx',      '818-234-5678', 'Blvd. Rogelio Cantu 500, Col. Valle',       'Monterrey',        'Nuevo Leon',   TRUE,  '2025-02-10 09:00:00'),
(3, 'Distribuidora Agricola del Bajio',  'distribuidor',   'DAB180512EF3', 'ventas@disbajio.mx',           '461-345-6789', 'Carr. Celaya-Salamanca Km 5',               'Celaya',           'Guanajuato',   TRUE,  '2025-03-05 09:00:00'),
(4, 'Catering Gourmet CDMX',            'catering',       'CGC200105GH4', 'pedidos@cateringgourmet.mx',   '555-456-7890', 'Calle Durango 180, Col. Roma Norte',        'Ciudad de Mexico', 'CDMX',         TRUE,  '2025-03-15 09:00:00'),
(5, 'Central de Abasto Puebla',          'central_abasto', 'CAP170830IJ5', 'operaciones@cabpuebla.mx',     '222-567-8901', 'Central de Abasto, Nave 3 Local 15',        'Puebla',           'Puebla',       TRUE,  '2025-04-01 09:00:00'),
(6, 'Restaurante El Fogon Oaxaqueno',    'restaurante',    'RFO210710KL6', 'chef@elfogon.mx',              '951-678-9012', 'Calle Macedonio Alcala 307',                'Oaxaca',           'Oaxaca',       TRUE,  '2025-04-20 09:00:00'),
(7, 'Mercado Organico Guadalajara',      'supermercado',   'MOG200220MN7', 'compras@mercadoorganico.mx',   '333-789-0123', 'Av. Chapultepec Sur 15, Col. Americana',    'Guadalajara',      'Jalisco',      FALSE, '2025-05-10 09:00:00');

-- ============================================================
-- API KEYS (7 llaves de acceso para las empresas)
-- ============================================================
INSERT INTO api_keys (id, empresa_id, api_key, nombre, activo, ultimo_uso, created_at) VALUES
(1, 1, 'ak_live_cocina_maria_2025_xK9mP2qR',     'Produccion - La Cocina de Maria',      TRUE,  '2025-11-23 14:30:00', '2025-02-01 09:00:00'),
(2, 2, 'ak_live_super_frescos_2025_jL4nT8vW',     'Produccion - Super Frescos',           TRUE,  '2025-11-22 18:00:00', '2025-02-10 09:00:00'),
(3, 3, 'ak_live_dis_bajio_2025_hF7wY3bN',         'Produccion - Dist. Bajio',             TRUE,  '2025-11-23 11:00:00', '2025-03-05 09:00:00'),
(4, 4, 'ak_live_catering_gourmet_2025_pQ2kR9mX',  'Produccion - Catering Gourmet',        TRUE,  '2025-11-20 16:45:00', '2025-03-15 09:00:00'),
(5, 5, 'ak_live_cab_puebla_2025_zV5tG1cJ',        'Produccion - CAB Puebla',              TRUE,  '2025-11-23 09:15:00', '2025-04-01 09:00:00'),
(6, 6, 'ak_live_fogon_oax_2025_wN8dF4hL',         'Produccion - El Fogon',                TRUE,  NULL,                  '2025-04-20 09:00:00'),
(7, 1, 'ak_test_cocina_maria_dev_aB3cD5eF',       'Desarrollo - La Cocina de Maria',      FALSE, '2025-06-15 10:00:00', '2025-02-01 09:00:00');

-- ============================================================
-- PEDIDOS (10 pedidos de ejemplo con diferentes estados)
-- ============================================================
INSERT INTO pedidos (id, empresa_id, estado, total, notas, fecha_entrega_estimada, created_at, updated_at) VALUES
(1,  1, 'entregado',       4575.00,  'Entregar antes de las 7am en cocina trasera',                  '2025-11-18', '2025-11-15 14:00:00', '2025-11-18 07:30:00'),
(2,  2, 'entregado',      18250.00,  'Pedido semanal regular. Verificar peso en bascula',            '2025-11-19', '2025-11-16 09:00:00', '2025-11-19 06:00:00'),
(3,  3, 'enviado',         45800.00,  'Distribucion a 3 sucursales. Incluir guia de remision',        '2025-11-24', '2025-11-20 11:00:00', '2025-11-23 08:00:00'),
(4,  4, 'en_preparacion',   8920.00,  'Evento corporativo 50 personas. Todo debe ser organico',       '2025-11-25', '2025-11-21 15:00:00', '2025-11-23 10:00:00'),
(5,  5, 'confirmado',     125000.00,  'Pedido mayorista mensual. Precios pactados por contrato',      '2025-11-28', '2025-11-22 08:00:00', '2025-11-22 14:00:00'),
(6,  1, 'pendiente',        3200.00,  'Menu especial fin de semana',                                  '2025-11-29', '2025-11-23 10:00:00', '2025-11-23 10:00:00'),
(7,  6, 'pendiente',        6750.00,  'Ingredientes para festival gastronomico',                      '2025-11-30', '2025-11-23 12:00:00', '2025-11-23 12:00:00'),
(8,  2, 'cancelado',        9500.00,  'Cancelado por exceso de inventario',                           '2025-11-20', '2025-11-17 10:00:00', '2025-11-18 09:00:00'),
(9,  3, 'entregado',       32100.00,  'Entrega parcial aceptada',                                     '2025-11-15', '2025-11-12 08:00:00', '2025-11-15 12:00:00'),
(10, 4, 'confirmado',       5400.00,  'Brunch dominical para 30 personas',                            '2025-12-01', '2025-11-23 16:00:00', '2025-11-23 17:00:00');

-- ============================================================
-- DETALLE DE PEDIDOS (items individuales por pedido)
-- ============================================================

-- Pedido 1 - La Cocina de Maria (entregado)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(1,  1, 1,  50,  45.50, 2275.00),
(2,  1, 2,  30,  18.00,  540.00),
(3,  1, 8,  20,  35.00,  700.00),
(4,  1, 4,  40,  15.00,  600.00),
(5,  1, 10, 20,  14.00,  280.00),
(27, 1, 15,  9,  20.00,  180.00);

-- Pedido 2 - Super Frescos del Norte (entregado)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(6,  2, 1,  200,  45.50, 9100.00),
(7,  2, 14, 300,  11.00, 3300.00),
(8,  2, 11, 150,  16.00, 2400.00),
(9,  2, 2,  100,  18.00, 1800.00),
(10, 2, 17,  50,  18.50,  925.00),
(26, 2, 12,  72.50, 10.00, 725.00);

-- Pedido 3 - Distribuidora Agricola del Bajio (enviado)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(11, 3, 6,  2000, 8.50,  17000.00),
(12, 3, 7,   500, 28.00, 14000.00),
(13, 3, 11,  500, 16.00,  8000.00),
(14, 3, 12,  400, 10.00,  4000.00),
(25, 3, 18,  200,  9.00,  1800.00),
(28, 3, 10,  100, 14.00,  1000.00);

-- Pedido 4 - Catering Gourmet CDMX (en_preparacion)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(15, 4, 1,   80, 45.50, 3640.00),
(16, 4, 8,   30, 35.00, 1050.00),
(17, 4, 16,  10, 65.00,  650.00),
(18, 4, 15,  40, 20.00,  800.00),
(19, 4, 17,  30, 18.50,  555.00),
(29, 4, 9,   7.50, 30.00, 225.00);

-- Pedido 5 - Central de Abasto Puebla (confirmado)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(20, 5, 6,  5000, 8.50,  42500.00),
(21, 5, 7,  1500, 28.00, 42000.00),
(22, 5, 11, 1000, 16.00, 16000.00),
(23, 5, 2,   500, 18.00,  9000.00),
(24, 5, 10,  500, 14.00,  7000.00),
(30, 5, 14,  500, 11.00,  5500.00),
(31, 5, 4,   200, 15.00,  3000.00);

-- Pedido 6 - La Cocina de Maria (pendiente)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(32, 6, 3,   25, 22.00,  550.00),
(33, 6, 15,  30, 20.00,  600.00),
(34, 6, 2,   50, 18.00,  900.00),
(35, 6, 9,   15, 30.00,  450.00),
(36, 6, 18,  50,  9.00,  450.00),
(37, 6, 5,   20, 12.50,  250.00);

-- Pedido 7 - El Fogon Oaxaqueno (pendiente)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(38, 7, 16,  15, 65.00,  975.00),
(39, 7, 6,  200,  8.50, 1700.00),
(40, 7, 7,   50, 28.00, 1400.00),
(41, 7, 9,   25, 30.00,  750.00),
(42, 7, 3,   40, 22.00,  880.00),
(43, 7, 15,  25, 20.00,  500.00),
(44, 7, 8,   10, 35.00,  350.00),
(45, 7, 10,  14, 14.00,  195.00);

-- Pedido 8 - Super Frescos (cancelado)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(46, 8, 1,  100, 45.50, 4550.00),
(47, 8, 4,  200, 15.00, 3000.00),
(48, 8, 12, 100, 10.00, 1000.00),
(49, 8, 5,   76, 12.50,  950.00);

-- Pedido 9 - Distribuidora (entregado)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(50, 9, 2,  800, 18.00, 14400.00),
(51, 9, 10, 500, 14.00,  7000.00),
(52, 9, 3,  300, 22.00,  6600.00),
(53, 9, 5,  200, 12.50,  2500.00),
(54, 9, 18, 100,  9.00,   900.00),
(55, 9, 17,  40, 18.50,   700.00);

-- Pedido 10 - Catering Gourmet (confirmado)
INSERT INTO detalle_pedidos (id, pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES
(56, 10, 1,   30, 45.50, 1365.00),
(57, 10, 14, 100, 11.00, 1100.00),
(58, 10, 8,   25, 35.00,  875.00),
(59, 10, 17,  40, 18.50,  740.00),
(60, 10, 12,  80, 10.00,  800.00),
(61, 10, 3,   15, 22.00,  330.00),
(62, 10, 15,  10, 20.00,  190.00);

-- ============================================================
-- CONSULTAS DE VERIFICACION
-- ============================================================

-- Resumen general
SELECT '--- RESUMEN DE DATOS INSERTADOS ---' AS '';
SELECT 'Categorias' AS tabla, COUNT(*) AS registros FROM categorias
UNION ALL
SELECT 'Productos', COUNT(*) FROM productos
UNION ALL
SELECT 'Empresas', COUNT(*) FROM empresas
UNION ALL
SELECT 'API Keys', COUNT(*) FROM api_keys
UNION ALL
SELECT 'Pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'Detalle Pedidos', COUNT(*) FROM detalle_pedidos;

-- Productos por categoria
SELECT '--- PRODUCTOS POR CATEGORIA ---' AS '';
SELECT c.nombre AS categoria, COUNT(p.id) AS productos
FROM categorias c
LEFT JOIN productos p ON c.id = p.categoria_id
GROUP BY c.id, c.nombre
ORDER BY productos DESC;

-- Pedidos por estado
SELECT '--- PEDIDOS POR ESTADO ---' AS '';
SELECT estado, COUNT(*) AS cantidad, FORMAT(SUM(total), 2) AS total_mxn
FROM pedidos
GROUP BY estado
ORDER BY FIELD(estado, 'pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado');

-- Top 5 productos mas vendidos (excluyendo cancelados)
SELECT '--- TOP 5 PRODUCTOS MAS VENDIDOS ---' AS '';
SELECT * FROM v_productos_mas_vendidos LIMIT 5;

-- Ventas por empresa
SELECT '--- VENTAS POR EMPRESA ---' AS '';
SELECT * FROM v_ventas_por_empresa;

SELECT 'Datos de ejemplo insertados exitosamente en AgroLink' AS resultado;
