from flask import Blueprint, request

from models import db, Usuario, Zona
from routes.rostros import borrar_fotos_de
from utils.auditoria import registrar
from utils.decoradores import rol_requerido
from utils.validacion import id_valido, leer_json, texto

users_bp = Blueprint("users", __name__)


def aplicar_datos(user, data, es_nuevo):
    """Copia los datos del JSON al usuario. Devuelve un mensaje de error o None si está todo bien."""
    if es_nuevo:
        usuario, error = texto(data, "usuario", "El usuario", 50, obligatorio=True)
        if error:
            return error
        if Usuario.query.filter_by(usuario=usuario).first():
            return "Ya existe un usuario con ese nombre"
        user.usuario = usuario

    if es_nuevo or "contrasena" in data:
        clave = data.get("contrasena")
        if not isinstance(clave, str) or len(clave) < 6:
            return "La contraseña debe tener al menos 6 caracteres"
        if len(clave) > 128:
            return "La contraseña puede tener como máximo 128 caracteres"
        user.set_password(clave)

    if es_nuevo or "nombre" in data:
        nombre, error = texto(data, "nombre", "El nombre", 100, obligatorio=True)
        if error:
            return error
        user.nombre = nombre

    if es_nuevo or "rol" in data:
        if data.get("rol") not in ("empleado", "encargado"):
            return "El rol debe ser 'empleado' o 'encargado'"
        user.rol = data["rol"]

    if "legajo" in data:
        legajo, error = texto(data, "legajo", "El legajo", 20)
        if error:
            return error
        if legajo and Usuario.query.filter(Usuario.legajo == legajo, Usuario.id != (user.id or 0)).first():
            return "Ya existe un empleado con ese legajo"
        user.legajo = legajo

    if "zona_id" in data:
        if data["zona_id"] is not None and not (id_valido(data["zona_id"]) and db.session.get(Zona, data["zona_id"])):
            return "La zona indicada no existe"
        user.zona_id = data["zona_id"]

    if "activo" in data:
        if not isinstance(data["activo"], bool):
            return "'activo' debe ser true o false"
        user.activo = data["activo"]
    return None


@users_bp.route("/users", methods=["GET"])
@rol_requerido("encargado")
def listar_usuarios():
    """Filtros opcionales: rol, zona_id, activo (true/false)."""
    consulta = Usuario.query
    if request.args.get("rol"):
        consulta = consulta.filter_by(rol=request.args["rol"])
    if request.args.get("zona_id", type=int):
        consulta = consulta.filter_by(zona_id=request.args.get("zona_id", type=int))
    if request.args.get("activo"):
        consulta = consulta.filter_by(activo=request.args["activo"] == "true")
    return {"usuarios": [u.to_dict() for u in consulta.order_by(Usuario.nombre).all()]}


@users_bp.route("/users/<int:user_id>", methods=["GET"])
@rol_requerido("encargado")
def ver_usuario(user_id):
    return db.get_or_404(Usuario, user_id).to_dict()


@users_bp.route("/users", methods=["POST"])
@rol_requerido("encargado")
def crear_usuario():
    data = leer_json()
    user = Usuario()
    error = aplicar_datos(user, data, es_nuevo=True)
    if error:
        return {"error": error}, 400
    db.session.add(user)
    registrar("crear_usuario", f"Usuario '{user.usuario}' ({user.rol})")
    db.session.commit()
    return user.to_dict(), 201


@users_bp.route("/users/<int:user_id>", methods=["PUT"])
@rol_requerido("encargado")
def editar_usuario(user_id):
    user = db.get_or_404(Usuario, user_id)
    data = leer_json()
    if user.id == request.user_id and (data.get("activo") is False or data.get("rol") == "empleado"):
        return {"error": "No podés darte de baja ni quitarte el rol de encargado"}, 400
    error = aplicar_datos(user, data, es_nuevo=False)
    if error:
        return {"error": error}, 400
    registrar("editar_usuario", f"Usuario '{user.usuario}'")
    db.session.commit()
    return user.to_dict()


@users_bp.route("/users/<int:user_id>", methods=["DELETE"])
@rol_requerido("encargado")
def dar_de_baja(user_id):
    """No borra la fila (se perdería el historial de incidencias): lo marca como inactivo.
    Sí borra sus fotos de rostro."""
    user = db.get_or_404(Usuario, user_id)
    if user.id == request.user_id:
        return {"error": "No podés darte de baja a vos mismo"}, 400
    user.activo = False
    borrar_fotos_de(user)     # sus fotos de rostro ya no se necesitan (Ley 25.326)
    registrar("baja_usuario", f"Usuario '{user.usuario}'")
    db.session.commit()
    return user.to_dict()
