"""Punto de entrada para publicar el backend en un servidor (PythonAnywhere). Ver docs/DESPLIEGUE.md.

En la PC se usa "python app.py"; en el servidor, el archivo WSGI de PythonAnywhere importa
"application" de acá. Antes crea las tablas que falten (igual que app.py al arrancar).
"""
import os
import sys

CARPETA = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, CARPETA)
os.chdir(CARPETA)   # así se encuentra el .env de esta carpeta

from app import app as application, crear_datos_iniciales  # noqa: E402

with application.app_context():
    crear_datos_iniciales()
