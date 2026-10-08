"""Datos raros o maliciosos: el servidor tiene que responder con un error claro (4xx), nunca caerse (500)."""
import pytest

from tests.conftest import JUAN, ROBOT, YOLO

LARGO = "x" * 300
RAROS = [None, 5, 3.7, True, [], {}, "", "   ", LARGO, ["casco"], {"a": 1}, -1, 10**12]

# (método, ruta, campos que se prueban, quién llama)
ENDPOINTS = [
    ("POST", "/api/login", ["usuario", "contrasena"], None),
    ("POST", "/api/zones", ["nombre", "maquina", "epp_requerido", "grilla_x", "ancho"], "encargada"),
    ("PUT", "/api/zones/1", ["nombre", "maquina", "epp_requerido", "grilla_y", "alto"], "encargada"),
    ("POST", "/api/users", ["usuario", "contrasena", "nombre", "rol", "legajo", "zona_id"], "encargada"),
    ("PUT", f"/api/users/{JUAN}", ["nombre", "contrasena", "rol", "legajo", "zona_id", "activo"], "encargada"),
    ("POST", "/api/incidents", ["tipo", "zona_id", "zona", "empleado_id", "empleado", "confianza"], "yolo"),
    ("POST", "/api/robot/comando", ["comando"], "encargada"),
    ("PUT", "/api/robot/ruta", ["ruta"], "encargada"),
    ("PUT", "/api/robot/video", ["url_video"], "encargada"),
    ("POST", "/api/robot/reporte", ["estado", "bateria", "zona_actual_id", "comando_ejecutado"], "robot"),
]
VALIDOS = {
    "/api/login": {"usuario": "maria", "contrasena": "pass123"},
    "/api/zones": {"nombre": "Zona Nueva", "grilla_x": 0, "grilla_y": 6, "ancho": 1, "alto": 1},
    "/api/users": {"usuario": "nuevo1", "contrasena": "clave123", "nombre": "Nuevo", "rol": "empleado"},
    "/api/incidents": {"tipo": "sin_casco", "zona_id": 1, "confianza": 0.5},
}


@pytest.mark.parametrize("metodo,ruta,campos,quien", ENDPOINTS, ids=[f"{m} {r}" for m, r, _, _ in ENDPOINTS])
def test_campos_raros_no_rompen_el_servidor(cliente, encargada, metodo, ruta, campos, quien):
    cabeceras = {"encargada": encargada, "yolo": YOLO, "robot": ROBOT}.get(quien, {})
    for campo in campos:
        for valor in RAROS:
            datos = {**VALIDOS.get(ruta, {}), campo: valor}
            r = cliente.open(ruta, method=metodo, json=datos, headers=cabeceras)
            assert r.status_code < 500, f"{metodo} {ruta} con {campo}={valor!r:.40} -> {r.status_code}"
            assert r.is_json, f"{metodo} {ruta} con {campo}={valor!r:.40} no respondió JSON"


@pytest.mark.parametrize("cuerpo", [b"", b"no es json", b"[1, 2, 3]", b'"texto"', b"null"])
def test_cuerpos_que_no_son_un_objeto(cliente, encargada, cuerpo):
    for metodo, ruta, _, quien in ENDPOINTS:
        cabeceras = {"encargada": encargada, "yolo": YOLO, "robot": ROBOT}.get(quien, {})
        r = cliente.open(ruta, method=metodo, data=cuerpo, headers={**cabeceras, "Content-Type": "application/json"})
        assert r.status_code < 500, f"{metodo} {ruta} con cuerpo {cuerpo!r} -> {r.status_code}"
