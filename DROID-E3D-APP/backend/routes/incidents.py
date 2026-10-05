from datetime import datetime, timedelta

from flask import Blueprint, request

from models import db, Incidencia, Usuario
from routes.auth import token_required

incidents_bp = Blueprint("incidents", __name__)


@incidents_bp.route("/incidents", methods=["GET"])
@token_required
def listar_incidencias():
    limite = request.args.get("limit", 20, type=int)
    zona = request.args.get("zona")
    consulta = Incidencia.query
    if zona:
        consulta = consulta.filter_by(zona=zona)
    incidencias = consulta.order_by(Incidencia.timestamp.desc()).limit(limite).all()
    return {"incidencias": [i.to_dict() for i in incidencias]}


@incidents_bp.route("/stats", methods=["GET"])
@token_required
def estadisticas():
    if request.user_rol != "encargado":
        return {"error": "Solo el encargado puede ver estadísticas"}, 403

    inicio_hoy = datetime.combine(datetime.now().date(), datetime.min.time())
    inicio_semana = inicio_hoy - timedelta(days=7)

    top_zonas = (
        db.session.query(Incidencia.zona, db.func.count(Incidencia.id))
        .group_by(Incidencia.zona)
        .order_by(db.func.count(Incidencia.id).desc())
        .limit(3)
        .all()
    )
    return {
        "incidencias_hoy": Incidencia.query.filter(Incidencia.timestamp >= inicio_hoy).count(),
        "incidencias_semana": Incidencia.query.filter(Incidencia.timestamp >= inicio_semana).count(),
        "empleados_activos": Usuario.query.filter_by(rol="empleado").count(),
        "top_zonas": [{"zona": z, "incidencias": c} for z, c in top_zonas],
    }


@incidents_bp.route("/incidents", methods=["POST"])
def crear_incidencia():
    """La llama el servidor YOLO cuando detecta a alguien sin EPP."""
    data = request.get_json() or {}
    if not data.get("tipo") or not data.get("zona"):
        return {"error": "Faltan 'tipo' y 'zona'"}, 400
    inc = Incidencia(
        tipo=data["tipo"],
        zona=data["zona"],
        empleado_id=data.get("empleado_id"),
        confianza=data.get("confianza", 0.0),
    )
    db.session.add(inc)
    db.session.commit()
    return inc.to_dict(), 201


@incidents_bp.route("/incidents/<int:inc_id>/resolver", methods=["PUT"])
@token_required
def resolver_incidencia(inc_id):
    inc = Incidencia.query.get_or_404(inc_id)
    inc.estado = "resuelta"
    db.session.commit()
    return inc.to_dict()
