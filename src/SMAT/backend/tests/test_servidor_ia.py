"""Lo que necesita el servidor de IA de Morena (src/SMAT/servidor_ia): reconoce a las personas
por el NOMBRE de su carpeta de fotos y no sabe en qué zona está (la cámara va en el robot)."""
from tests.conftest import CARLOS, ROBOT, YOLO


def alerta(cliente, **datos):
    return cliente.post("/api/incidents", json={"tipo": "sin_casco", "confianza": 0.8, **datos}, headers=YOLO)


def test_empleado_por_nombre(cliente):
    r = alerta(cliente, zona_id=1, empleado="carlos díaz")          # sin importar mayúsculas
    assert r.status_code == 201 and r.json["empleado_id"] == CARLOS


def test_nombre_desconocido_no_pierde_la_alerta(cliente):
    for nombre in ("Desconocido", "Alguien Que No Existe"):
        r = alerta(cliente, zona_id=1, empleado=nombre)
        assert r.status_code == 201 and r.json["empleado_id"] is None
        assert r.json["empleado_nombre"] == "Desconocido"


def test_empleado_id_tiene_prioridad_sobre_el_nombre(cliente):
    r = alerta(cliente, zona_id=1, empleado_id=1, empleado="Carlos Díaz")
    assert r.json["empleado_id"] == 1


def test_sin_zona_usa_la_zona_del_robot(cliente):
    assert alerta(cliente).status_code == 400                         # el robot todavía no reportó su zona
    cliente.post("/api/robot/reporte", json={"estado": "recorriendo", "zona_actual_id": 3}, headers=ROBOT)
    r = alerta(cliente, empleado="Carlos Díaz")
    assert r.status_code == 201 and r.json["zona_id"] == 3


def test_zona_equivocada_sigue_siendo_error(cliente):
    cliente.post("/api/robot/reporte", json={"estado": "recorriendo", "zona_actual_id": 3}, headers=ROBOT)
    assert alerta(cliente, zona="Zona Z").status_code == 400
    assert alerta(cliente, zona_id=99).status_code == 400


def test_multipart_con_nombre_y_sin_zona(cliente):
    cliente.post("/api/robot/reporte", json={"estado": "recorriendo", "zona_actual_id": 2}, headers=ROBOT)
    import io
    r = cliente.post("/api/incidents", headers=YOLO, content_type="multipart/form-data",
                     data={"tipo": "sin_casco", "empleado": "Carlos Díaz", "confianza": "0.7",
                           "imagen": (io.BytesIO(b"\xff\xd8\xff\xe0" + b"\x00" * 32), "frame.jpg")})
    assert r.status_code == 201
    assert r.json["zona_id"] == 2 and r.json["empleado_id"] == CARLOS and r.json["imagen_url"].endswith(".jpg")
