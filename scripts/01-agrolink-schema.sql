-- ============================================================
-- AgroLink - Web Service Empresarial para Cadena Agroalimentaria
-- Script 1: Creacion de Base de Datos y Tablas
-- Compatible con MySQL Workbench 8.0+
-- ============================================================

-- Crear la base de datos
DROP DATABASE IF EXISTS agrolink_db;
CREATE DATABASE agrolink_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrolink_db;

-- ============================================================
-- TABLA: categorias
-- Almacena las categorias de productos agricolas
-- ============================================================
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_categorias_nombre (nombre)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: productos
-- Catalogo completo de productos agricolas disponibles
-- ============================================================
CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  categoria_id INT NOT NULL,
  precio_mayoreo DECIMAL(10,2) NOT NULL CHECK (precio_mayoreo >= 0),
  unidad_medida ENUM('kg', 'tonelada', 'pieza', 'caja', 'manojo') NOT NULL DEFAULT 'kg',
  cantidad_disponible DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (cantidad_disponible >= 0),
  fecha_cosecha DATE,
  fecha_caducidad DATE,
  descripcion TEXT,
  imagen_url VARCHAR(500) DEFAULT '',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  INDEX idx_productos_nombre (nombre),
  INDEX idx_productos_categoria (categoria_id),
  INDEX idx_productos_activo (activo),
  INDEX idx_productos_precio (precio_mayoreo),
  INDEX idx_productos_caducidad (fecha_caducidad)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: empresas
-- Empresas cliente (restaurantes, supermercados, distribuidores, etc.)
-- ============================================================
CREATE TABLE empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  tipo ENUM('restaurante', 'supermercado', 'distribuidor', 'catering', 'central_abasto') NOT NULL,
  rfc VARCHAR(13) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefono VARCHAR(20) DEFAULT '',
  direccion TEXT DEFAULT (''),
  ciudad VARCHAR(100) DEFAULT '',
  estado VARCHAR(100) DEFAULT '',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_empresas_tipo (tipo),
  INDEX idx_empresas_rfc (rfc),
  INDEX idx_empresas_activo (activo),
  INDEX idx_empresas_ciudad (ciudad)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: api_keys
-- Llaves de acceso para autenticacion de la API REST
-- ============================================================
CREATE TABLE api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  api_key VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_uso TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_api_keys_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON DELETE CASCADE ON UPDATE CASCADE,

  INDEX idx_api_keys_key (api_key),
  INDEX idx_api_keys_empresa (empresa_id),
  INDEX idx_api_keys_activo (activo)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: pedidos
-- Ordenes de compra realizadas por empresas
-- ============================================================
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  estado ENUM('pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  notas TEXT,
  fecha_entrega_estimada DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_pedidos_empresa
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  INDEX idx_pedidos_empresa (empresa_id),
  INDEX idx_pedidos_estado (estado),
  INDEX idx_pedidos_fecha (created_at),
  INDEX idx_pedidos_entrega (fecha_entrega_estimada)
) ENGINE=InnoDB;

-- ============================================================
-- TABLA: detalle_pedidos
-- Items individuales dentro de cada pedido
-- ============================================================
CREATE TABLE detalle_pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),

  CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  INDEX idx_detalle_pedido (pedido_id),
  INDEX idx_detalle_producto (producto_id)
) ENGINE=InnoDB;

-- ============================================================
-- VISTAS UTILES
-- ============================================================

-- Vista: Productos con nombre de categoria
CREATE OR REPLACE VIEW v_productos_completos AS
SELECT
  p.id,
  p.nombre,
  c.nombre AS categoria,
  p.precio_mayoreo,
  p.unidad_medida,
  p.cantidad_disponible,
  p.fecha_cosecha,
  p.fecha_caducidad,
  p.descripcion,
  p.activo,
  p.created_at,
  p.updated_at
FROM productos p
JOIN categorias c ON p.categoria_id = c.id;

-- Vista: Pedidos con info de empresa
CREATE OR REPLACE VIEW v_pedidos_completos AS
SELECT
  pe.id,
  e.nombre AS empresa,
  e.tipo AS tipo_empresa,
  pe.estado,
  pe.total,
  pe.notas,
  pe.fecha_entrega_estimada,
  pe.created_at,
  pe.updated_at,
  (SELECT COUNT(*) FROM detalle_pedidos dp WHERE dp.pedido_id = pe.id) AS total_items
FROM pedidos pe
JOIN empresas e ON pe.empresa_id = e.id;

-- Vista: Resumen de ventas por empresa
CREATE OR REPLACE VIEW v_ventas_por_empresa AS
SELECT
  e.id AS empresa_id,
  e.nombre AS empresa,
  e.tipo,
  COUNT(p.id) AS total_pedidos,
  SUM(CASE WHEN p.estado = 'entregado' THEN p.total ELSE 0 END) AS total_entregado,
  SUM(CASE WHEN p.estado IN ('pendiente', 'confirmado', 'en_preparacion', 'enviado') THEN p.total ELSE 0 END) AS total_en_proceso
FROM empresas e
LEFT JOIN pedidos p ON e.id = p.empresa_id
GROUP BY e.id, e.nombre, e.tipo;

-- Vista: Productos mas vendidos
CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
SELECT
  pr.id AS producto_id,
  pr.nombre AS producto,
  c.nombre AS categoria,
  SUM(dp.cantidad) AS total_vendido,
  pr.unidad_medida,
  SUM(dp.subtotal) AS ingreso_total
FROM detalle_pedidos dp
JOIN productos pr ON dp.producto_id = pr.id
JOIN categorias c ON pr.categoria_id = c.id
JOIN pedidos pe ON dp.pedido_id = pe.id
WHERE pe.estado != 'cancelado'
GROUP BY pr.id, pr.nombre, c.nombre, pr.unidad_medida
ORDER BY total_vendido DESC;

-- ============================================================
-- PROCEDIMIENTOS ALMACENADOS
-- ============================================================

-- Procedimiento: Crear un nuevo pedido con sus items
DELIMITER //
CREATE PROCEDURE sp_crear_pedido(
  IN p_empresa_id INT,
  IN p_notas TEXT,
  IN p_fecha_entrega DATE
)
BEGIN
  INSERT INTO pedidos (empresa_id, estado, total, notas, fecha_entrega_estimada)
  VALUES (p_empresa_id, 'pendiente', 0, p_notas, p_fecha_entrega);

  SELECT LAST_INSERT_ID() AS pedido_id;
END //
DELIMITER ;

-- Procedimiento: Agregar item a un pedido y actualizar total
DELIMITER //
CREATE PROCEDURE sp_agregar_item_pedido(
  IN p_pedido_id INT,
  IN p_producto_id INT,
  IN p_cantidad DECIMAL(10,2)
)
BEGIN
  DECLARE v_precio DECIMAL(10,2);
  DECLARE v_subtotal DECIMAL(12,2);

  -- Obtener precio actual del producto
  SELECT precio_mayoreo INTO v_precio
  FROM productos
  WHERE id = p_producto_id AND activo = TRUE;

  IF v_precio IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Producto no encontrado o inactivo';
  END IF;

  SET v_subtotal = p_cantidad * v_precio;

  -- Insertar detalle
  INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
  VALUES (p_pedido_id, p_producto_id, p_cantidad, v_precio, v_subtotal);

  -- Actualizar total del pedido
  UPDATE pedidos
  SET total = (SELECT SUM(subtotal) FROM detalle_pedidos WHERE pedido_id = p_pedido_id)
  WHERE id = p_pedido_id;

  SELECT v_subtotal AS subtotal_agregado;
END //
DELIMITER ;

-- Procedimiento: Cambiar estado de un pedido
DELIMITER //
CREATE PROCEDURE sp_cambiar_estado_pedido(
  IN p_pedido_id INT,
  IN p_nuevo_estado ENUM('pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado')
)
BEGIN
  UPDATE pedidos
  SET estado = p_nuevo_estado
  WHERE id = p_pedido_id;

  SELECT ROW_COUNT() AS filas_afectadas;
END //
DELIMITER ;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger: Actualizar stock cuando se entrega un pedido
DELIMITER //
CREATE TRIGGER trg_actualizar_stock_entrega
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
  IF NEW.estado = 'entregado' AND OLD.estado != 'entregado' THEN
    UPDATE productos p
    JOIN detalle_pedidos dp ON p.id = dp.producto_id
    SET p.cantidad_disponible = GREATEST(0, p.cantidad_disponible - dp.cantidad)
    WHERE dp.pedido_id = NEW.id;
  END IF;
END //
DELIMITER ;

-- ============================================================
-- VERIFICACION
-- ============================================================
SELECT 'Base de datos AgroLink creada exitosamente' AS resultado;
SELECT TABLE_NAME, ENGINE, TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'agrolink_db'
ORDER BY TABLE_NAME;
