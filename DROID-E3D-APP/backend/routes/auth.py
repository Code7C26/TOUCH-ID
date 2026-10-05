from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import Blueprint, request

from config import Config
from models import Usuario

auth_bp = Blueprint("auth", __name__)


def token_required(f):
    """Protege una ruta: exige el header Authorization: Bearer <token>."""
    @wraps(f)
    def decorated(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return {"error": "Token requerido"}, 401
        try:
            datos = jwt.decode(header.split(" ")[1], Config.JWT_SECRET, algorithms=["HS256"])
        except jwt.PyJWTError:
            return {"error": "Token expirado o inválido"}, 401
        request.user_id = datos["user_id"]
        request.user_rol = datos["rol"]
        return f(*args, **kwargs)
    return decorated


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    usuario = data.get("usuario")
    contrasena = data.get("contrasena")

    if not usuario or not contrasena:
        return {"error": "Usuario y contraseña requeridos"}, 400

    user = Usuario.query.filter_by(usuario=usuario).first()
    if not user or not user.check_password(contrasena):
        return {"error": "Credenciales inválidas"}, 401

    token = jwt.encode(
        {"user_id": user.id, "rol": user.rol, "exp": datetime.utcnow() + timedelta(hours=24)},
        Config.JWT_SECRET,
        algorithm="HS256",
    )
    return {"token": token, **user.to_dict()}
