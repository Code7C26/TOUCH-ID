CREATE DATABASE IF NOT EXISTS robotica_industrial;
USE robotica_industrial;

CREATE TABLE IF NOT EXISTS registro_incidencias (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora DATETIME NOT NULL,
    tipo_infraccion VARCHAR(100) NOT NULL,
    trabajador VARCHAR(100) DEFAULT 'Desconocido',
    nivel_confianza DECIMAL(5,2) NOT NULL,
    estado_alerta VARCHAR(20) DEFAULT 'ENVIADA'
);

-- Si la tabla ya existía sin la columna trabajador (el motor la usa al guardar):
ALTER TABLE registro_incidencias ADD COLUMN IF NOT EXISTS trabajador VARCHAR(100) DEFAULT 'Desconocido' AFTER tipo_infraccion;
