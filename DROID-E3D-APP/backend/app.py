from flask import Flask
from flask_cors import CORS

from config import Config
from models import db, Usuario
from routes.auth import auth_bp
from routes.incidents import incidents_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(incidents_bp, url_prefix="/api")


@app.route("/api/health")
def health():
    return {"status": "ok", "mensaje": "Servidor Flask funcionando"}


def crear_datos_iniciales():
    """Crea las tablas y dos usuarios de prueba si no existen."""
    db.create_all()
    pruebas = [
        ("juan", "Juan Empleado", "empleado", "Zona A"),
        ("maria", "Maria Encargada", "encargado", None),
    ]
    for usuario, nombre, rol, zona in pruebas:
        if not Usuario.query.filter_by(usuario=usuario).first():
            u = Usuario(usuario=usuario, nombre=nombre, rol=rol, zona=zona)
            u.set_password("pass123")
            db.session.add(u)
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        crear_datos_iniciales()
    app.run(debug=True, host="0.0.0.0", port=Config.PORT)
