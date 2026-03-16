import { NextResponse } from "next/server"

const schemaSQL = `-- ============================================================
-- AgroLink - Web Service Empresarial para Cadena Agroalimentaria
-- Script 1: Creacion de Base de Datos y Tablas
-- Compatible con MySQL Workbench 8.0+
-- ============================================================

DROP DATABASE IF EXISTS agrolink_db;
CREATE DATABASE agrolink_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agrolink_db;

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_categorias_nombre (nombre)
) ENGINE=InnoDB;

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
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_productos_nombre (nombre),
  INDEX idx_productos_categoria (categoria_id),
  INDEX idx_productos_activo (activo)
) ENGINE=InnoDB;

CREATE TABLE empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(200) NOT NULL,
  tipo ENUM('restaurante', 'supermercado', 'distribuidor', 'catering', 'central_abasto') NOT NULL,
  rfc VARCHAR(13) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  telefono VARCHAR(20) DEFAULT '',
  direccion TEXT,
  ciudad VARCHAR(100) DEFAULT '',
  estado VARCHAR(100) DEFAULT '',
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_empresas_tipo (tipo),
  INDEX idx_empresas_rfc (rfc),
  INDEX idx_empresas_activo (activo)
) ENGINE=InnoDB;

CREATE TABLE api_keys (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  api_key VARCHAR(100) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL,
  activo BOOLEAN NOT NULL DEFAULT TRUE,
  ultimo_uso TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_api_keys_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_api_keys_key (api_key),
  INDEX idx_api_keys_empresa (empresa_id)
) ENGINE=InnoDB;

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  estado ENUM('pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado') NOT NULL DEFAULT 'pendiente',
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  notas TEXT,
  fecha_entrega_estimada DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_pedidos_empresa (empresa_id),
  INDEX idx_pedidos_estado (estado)
) ENGINE=InnoDB;

CREATE TABLE detalle_pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad DECIMAL(10,2) NOT NULL CHECK (cantidad > 0),
  precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_detalle_pedido (pedido_id),
  INDEX idx_detalle_producto (producto_id)
) ENGINE=InnoDB;

SELECT 'Esquema AgroLink creado exitosamente' AS resultado;`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const file = searchParams.get("file")

  if (file === "schema") {
    return new NextResponse(schemaSQL, {
      headers: {
        "Content-Type": "application/sql",
        "Content-Disposition": "attachment; filename=01-agrolink-schema.sql",
      },
    })
  }

  return NextResponse.json({
    files: [
      { name: "01-agrolink-schema.sql", description: "Estructura de base de datos", url: "/api/sql?file=schema" },
    ],
  })
}
