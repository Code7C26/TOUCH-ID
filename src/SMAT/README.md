# DROID-E3D · by SMAT

> **SMAT** es una división de **TOUCH**. **DROID-E3D** es su producto: un robot de inspección que usa IA (YOLO)
> para detectar si los empleados de una fábrica usan su equipo de protección personal (EPP), y esta aplicación
> web donde se ven y gestionan las alertas y se controla el robot.

**Documentos:** [Plan de trabajo](docs/PLAN.md) · [API para hardware e IA](docs/API.md) · [Cómo contribuir](CONTRIBUIR.md) ·
[Decisiones técnicas](docs/decisiones/) · [Bitácora](docs/BITACORA.md) · [Fábrica cliente](docs/FABRICA-CLIENTE.md)

## Cómo funciona

```
Cámara → servidor YOLO ──POST /api/incidents──▶ Backend Flask ──▶ MySQL ──▶ Web (React)
                                                     ▲
                       ESP32 del robot y de las máquinas consultan por HTTP cada 1-2 s
```

- **Empleado:** ve las alertas donde fue detectado y el EPP de su zona.
- **Encargado:** ve todas las alertas y las resuelve, gestiona zonas y empleados, controla el robot (iniciar, pausar, parada de emergencia, ruta) y ve el estado de las máquinas.
- **Máquinas (YOLO y ESP32):** no tienen usuario; se identifican con una clave en el header `X-API-KEY`.

## Estado técnico (07/10/2026)

Pruebas automáticas en el repo: **83 de la API** (pytest) y **29 de punta a punta** en el navegador (Playwright). Corren solas en GitHub Actions en cada PR.

| Área | Estado |
|---|---|
| Backend: login con roles, zonas, empleados, incidencias (filtros, orden, búsqueda, estadísticas), auditoría | ✅ Funciona |
| Backend: endpoints para YOLO y ESP32 (`/incidents`, `/rostros`, `/robot/*`, `/zones/<id>/maquina`) | ✅ Funciona; falta probarlo con el hardware real |
| Backend: parada automática de la máquina al detectar una falta y reactivación por el encargado | ✅ Funciona |
| Backend: foto de evidencia en las alertas y fotos de rostro con consentimiento (Ley 25.326) | ✅ Funciona |
| Frontend: diseño estilo SaaS (claro/oscuro, celular y PC), pantallas del empleado y del encargado | ✅ Funciona |
| Frontend: control del robot con video en vivo, mapa con recorrido, detalle de cada zona | ✅ Funciona con el simulador |
| Frontend: evidencia en las alertas, fotos de rostro (encargado y empleado) | ✅ Funciona |
| Página pública de SMAT (`/`, `/como-funciona`, `/planes`, `/nosotros`, `/contacto`) | ✅ Funciona; mail y WhatsApp de contacto en `frontend/.env` |
| Push, reportes, auditoría (pantalla) | 🔜 Pendiente (Fases 7 y 8) |
| Hardware e IA (robot, relé, cámara, YOLO, reconocimiento facial) | En desarrollo por Morena. Mientras tanto: `backend/tools/simular_esp32.py` y `backend/tools/simular_yolo.py` |

El detalle tarea por tarea está en [`docs/PLAN.md`](docs/PLAN.md) y los documentos de la empresa y el reporte de avance en [`docs/SMAT/`](../../docs/SMAT/) (en la raíz del repo).

## Estructura

```
src/SMAT/
├── backend/            Flask + MySQL → puerto 5000
│   ├── app.py  config.py  models.py
│   ├── routes/         auth · incidents · zones · users · robot · rostros
│   ├── utils/          decoradores.py (sesión, rol, clave de API) · auditoria.py
│   └── database/       schema.sql (tablas + datos de ejemplo)
├── frontend/           React + Vite → puerto 5173
│   └── src/            api/client.js (todas las llamadas al backend) · components/
├── servidor_ia/        IA de Morena: YOLO + reconocimiento facial → manda las alertas a la web
└── docs/               PLAN · API · FABRICA-CLIENTE · BITACORA · decisiones/ · integracion/
```

## Cómo usarlo (Windows, PowerShell)

Necesitás: Python 3.11, Node.js LTS y MySQL (alcanza con XAMPP).

### 1. Base de datos
Iniciá **MySQL** desde el panel de XAMPP y cargá el esquema con los datos de ejemplo:
```powershell
C:\xampp\mysql\bin\mysql.exe -u root < backend\database\schema.sql
```
Para empezar de cero (borra los datos): `C:\xampp\mysql\bin\mysql.exe -u root -e "DROP DATABASE robot_db;"` y volver a cargar el esquema.

### 2. Backend
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```
Editá `backend\.env`: poné `DB_PASS` (en XAMPP suele estar vacía), un `JWT_SECRET` propio y las dos claves de las máquinas.
Para generar una clave:
```powershell
python -c "import secrets; print(secrets.token_urlsafe(24))"
```
`YOLO_API_KEY` es para el servidor de IA y `ROBOT_API_KEY` para los ESP32. **El `.env` nunca se sube al repo.**
Para las notificaciones push (opcional), generá las claves VAPID una sola vez y pegá las dos líneas en el `.env`:
```powershell
python tools\generar_claves_push.py
```
```powershell
python app.py
```
Probá: http://localhost:5000/api/health

### 3. Frontend (otra terminal)
```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```
Abrí: http://localhost:5173 . Para entrar desde el celular, poné la IP de tu PC en `frontend\.env` (`VITE_API_URL=http://<IP>:5000/api`) y permití el puerto 5000 en el Firewall de Windows.

### Usuarios de prueba (contraseña `pass123`)
| Usuario | Rol | Zona |
|---|---|---|
| `maria` | encargado | — |
| `juan`, `lucia` | empleado | Zona A |
| `carlos`, `ana` | empleado | Zona B |
| `pedro` | empleado | Zona C |
| `sofia` | empleado | Zona D |

### Probar el robot sin hardware
```powershell
cd backend
venv\Scripts\activate
python tools\simular_esp32.py --velocidad 10 --maquinas
```
Con el backend y la web andando, entrá como `maria` a **Robot** y tocá **Iniciar**: el robot simulado recorre las zonas, reporta su batería y obedece pausar, detener y la parada de emergencia. Con `--maquinas` también se ve cuándo se «corta» y se «reactiva» cada máquina.

### Probar la integración con la IA sin hardware
```powershell
$h = @{ "X-API-KEY" = "<tu YOLO_API_KEY>"; "Content-Type" = "application/json" }
$body = '{"tipo":"sin_casco","zona_id":1,"empleado_id":1,"confianza":0.93}'
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/incidents -Headers $h -Body $body
```
Después entrá como `maria` (o como `juan`) y la alerta aparece en la lista. Más ejemplos en [`docs/API.md`](docs/API.md) y [`docs/integracion/`](docs/integracion/).

## Pruebas automáticas

```powershell
cd C:\Users\tomas\Fat\TOUCH-ID\src\SMAT
backend\venv\Scripts\activate
pip install -r backend\requirements-dev.txt      # una sola vez

python -m pytest backend\tests        # 83 pruebas de la API (~30 s), usan la base robot_db_test
python tests\correr_e2e.py            # 29 pruebas con navegador real (~3 min), usan robot_db_e2e
```
Las pruebas **nunca tocan la base de desarrollo** (`robot_db`). Las de punta a punta levantan su propio backend (puerto 5001) y su propia web (5174), y prueban también el robot con el ESP32 simulado.
En GitHub corren solas en cada Pull Request (`.github/workflows/smat-ci.yml`): si algo se rompe, el PR muestra una cruz roja.

## API (resumen)

Todas las rutas llevan el prefijo `/api`. Contrato completo en [`docs/API.md`](docs/API.md).

| Método | Ruta | Quién | Para qué |
|---|---|---|---|
| POST | `/login` · GET `/me` | personas | Iniciar sesión y ver el propio perfil |
| GET | `/incidents` | personas | Alertas (el empleado ve solo las suyas); filtros y paginado |
| POST | `/incidents` | YOLO | Registrar una falta de EPP |
| PUT | `/incidents/:id/resolver` | encargado | Marcar una alerta como resuelta |
| GET | `/stats` | encargado | Estadísticas del panel |
| GET/POST/PUT/DELETE | `/zones`, `/users` | encargado (lectura de zonas: todos) | Gestión de zonas y empleados |
| GET/POST/PUT | `/robot/estado`, `/robot/comando`, `/robot/ruta`, `/robot/video` | encargado | Control del robot |
| GET/POST | `/robot/comando-pendiente`, `/robot/reporte` | ESP32 del robot | Recibir órdenes y reportar estado |
| GET | `/zones/:id/maquina` | ESP32 de la máquina | Saber si la máquina debe estar activa |

## Seguridad
- Contraseñas guardadas con hash (pbkdf2-sha256), nunca en texto.
- El rol se valida **en el backend**, no solo en la web.
- Las máquinas usan claves distintas por función; si falta o es incorrecta, la respuesta es `401`.
- Las fotos de rostro solo se guardan con consentimiento del empleado (Ley 25.326); él mismo puede borrarlas desde su perfil y se borran al darlo de baja. Ninguna foto es pública: se piden con sesión o con la clave de la IA.
