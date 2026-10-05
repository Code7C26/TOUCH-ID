from flask import Blueprint, request

from models import db, Zona, Usuario, Incidencia
from utils.auditoria import registrar
from utils.decoradores import token_required, rol_requerido

zones_bp = Blueprint("zones", __name__)

EPP_VALIDOS = ("casco", "guantes", "lentes", "chaleco")


def aplicar_datos(zona, data, es_nueva):
    """Copia los datos del JSON a la zona. Devuelve un mensaje de error o None si todo está bien."""
    if "nombre" in data or es_nueva:
        nombre = (data.get("nombre") or "").strip()
        if not nombre:
            return "El nombre es obligatorio"
        repetida = Zona.query.filter(Zona.nombre == nombre, Zona.id != (zona.id or 0)).first()
        if repetida:
            return "Ya existe una zona con ese nombre"
        zona.nombre = nombre

    if "maquina" in data:
        zona.maquina = (data["maquina"] or "").strip() or None

    if "epp_requerido" in data:
        epp = data["epp_requerido"]
        if isinstance(epp, str):
            epp = [e.strip() for e in epp.split(",") if e.strip()]
        if not isinstance(epp, list) or any(e not in EPP_VALIDOS for e in epp):
            return f"epp_requerido solo puede tener: {', '.join(EPP_VALIDOS)}"
        zona.epp_requerido = ",".join(epp)

    for campo in ("grilla_x", "grilla_y", "ancho", "alto"):
        if campo in data:
            valor = data[campo]
            minimo = 1 if campo in ("ancho", "alto") else 0
            if not isinstance(valor, int) or isinstance(valor, bool) or valor < minimo:
                return f"{campo} debe ser un número entero mayor o igual a {minimo}"
            setattr(zona, campo, valor)
    return None


@zones_bp.route("/zones", methods=["GET"])
@token_required
def listar_zonas():
    zonas = Zona.query.order_by(Zona.nombre).all()
    return {"zonas": [z.to_dict() for z in zonas]}


@zones_bp.route("/zones/<int:zona_id>", methods=["GET"])
@token_required
def ver_zona(zona_id):
    return Zona.query.get_or_404(zona_id).to_dict()


@zones_bp.route("/zones", methods=["POST"])
@rol_requerido("encargado")
def crear_zona():
    data = request.get_json(silent=True) or {}
    zona = Zona()
    error = aplicar_datos(zona, data, es_nueva=True)
    if error:
        return {"error": error}, 400
    db.session.add(zona)
    registrar("crear_zona", f"Zona '{zona.nombre}'")
    db.session.commit()
    return zona.to_dict(), 201


@zones_bp.route("/zones/<int:zona_id>", methods=["PUT"])
@rol_requerido("encargado")
def editar_zona(zona_id):
    zona = Zona.query.get_or_404(zona_id)
    data = request.get_json(silent=True) or {}
    error = aplicar_datos(zona, data, es_nueva=False)
    if error:
        return {"error": error}, 400
    registrar("editar_zona", f"Zona '{zona.nombre}'")
    db.session.commit()
    return zona.to_dict()


@zones_bp.route("/zones/<int:zona_id>", methods=["DELETE"])
@rol_requerido("encargado")
def borrar_zona(zona_id):
    zona = Zona.query.get_or_404(zona_id)
    if Usuario.query.filter_by(zona_id=zona.id).count() or Incidencia.query.filter_by(zona_id=zona.id).count():
        return {"error": "No se puede borrar: la zona tiene empleados o incidencias"}, 409
    registrar("borrar_zona", f"Zona '{zona.nombre}'")
    db.session.delete(zona)
    db.session.commit()
    return {"mensaje": "Zona borrada"}
