"""Fotos de rostro de los empleados, para que el servidor de IA los reconozca.
Por ahora devuelve una lista vacía: la carga real de fotos se implementa en la Fase 6.2."""
from flask import Blueprint

from utils.decoradores import api_key_requerida

rostros_bp = Blueprint("rostros", __name__)


@rostros_bp.route("/rostros", methods=["GET"])
@api_key_requerida("YOLO_API_KEY")
def listar_rostros():
    # Formato final: {"rostros": [{"empleado_id": 1, "nombre": "...", "fotos": ["/uploads/rostros/1_a.jpg"]}]}
    return {"rostros": []}
