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

## 2. Bajar el código e instalar el backend (consola Bash)

Pestaña **Consoles** → **Bash**. Copiá y pegá de a una línea:

```bash
git clone https://github.com/Code7C26/TOUCH-ID.git
cd ~/TOUCH-ID/src/SMAT/backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Generá las claves (copiá lo que imprime cada comando):

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"   # correlo 3 veces: JWT, YOLO y ROBOT
python tools/generar_claves_push.py                              # claves de las notificaciones
```

Abrí el `.env` con `nano .env` y dejalo así (con tus datos). Para guardar: `Ctrl+O`, `Enter`, `Ctrl+X`.

```ini
DB_HOST=USUARIO.mysql.pythonanywhere-services.com
DB_USER=USUARIO
DB_PASS=la contraseña de MySQL del paso 1
DB_NAME='USUARIO$droid'
JWT_SECRET=la primera clave generada
FLASK_DEBUG=0

YOLO_API_KEY=la segunda clave
ROBOT_API_KEY=la tercera clave

VAPID_PUBLIC_KEY=la que imprimió generar_claves_push.py
VAPID_PRIVATE_KEY=la que imprimió generar_claves_push.py
VAPID_CONTACTO=mailto:un-mail-de-contacto@ejemplo.com
```

Cargá las tablas y los datos de ejemplo. Te va a pedir una **contraseña nueva** para los usuarios de ejemplo
(`maria`, `juan`...): la de siempre, `pass123`, está publicada en el README y en internet cualquiera podría usarla.

```bash
python tools/cargar_datos_ejemplo.py
```

## 3. Subir la web compilada

La web se compila en **tu PC** (así lleva tus datos de contacto del `frontend\.env`). En PowerShell:

```powershell
cd C:\Users\tomas\Fat\TOUCH-ID\src\SMAT\frontend
npm run build
tar -czf web.tgz -C dist .
```

En PythonAnywhere, pestaña **Files** → entrá a `/home/USUARIO/TOUCH-ID/src/SMAT/frontend/` →
**Upload a file** → elegí `web.tgz`. Después, en la consola Bash:

```bash
cd ~/TOUCH-ID/src/SMAT/frontend
rm -rf dist && mkdir dist && tar -xzf web.tgz -C dist && rm web.tgz
```

## 4. Crear la web app

Pestaña **Web** → **Add a new web app** → *Next* → **Manual configuration** → **Python 3.11** → *Next*. Después, en esa misma página:

1. **Virtualenv:** `/home/USUARIO/TOUCH-ID/src/SMAT/backend/venv`
2. **WSGI configuration file:** tocá el link, borrá todo lo que tiene y pegá esto (con tu usuario). Guardá con **Save**.
   ```python
   import sys
   sys.path.insert(0, "/home/USUARIO/TOUCH-ID/src/SMAT/backend")
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

```bash
cd ~/TOUCH-ID && git pull
cd src/SMAT/backend && source venv/bin/activate && pip install -r requirements.txt
```

Si cambió la web, repetí el **paso 3**. Siempre al final: pestaña **Web** → **Reload**.
Las tablas nuevas se crean solas al recargar (no hace falta borrar la base).

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
