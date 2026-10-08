CREATE DATABASE IF NOT EXISTS robotica_industrial;
USE robotica_industrial;

CREATE TABLE IF NOT EXISTS registro_incidencias (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora DATETIME NOT NULL,
    tipo_infraccion VARCHAR(100) NOT NULL,
    nivel_confianza DECIMAL(5,2) NOT NULL,
    estado_alerta VARCHAR(20) DEFAULT 'ENVIADA'
);
