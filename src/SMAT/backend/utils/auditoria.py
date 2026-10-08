"""Helper para dejar registro de las acciones importantes."""
from flask import request

from models import db, Auditoria


def registrar(accion, detalle="", usuario_id=None):
    """Agrega una fila a la tabla auditoria. NO hace commit: lo hace la ruta que la llama,
    así la acción y su registro se guardan juntos (o ninguno).
    Si no se indica usuario_id se toma el del token (request.user_id)."""
    if usuario_id is None:
        usuario_id = getattr(request, "user_id", None)
    db.session.add(Auditoria(usuario_id=usuario_id, accion=accion, detalle=str(detalle)[:255]))
