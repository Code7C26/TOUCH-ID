"""Crea una base de datos de PRUEBA a partir de database/schema.sql (con los datos de ejemplo).

La usan las pruebas de la API y las de punta a punta. Nunca toca la base de desarrollo (robot_db):
el nombre de la base de prueba tiene que terminar en "_test" o "_e2e".
"""
import os
import re

import pymysql

SCHEMA = os.path.join(os.path.dirname(__file__), "..", "database", "schema.sql")


def sentencias_del_schema(nombre_base):
    """Lee schema.sql, le saca los comentarios y lo divide en sentencias, usando la base indicada."""
    lineas = []
    for linea in open(SCHEMA, encoding="utf-8"):
        linea = re.sub(r"\s--.*$", "", linea.rstrip("\n"))   # comentario al final de la línea
        if linea.strip().startswith("--"):
            continue
        lineas.append(linea)
    texto = re.sub(r"\brobot_db\b", nombre_base, "\n".join(lineas))
    return [s.strip() for s in texto.split(";") if s.strip()]


def recrear_base(nombre_base, host=None, usuario=None, clave=None):
    """Borra la base de prueba (si existe) y la vuelve a crear con los datos de ejemplo."""
    if not re.search(r"_(test|e2e)$", nombre_base):
        raise ValueError(f"Por seguridad, la base de prueba debe terminar en _test o _e2e (se pidió '{nombre_base}')")
    conexion = pymysql.connect(host=host or os.getenv("DB_HOST", "127.0.0.1"), user=usuario or os.getenv("DB_USER", "root"),
                               password=clave if clave is not None else os.getenv("DB_PASS", ""), charset="utf8mb4", autocommit=True)
    try:
        with conexion.cursor() as cursor:
            cursor.execute(f"DROP DATABASE IF EXISTS `{nombre_base}`")
            for sentencia in sentencias_del_schema(nombre_base):
                cursor.execute(sentencia)
    finally:
        conexion.close()
