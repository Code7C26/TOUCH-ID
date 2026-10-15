import os
from urllib.parse import quote_plus

from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASS = os.getenv("DB_PASS", "")
    DB_NAME = os.getenv("DB_NAME", "robot_db")

    # charset=utf8mb4: acentos, ñ y emojis se guardan y leen bien.
    # quote_plus: si la contraseña tiene símbolos (@ : / #), igual queda bien armada la dirección.
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{quote_plus(DB_USER)}:{quote_plus(DB_PASS)}@{DB_HOST}/{DB_NAME}?charset=utf8mb4"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET = os.getenv("JWT_SECRET", "clave_secreta")
    PORT = int(os.getenv("FLASK_PORT", 5000))
    # Modo debug (recarga sola al guardar). Las pruebas automáticas lo apagan con FLASK_DEBUG=0.
    DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"

    # Claves para las máquinas (no para personas). Van en el header X-API-KEY.
    YOLO_API_KEY = os.getenv("YOLO_API_KEY", "")      # servidor de IA
    ROBOT_API_KEY = os.getenv("ROBOT_API_KEY", "")    # ESP32 del robot y de las máquinas

    # Fotos (evidencias de las alertas y rostros). La carpeta no se sube a GitHub.
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(__file__), "uploads"))
    MAX_IMAGEN_MB = 5
    MAX_CONTENT_LENGTH = 6 * 1024 * 1024   # Flask corta antes cualquier envío más grande (error 413)

    # Notificaciones push al celular o la PC (Web Push). Las claves se crean UNA vez con
    # tools/generar_claves_push.py. Sin claves, la web anda igual pero no manda notificaciones.
    VAPID_PUBLIC_KEY = os.getenv("VAPID_PUBLIC_KEY", "")
    VAPID_PRIVATE_KEY = os.getenv("VAPID_PRIVATE_KEY", "")
    # Contacto que se manda a los servicios de push (Google, Mozilla, Apple) por si hay un problema.
    # Tiene que ser "mailto:alguien@dominio" o "https://dominio" (sin nada después del dominio).
    VAPID_CONTACTO = os.getenv("VAPID_CONTACTO", "mailto:soporte@droid-e3d.local")

    # Carpeta de la web compilada (npm run build). Si existe, Flask la sirve en "/" (ver docs/DESPLIEGUE.md)
    WEB_DIST = os.getenv("WEB_DIST", os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
