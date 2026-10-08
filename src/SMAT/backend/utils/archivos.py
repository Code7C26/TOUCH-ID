"""Guardado y borrado de fotos (evidencias de las alertas y rostros de los empleados).

Las fotos se guardan en backend/uploads/<carpeta>/ con un nombre inventado por el servidor
(nunca el nombre que manda el usuario) y en la base se anota la ruta pública, por ejemplo
"/uploads/evidencias/12_a1b2c3d4.jpg". La web la pide a /api + esa ruta.
"""
import os
import uuid

from config import Config

CARPETAS = ("evidencias", "rostros")

# Los primeros bytes de cada formato: así se reconoce la imagen aunque le cambien la extensión
FIRMAS = {b"\xff\xd8\xff": "jpg", b"\x89PNG\r\n\x1a\n": "png"}


class ImagenInvalida(ValueError):
    """La foto no es JPG/PNG o es demasiado grande. El mensaje se muestra tal cual al usuario."""


def tipo_de_imagen(contenido):
    for firma, extension in FIRMAS.items():
        if contenido.startswith(firma):
            return extension
    return None


def guardar_imagen(archivo, carpeta, prefijo):
    """Valida y guarda un archivo subido (request.files[...]). Devuelve la ruta pública.
    prefijo: algo que identifique a quién pertenece (id de la incidencia o del empleado)."""
    if carpeta not in CARPETAS:
        raise ValueError(f"Carpeta desconocida: {carpeta}")
    contenido = archivo.read()
    if not contenido:
        raise ImagenInvalida("La imagen está vacía")
    if len(contenido) > Config.MAX_IMAGEN_MB * 1024 * 1024:
        raise ImagenInvalida(f"La imagen supera los {Config.MAX_IMAGEN_MB} MB")
    extension = tipo_de_imagen(contenido)
    if not extension:
        raise ImagenInvalida("La imagen debe ser JPG o PNG")

    nombre = f"{prefijo}_{uuid.uuid4().hex[:8]}.{extension}"
    destino = os.path.join(Config.UPLOAD_DIR, carpeta)
    os.makedirs(destino, exist_ok=True)
    with open(os.path.join(destino, nombre), "wb") as f:
        f.write(contenido)
    return f"/uploads/{carpeta}/{nombre}"


def ruta_en_disco(ruta_publica):
    """Convierte "/uploads/rostros/x.jpg" en la ruta del archivo en la PC."""
    _, _, carpeta, nombre = ruta_publica.split("/", 3)
    return os.path.join(Config.UPLOAD_DIR, carpeta, nombre)


def borrar_imagen(ruta_publica):
    """Borra el archivo si existe (si ya no estaba, no pasa nada)."""
    try:
        os.remove(ruta_en_disco(ruta_publica))
    except (FileNotFoundError, ValueError):
        pass
