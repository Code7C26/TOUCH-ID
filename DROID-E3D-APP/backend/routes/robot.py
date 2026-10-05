"""Robot y máquinas. Dos tipos de endpoints:
 - Para los ESP32: exigen el header X-API-KEY (ROBOT_API_KEY).
 - Para la web: exigen sesión de encargado (header Authorization)."""
from datetime import datetime

from flask import Blueprint, request

from models import db, Robot, Zona, PuntoRuta, obtener_robot
from utils.auditoria import registrar
from utils.decoradores import api_key_requerida, rol_requerido, sesion_o_api_key

robot_bp = Blueprint("robot", __name__)


@robot_bp.route("/robot/comando-pendiente", methods=["GET"])
@api_key_requerida("ROBOT_API_KEY")
def comando_pendiente():
    """El ESP32 del robot pregunta cada 1-2 s qué tiene que hacer.
    comando: iniciar | pausar | detener | emergencia | null (nada nuevo)."""
    robot = obtener_robot()
    return {"comando": robot.comando_pendiente, "estado": robot.estado}


@robot_bp.route("/robot/reporte", methods=["POST"])
@api_key_requerida("ROBOT_API_KEY")
def reporte_del_robot():
    """El ESP32 informa cómo está. Todos los campos son opcionales:
    estado, bateria (0-100), zona_actual_id, comando_ejecutado (para confirmar que ya lo hizo)."""
    data = request.get_json(silent=True) or {}
    robot = obtener_robot()

    if "estado" in data:
        if data["estado"] not in Robot.ESTADOS:
            return {"error": f"'estado' debe ser uno de: {', '.join(Robot.ESTADOS)}"}, 400
        robot.estado = data["estado"]
    if "bateria" in data:
        b = data["bateria"]
        if not isinstance(b, int) or isinstance(b, bool) or not 0 <= b <= 100:
            return {"error": "'bateria' debe ser un entero entre 0 y 100"}, 400
        robot.bateria = b
    if "zona_actual_id" in data:
        if data["zona_actual_id"] is not None and not Zona.query.get(data["zona_actual_id"]):
            return {"error": "zona_actual_id inexistente"}, 400
        robot.zona_actual_id = data["zona_actual_id"]
    # Cuando el robot confirma el comando que tenía pendiente, se limpia
    if data.get("comando_ejecutado") and data["comando_ejecutado"] == robot.comando_pendiente:
        robot.comando_pendiente = None

    robot.ultima_conexion = datetime.now()
    db.session.commit()
    return {"comando": robot.comando_pendiente, "estado": robot.estado}


# ---------------------------------------------------------------------------
# Para la web (encargado)
# ---------------------------------------------------------------------------

@robot_bp.route("/robot/estado", methods=["GET"])
@rol_requerido("encargado")
def estado_del_robot():
    """Estado actual: estado, batería, zona, comando pendiente y si está conectado."""
    return obtener_robot().to_dict()


@robot_bp.route("/robot/comando", methods=["POST"])
@rol_requerido("encargado")
def enviar_comando():
    """El encargado le manda una orden al robot. Body: {"comando": "iniciar"}.
    El ESP32 la recibe en su próxima consulta a /robot/comando-pendiente."""
    comando = (request.get_json(silent=True) or {}).get("comando")
    if comando not in Robot.COMANDOS:
        return {"error": f"'comando' debe ser uno de: {', '.join(Robot.COMANDOS)}"}, 400

    robot = obtener_robot()
    # Después de una emergencia no se puede arrancar de golpe: primero hay que "detener"
    if robot.estado == "emergencia" and comando in ("iniciar", "pausar"):
        return {"error": "El robot está en emergencia: primero enviá 'detener' para salir de ese estado"}, 409

    robot.comando_pendiente = comando
    if comando == "emergencia":
        robot.estado = "emergencia"  # se ve en la web enseguida, sin esperar al ESP32
    registrar("comando_robot", f"Comando '{comando}'")
    db.session.commit()
    return robot.to_dict()


@robot_bp.route("/robot/ruta", methods=["GET"])
@sesion_o_api_key("ROBOT_API_KEY")
def ver_ruta():
    """Zonas que recorre el robot, en orden. La leen la web y el ESP32 del robot."""
    puntos = PuntoRuta.query.order_by(PuntoRuta.orden).all()
    return {"ruta": [p.to_dict() for p in puntos]}


@robot_bp.route("/robot/ruta", methods=["PUT"])
@rol_requerido("encargado")
def guardar_ruta():
    """Reemplaza toda la ruta. Body: {"ruta": [{"zona_id": 1, "tiempo_espera_seg": 30}, ...]}.
    El orden de la lista es el orden del recorrido."""
    ruta = (request.get_json(silent=True) or {}).get("ruta")
    if not isinstance(ruta, list) or not ruta:
        return {"error": "'ruta' debe ser una lista con al menos una zona"}, 400

    nuevos = []
    for i, paso in enumerate(ruta, start=1):
        zona_id = paso.get("zona_id") if isinstance(paso, dict) else None
        espera = paso.get("tiempo_espera_seg", 30) if isinstance(paso, dict) else None
        if not zona_id or not Zona.query.get(zona_id):
            return {"error": f"Paso {i}: la zona no existe"}, 400
        if not isinstance(espera, int) or isinstance(espera, bool) or not 5 <= espera <= 3600:
            return {"error": f"Paso {i}: 'tiempo_espera_seg' debe ser un entero entre 5 y 3600"}, 400
        nuevos.append(PuntoRuta(orden=i, zona_id=zona_id, tiempo_espera_seg=espera))

    PuntoRuta.query.delete()
    db.session.add_all(nuevos)
    registrar("editar_ruta", f"Ruta de {len(nuevos)} paso(s)")
    db.session.commit()
    return {"ruta": [p.to_dict() for p in nuevos]}


@robot_bp.route("/robot/video", methods=["PUT"])
@rol_requerido("encargado")
def guardar_url_video():
    """Guarda la URL del stream de video (la sirve la PC con YOLO). Body: {"url_video": "http://..."}.
    Texto vacío = sin video."""
    url = ((request.get_json(silent=True) or {}).get("url_video") or "").strip()
    if url and not url.startswith(("http://", "https://")):
        return {"error": "La URL debe empezar con http:// o https://"}, 400
    robot = obtener_robot()
    robot.url_video = url
    registrar("editar_video_robot", url or "(sin video)")
    db.session.commit()
    return robot.to_dict()


# ---------------------------------------------------------------------------
# Para el ESP32 de la máquina
# ---------------------------------------------------------------------------

@robot_bp.route("/zones/<int:zona_id>/maquina", methods=["GET"])
@api_key_requerida("ROBOT_API_KEY")
def estado_de_maquina(zona_id):
    """El ESP32 de la máquina (relé) pregunta si su máquina puede funcionar.
    maquina_activa = false -> hay que cortarla."""
    zona = Zona.query.get_or_404(zona_id)
    return {"zona_id": zona.id, "maquina": zona.maquina, "maquina_activa": bool(zona.maquina_activa)}
