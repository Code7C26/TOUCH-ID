import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASS = os.getenv("DB_PASS", "")
    DB_NAME = os.getenv("DB_NAME", "robot_db")

    # charset=utf8mb4: acentos, ñ y emojis se guardan y leen bien
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}?charset=utf8mb4"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET = os.getenv("JWT_SECRET", "clave_secreta")
    PORT = int(os.getenv("FLASK_PORT", 5000))
    # Modo debug (recarga sola al guardar). Las pruebas automáticas lo apagan con FLASK_DEBUG=0.
    DEBUG = os.getenv("FLASK_DEBUG", "1") == "1"

    # Claves para las máquinas (no para personas). Van en el header X-API-KEY.
    YOLO_API_KEY = os.getenv("YOLO_API_KEY", "")      # servidor de IA
    ROBOT_API_KEY = os.getenv("ROBOT_API_KEY", "")    # ESP32 del robot y de las máquinas
