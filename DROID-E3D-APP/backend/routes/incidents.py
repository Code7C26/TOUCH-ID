from datetime import datetime, timedelta

from flask import Blueprint, request

from models import db, Incidencia, Usuario, Zona
from utils.auditoria import registrar
from utils.decoradores import token_required, rol_requerido, api_key_requerida

incidents_bp = Blueprint("incidents", __name__)

TIPOS_VALIDOS = ("sin_casco", "sin_guantes", "sin_lentes", "sin_chaleco")


def leer_fecha(texto):
    """Convierte 'AAAA-MM-DD' en fecha. Devuelve None si no viene o es inválida."""
    try:
        return datetime.strptime(texto, "%Y-%m-%d") if texto else None
    except ValueError:
        return None


@incidents_bp.route("/incidents", methods=["GET"])
@token_required
def listar_incidencias():
    """Lista alertas. El empleado ve SOLO las suyas; el encargado ve todas.
    Filtros opcionales: zona_id, zona (nombre), empleado_id, tipo, estado, desde, hasta (AAAA-MM-DD)."""
    args = request.args
    limite = min(max(args.get("limit", 20, type=int), 1), 200)
    pagina = max(args.get("page", 1, type=int), 1)

    consulta = Incidencia.query

    if request.user_rol == "empleado":
        consulta = consulta.filter(Incidencia.empleado_id == request.user_id)
    elif args.get("empleado_id", type=int):
        consulta = consulta.filter(Incidencia.empleado_id == args.get("empleado_id", type=int))

    if args.get("zona_id", type=int):
        consulta = consulta.filter(Incidencia.zona_id == args.get("zona_id", type=int))
    if args.get("zona"):
        consulta = consulta.join(Zona).filter(Zona.nombre == args["zona"])
    if args.get("tipo"):
        consulta = consulta.filter(Incidencia.tipo == args["tipo"])
    if args.get("estado"):
        consulta = consulta.filter(Incidencia.estado == args["estado"])

    for nombre in ("desde", "hasta"):
        if args.get(nombre) and not leer_fecha(args[nombre]):
            return {"error": f"'{nombre}' debe tener formato AAAA-MM-DD"}, 400
    desde, hasta = leer_fecha(args.get("desde")), leer_fecha(args.get("hasta"))
    if desde:
        consulta = consulta.filter(Incidencia.timestamp >= desde)
    if hasta:  # "hasta" incluye todo ese día
        consulta = consulta.filter(Incidencia.timestamp < hasta + timedelta(days=1))

    total = consulta.count()
    incidencias = (consulta.order_by(Incidencia.timestamp.desc())
                   .offset((pagina - 1) * limite).limit(limite).all())
    return {"incidencias": [i.to_dict() for i in incidencias],
            "total": total, "page": pagina, "limit": limite}


@incidents_bp.route("/stats", methods=["GET"])
@rol_requerido("encargado")
def estadisticas():
    inicio_hoy = datetime.combine(datetime.now().date(), datetime.min.time())
    inicio_semana = inicio_hoy - timedelta(days=7)

    top_zonas = (
        db.session.query(Zona.nombre, db.func.count(Incidencia.id))
        .join(Incidencia, Incidencia.zona_id == Zona.id)
        .group_by(Zona.id, Zona.nombre)
        .order_by(db.func.count(Incidencia.id).desc())
        .limit(3)
        .all()
    )
    return {
        "incidencias_hoy": Incidencia.query.filter(Incidencia.timestamp >= inicio_hoy).count(),
        "incidencias_semana": Incidencia.query.filter(Incidencia.timestamp >= inicio_semana).count(),
        "incidencias_activas": Incidencia.query.filter_by(estado="activa").count(),
        "empleados_activos": Usuario.query.filter_by(rol="empleado", activo=True).count(),
        "top_zonas": [{"zona": z, "incidencias": c} for z, c in top_zonas],
    }


@incidents_bp.route("/incidents", methods=["POST"])
@api_key_requerida("YOLO_API_KEY")
def crear_incidencia():
    """La llama el servidor YOLO cuando detecta a alguien sin EPP (header X-API-KEY).
    Body JSON: tipo, zona_id (o zona = nombre), empleado_id (opcional), confianza (0 a 1)."""
    data = request.get_json(silent=True) or {}

    if data.get("tipo") not in TIPOS_VALIDOS:
        return {"error": f"'tipo' debe ser uno de: {', '.join(TIPOS_VALIDOS)}"}, 400

    zona = Zona.query.get(data["zona_id"]) if data.get("zona_id") else None
    if not zona and data.get("zona"):
        zona = Zona.query.filter_by(nombre=data["zona"]).first()
    if not zona:
        return {"error": "Zona inexistente: indicá 'zona_id' o 'zona'"}, 400

    empleado_id = data.get("empleado_id")
    if empleado_id is not None and not Usuario.query.get(empleado_id):
        return {"error": "empleado_id inexistente"}, 400

    confianza = data.get("confianza", 0.0)
    if not isinstance(confianza, (int, float)) or not 0 <= confianza <= 1:
        return {"error": "'confianza' debe ser un número entre 0 y 1"}, 400

    inc = Incidencia(tipo=data["tipo"], zona_id=zona.id, empleado_id=empleado_id, confianza=confianza)
    db.session.add(inc)
    db.session.commit()
    return inc.to_dict(), 201


@incidents_bp.route("/incidents/<int:inc_id>/resolver", methods=["PUT"])
@rol_requerido("encargado")
def resolver_incidencia(inc_id):
    inc = Incidencia.query.get_or_404(inc_id)
    if inc.estado == "resuelta":
        return {"error": "La incidencia ya estaba resuelta"}, 409
    inc.estado = "resuelta"
    inc.resuelta_por = request.user_id
    inc.resuelta_at = datetime.now()
    registrar("resolver_incidencia", f"Incidencia #{inc.id} ({inc.tipo}, {inc.zona.nombre})")
    db.session.commit()
    return inc.to_dict()
