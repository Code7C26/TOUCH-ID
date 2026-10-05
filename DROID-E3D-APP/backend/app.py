from flask import Flask
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from config import Config
from models import db
from routes.auth import auth_bp
from routes.incidents import incidents_bp
from routes.zones import zones_bp
from routes.users import users_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(incidents_bp, url_prefix="/api")
app.register_blueprint(zones_bp, url_prefix="/api")
app.register_blueprint(users_bp, url_prefix="/api")


@app.errorhandler(HTTPException)
def error_http(e):
    """Todos los errores (404, 405...) salen como JSON {"error": "..."} en vez de HTML."""
    return {"error": e.description}, e.code


@app.route("/api/health")
def health():
    return {"status": "ok", "mensaje": "Servidor Flask funcionando"}


def crear_datos_iniciales():
    """Crea las tablas que falten. Los datos de ejemplo vienen de database/schema.sql."""
    db.create_all()


if __name__ == "__main__":
    with app.app_context():
        crear_datos_iniciales()
    app.run(debug=True, host="0.0.0.0", port=Config.PORT)
