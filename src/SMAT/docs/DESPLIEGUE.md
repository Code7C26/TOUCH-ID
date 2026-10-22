# Publicar DROID-E3D en internet (PythonAnywhere)

Todo queda en **una sola cuenta gratis** de PythonAnywhere: Flask sirve la API y también la web compilada,
en `https://USUARIO.pythonanywhere.com` (decisión `decisiones/005-pythonanywhere.md`). Como tiene https,
en el celular se puede instalar la app y recibir notificaciones.

En esta guía, **`USUARIO`** es tu nombre de usuario de PythonAnywhere (en minúsculas). Reemplazalo donde aparezca.

> Se publican solo los **datos de ejemplo** (ficticios). No subas fotos de caras reales sin el consentimiento
> firmado de cada persona (Ley 25.326).

---

## 1. Crear la cuenta y la base de datos (una sola vez)

1. Creá una cuenta **Beginner** (gratis) en https://www.pythonanywhere.com/registration/register/beginner/
2. Pestaña **Databases** → en *MySQL password* elegí una contraseña y tocá **Initialize MySQL**. Anotala.
3. En *Create a database* escribí `droid` y tocá **Create**. La base queda como **`USUARIO$droid`**.
   Anotá también el **Database host** que aparece arriba: `USUARIO.mysql.pythonanywhere-services.com`.

## 2. Armar el paquete en tu PC

El repo es **privado**: PythonAnywhere no puede hacer `git clone` sin un token de GitHub. Por eso se sube
**un solo archivo** con el backend y la web ya compilada. La web se compila en tu PC, así lleva tus datos de
contacto del `frontend\.env`. En PowerShell:

```powershell
cd C:\Users\tomas\Fat\TOUCH-ID\src\SMAT\frontend
npm run build
cd ..
backend\venv\Scripts\python.exe backend\tools\armar_paquete.py   # crea src\SMAT\droid-e3d.tgz
```

El paquete lleva solo los archivos que están en git: nunca el `.env`, el `venv`, las fotos ni las claves.

## 3. Subirlo e instalar (consola Bash)

1. Pestaña **Files** → quedate en `/home/USUARIO/` → **Upload a file** → elegí `droid-e3d.tgz`.
2. Pestaña **Consoles** → **Bash**, y pegá:
   ```bash
   tar -xzf droid-e3d.tgz && rm droid-e3d.tgz
   bash ~/droid-e3d/backend/tools/instalar_pythonanywhere.sh
   ```
3. El script instala las librerías y te pide:
   - la **contraseña de MySQL** del paso 1, sin comillas simples;
   - un **mail de contacto**, para las notificaciones;
   - una **contraseña nueva** para los usuarios de ejemplo (`maria`, `juan`...). La de siempre, `pass123`,
     está publicada en el README, y en internet cualquiera podría usarla.

   Solo, sin que lo toques, genera todas las claves (JWT, YOLO, ROBOT y push), escribe el `.env` (que solo vos
   podés leer) y carga las tablas y los datos de ejemplo.
   Para ver las claves del robot y de la IA: `grep API_KEY ~/droid-e3d/backend/.env`.

## 4. Crear la web app

Pestaña **Web** → **Add a new web app** → *Next* → **Manual configuration** → **Python 3.11** → *Next*. Después, en esa misma página:

1. **Virtualenv:** `/home/USUARIO/droid-e3d/backend/venv`
2. **WSGI configuration file:** tocá el link, borrá todo lo que tiene y pegá esto (con tu usuario). Guardá con **Save**.
   ```python
   import sys
   sys.path.insert(0, "/home/USUARIO/droid-e3d/backend")
   from wsgi import application  # noqa
   ```
3. **Force HTTPS:** *Enabled*.
4. Arriba de todo: **Reload USUARIO.pythonanywhere.com**.

## 5. Probar

- https://USUARIO.pythonanywhere.com → la página pública de DROID-E3D.
- https://USUARIO.pythonanywhere.com/api/health → `{"status": "ok", ...}`.
- **Ingresar** con `maria` y la contraseña que elegiste en el paso 2.
- Si algo falla: pestaña **Web** → **Error log** (el último error está al final).

## 6. Actualizar después de un cambio

1. En tu PC, repetí el **paso 2**: `npm run build` y `armar_paquete.py`.
2. Subí el `droid-e3d.tgz` nuevo a `/home/USUARIO/` (pisá el anterior) y en la consola Bash:
   ```bash
   tar -xzf droid-e3d.tgz && rm droid-e3d.tgz
   bash ~/droid-e3d/backend/tools/instalar_pythonanywhere.sh
   ```
   Como ya existe el `.env`, el script solo actualiza las librerías: **no cambia las claves ni los datos**.
3. Pestaña **Web** → **Reload**. Las tablas nuevas se crean solas al recargar (no hace falta borrar la base).

## 7. Conectar el robot y la IA

- Dirección del backend: `https://USUARIO.pythonanywhere.com/api` (el resto es igual a `API.md`).
- Claves: las `YOLO_API_KEY` y `ROBOT_API_KEY` del `.env` del servidor. Pasalas por fuera de GitHub.
- El **video en vivo** de una cámara de la red local (`http://...`) no se ve desde la versión online
  (https): la página lo avisa. Se ve en la demo local.

## 8. Límites del plan gratis

- Cada 3 meses hay que entrar a la pestaña **Web** y tocar **Run until 3 months from today**, o la web se apaga.
- Solo deja conectarse a una lista de sitios de internet. Si las notificaciones no llegan y el *Error log* dice
  `Tunnel connection failed: 403`, ese servicio de push no está en la lista: se puede pedir en el foro de
  PythonAnywhere o pasar al plan pago (USD 5 por mes).
- La web se ve igual sin notificaciones: el banner y el sonido de alertas funcionan siempre.

---

## Ver la versión compilada en tu PC (sin publicar nada)

Es lo mismo que va a quedar online, servido por el Flask de tu PC:

```powershell
cd C:\Users\tomas\Fat\TOUCH-ID\src\SMAT\frontend
npm run build
```

Con el backend andando, abrí **http://localhost:5000**. Desde el celular, en la misma WiFi:
`http://IP-DE-LA-PC:5000` (la IP la muestra `ipconfig`). Ahí la app funciona, pero sin instalarse ni
notificaciones, porque el celular solo las permite con https.
