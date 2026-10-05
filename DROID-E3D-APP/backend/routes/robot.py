"""Endpoints que usan los ESP32 (robot y máquinas). Todos exigen el header X-API-KEY (ROBOT_API_KEY).
Los endpoints para la web (estado, ruta, comandos del encargado) se agregan en la Fase 5."""
from datetime import datetime

from flask import Blueprint, request

from models import db, Robot, Zona, obtener_robot
from utils.decoradores import api_key_requerida

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


@robot_bp.route("/zones/<int:zona_id>/maquina", methods=["GET"])
@api_key_requerida("ROBOT_API_KEY")
def estado_de_maquina(zona_id):
    """El ESP32 de la máquina (relé) pregunta si su máquina puede funcionar.
    maquina_activa = false -> hay que cortarla."""
    zona = Zona.query.get_or_404(zona_id)
    return {"zona_id": zona.id, "maquina": zona.maquina, "maquina_activa": bool(zona.maquina_activa)}
