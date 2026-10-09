from flask import Flask
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from config import Config
from models import db, obtener_robot
from routes.auth import auth_bp
from routes.incidents import incidents_bp
from routes.zones import zones_bp
from routes.users import users_bp
from routes.robot import robot_bp
from routes.rostros import rostros_bp
from routes.uploads import uploads_bp
from routes.push import push_bp
from routes.reports import reports_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(incidents_bp, url_prefix="/api")
app.register_blueprint(zones_bp, url_prefix="/api")
app.register_blueprint(users_bp, url_prefix="/api")
app.register_blueprint(robot_bp, url_prefix="/api")
app.register_blueprint(rostros_bp, url_prefix="/api")
app.register_blueprint(uploads_bp, url_prefix="/api")
app.register_blueprint(push_bp, url_prefix="/api")
app.register_blueprint(reports_bp, url_prefix="/api")


@app.errorhandler(HTTPException)
def error_http(e):
    """Todos los errores (404, 405...) salen como JSON {"error": "..."} en vez de HTML."""
    return {"error": e.description}, e.code


@app.errorhandler(Exception)
def error_inesperado(e):
    """Red de seguridad: si algo falla sin control, se responde JSON (y el detalle queda en la consola)."""
    if isinstance(e, HTTPException):
        return error_http(e)
    app.logger.exception("Error inesperado")
    db.session.rollback()
    return {"error": "Error interno del servidor"}, 500


@app.errorhandler(413)
def archivo_muy_grande(e):
    return {"error": f"El archivo supera los {Config.MAX_IMAGEN_MB} MB"}, 413


@app.route("/api/health")
def health():
    return {"status": "ok", "mensaje": "Servidor Flask funcionando"}


def crear_datos_iniciales():
    """Crea las tablas que falten. Los datos de ejemplo vienen de database/schema.sql."""
    db.create_all()
    obtener_robot()  # asegura que exista la fila del robot


if __name__ == "__main__":
    with app.app_context():
        crear_datos_iniciales()
    app.run(debug=Config.DEBUG, host="0.0.0.0", port=Config.PORT)
