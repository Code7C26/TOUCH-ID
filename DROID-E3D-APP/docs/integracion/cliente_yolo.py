"""EJEMPLO de referencia: cómo el servidor de IA (YOLO) habla con el backend de DROID-E3D.

Requiere:  pip install requests
Variables de entorno (no pongas la clave en el código):
    DROID_URL       ej. http://192.168.0.10:5000/api
    YOLO_API_KEY    la que está en backend/.env
Contrato completo: docs/API.md
"""
import os

import requests

URL = os.getenv("DROID_URL", "http://localhost:5000/api")
CABECERAS = {"X-API-KEY": os.getenv("YOLO_API_KEY", "")}

# Cada tipo de falta, según el EPP que falta
TIPOS = {"casco": "sin_casco", "guantes": "sin_guantes", "lentes": "sin_lentes", "chaleco": "sin_chaleco"}


def zonas():
    """Devuelve las zonas con su EPP obligatorio. Pedilo una vez al arrancar."""
    r = requests.get(f"{URL}/zones", headers=CABECERAS, timeout=5)
    r.raise_for_status()
    return r.json()["zonas"]


def reportar_falta(epp_faltante, zona_id, empleado_id=None, confianza=0.0):
    """Registra una incidencia. empleado_id puede ser None si no se reconoció la cara.
    Devuelve la incidencia creada o None si falló (no tires abajo la detección por esto)."""
    datos = {"tipo": TIPOS[epp_faltante], "zona_id": zona_id,
             "empleado_id": empleado_id, "confianza": round(confianza, 2)}
    try:
        r = requests.post(f"{URL}/incidents", json=datos, headers=CABECERAS, timeout=5)
        r.raise_for_status()
        return r.json()
    except requests.RequestException as e:
        print("No se pudo reportar la incidencia:", e)
        return None


def rostros():
    """Fotos de los empleados para el reconocimiento facial (disponible desde la Fase 6.2)."""
    r = requests.get(f"{URL}/rostros", headers=CABECERAS, timeout=10)
    r.raise_for_status()
    return r.json()["rostros"]


if __name__ == "__main__":
    # Prueba rápida: lista las zonas y reporta una falta de casco en la primera
    todas = zonas()
    print("Zonas:", [(z["id"], z["nombre"], z["epp_requerido"]) for z in todas])
    print("Incidencia creada:", reportar_falta("casco", todas[0]["id"], empleado_id=1, confianza=0.93))
