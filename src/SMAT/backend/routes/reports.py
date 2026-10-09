"""Reportes para el encargado: alertas por día, tipo y zona, y ranking de cumplimiento.
Los cálculos están en utils/reportes.py."""
from datetime import date, timedelta

from flask import Blueprint, request

from utils.decoradores import rol_requerido
from utils.reportes import ranking, resumen_diario
from utils.validacion import leer_fecha

reports_bp = Blueprint("reports", __name__)

DIAS_POR_DEFECTO = 30
MAX_DIAS = 366


def leer_periodo():
    """Lee ?desde=AAAA-MM-DD&hasta=AAAA-MM-DD. Por defecto: los últimos 30 días contando hoy.
    Devuelve (desde, hasta, None) o (None, None, mensaje de error)."""
    for nombre in ("desde", "hasta"):
        if request.args.get(nombre) and not leer_fecha(request.args[nombre]):
            return None, None, f"'{nombre}' debe tener formato AAAA-MM-DD"
    hasta = leer_fecha(request.args.get("hasta"))
    hasta = hasta.date() if hasta else date.today()
    desde = leer_fecha(request.args.get("desde"))
    desde = desde.date() if desde else hasta - timedelta(days=DIAS_POR_DEFECTO - 1)
    if desde > hasta:
        return None, None, "'desde' no puede ser posterior a 'hasta'"
    if (hasta - desde).days + 1 > MAX_DIAS:
        return None, None, f"El período puede tener como máximo {MAX_DIAS} días"
    return desde, hasta, None


@reports_bp.route("/reports/diario", methods=["GET"])
@rol_requerido("encargado")
def reporte_diario():
    """Alertas de cada día del período (por tipo), totales por tipo y por zona, activas/resueltas y paradas de máquina."""
    desde, hasta, error = leer_periodo()
    if error:
        return {"error": error}, 400
    return resumen_diario(desde, hasta)


@reports_bp.route("/reports/ranking", methods=["GET"])
@rol_requerido("encargado")
def reporte_ranking():
    """Cumplimiento (días sin alertas / días del período) de cada empleado activo y de cada zona."""
    desde, hasta, error = leer_periodo()
    if error:
        return {"error": error}, 400
    return ranking(desde, hasta)
