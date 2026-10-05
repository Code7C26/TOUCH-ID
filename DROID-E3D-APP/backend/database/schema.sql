-- Ejecutar en MySQL (Workbench o consola) ANTES de iniciar Flask
CREATE DATABASE IF NOT EXISTS robot_db;
USE robot_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol ENUM('empleado', 'encargado') NOT NULL,
    zona VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incidencias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    zona VARCHAR(100) NOT NULL,
    empleado_id INT NULL,
    confianza FLOAT DEFAULT 0.0,
    estado VARCHAR(20) DEFAULT 'activa',
    FOREIGN KEY (empleado_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Usuarios de prueba (contraseña: pass123)
INSERT IGNORE INTO usuarios (usuario, contrasena, nombre, rol, zona) VALUES
('juan',  SHA2('pass123', 256), 'Juan Empleado',   'empleado',  'Zona A'),
('maria', SHA2('pass123', 256), 'Maria Encargada', 'encargado', NULL);

-- Incidencias de ejemplo
INSERT INTO incidencias (tipo, zona, empleado_id, confianza) VALUES
('sin_casco',   'Zona A', 1, 0.95),
('sin_guantes', 'Zona B', 1, 0.87),
('sin_lentes',  'Zona A', NULL, 0.92);
