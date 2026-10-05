from datetime import datetime
import hashlib
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def hashear(texto):
    return hashlib.sha256(texto.encode()).hexdigest()


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(50), unique=True, nullable=False)
    contrasena = db.Column(db.String(255), nullable=False)
    nombre = db.Column(db.String(100), nullable=False)
    rol = db.Column(db.Enum("empleado", "encargado"), nullable=False)
    zona = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.now)

    def set_password(self, password):
        self.contrasena = hashear(password)

    def check_password(self, password):
        return self.contrasena == hashear(password)

    def to_dict(self):
        return {"id": self.id, "usuario": self.usuario, "nombre": self.nombre,
                "rol": self.rol, "zona": self.zona}


class Incidencia(db.Model):
    __tablename__ = "incidencias"

    id = db.Column(db.Integer, primary_key=True)
    tipo = db.Column(db.String(50), nullable=False)          # sin_casco, sin_guantes...
    timestamp = db.Column(db.DateTime, default=datetime.now)
    zona = db.Column(db.String(100), nullable=False)
    empleado_id = db.Column(db.Integer, db.ForeignKey("usuarios.id"))
    confianza = db.Column(db.Float, default=0.0)              # 0 a 1 (viene de YOLO)
    estado = db.Column(db.String(20), default="activa")       # activa / resuelta

    empleado = db.relationship("Usuario", backref="incidencias")

    def to_dict(self):
        return {
            "id": self.id,
            "tipo": self.tipo,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "zona": self.zona,
            "empleado_id": self.empleado_id,
            "empleado_nombre": self.empleado.nombre if self.empleado else "Desconocido",
            "confianza": self.confianza,
            "estado": self.estado,
        }
