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

## Estado técnico (06/10/2026)

| Área | Estado |
|---|---|
| Backend: login con roles, zonas, empleados, incidencias, auditoría | ✅ Funciona; verificado con 76 chequeos automáticos de permisos y validaciones (script local, aún no incluido en el repo) |
| Backend: endpoints para YOLO y ESP32 (`/incidents`, `/robot/*`, `/zones/<id>/maquina`) | ✅ Funciona; falta probarlo con el hardware real |
| Backend: control del robot desde la web (estado, comandos, ruta, video) | ✅ Funciona |
| Backend: parada automática de la máquina, foto de evidencia, fotos de rostro, push, reportes | 🔜 Pendiente (Fases 5 a 8) |
| Frontend: login, base visual (claro/oscuro, celular y PC), menú por rol y pantallas del **empleado** (inicio, mis alertas, perfil) | ✅ Funciona; 24 chequeos automáticos con Edge |
| Frontend: pantallas del **encargado** (panel con mapa de la fábrica, incidencias, empleados, zonas) | ✅ Funciona; 44 chequeos automáticos con Edge |
| Frontend: control del robot con video en vivo, reportes, auditoría, página pública de SMAT, push | 🔜 Pendiente (Fases 5 a 8 y L) |
| Hardware e IA (robot, relé, cámara, YOLO, reconocimiento facial) | En desarrollo por Morena; integración pendiente |

El detalle tarea por tarea está en [`docs/PLAN.md`](docs/PLAN.md) y el reporte de avance en [`../docs/SMAT/`](../docs/SMAT/).

## Estructura

```
DROID-E3D-APP/
├── backend/            Flask + MySQL → puerto 5000
│   ├── app.py  config.py  models.py
│   ├── routes/         auth · incidents · zones · users · robot · rostros
│   ├── utils/          decoradores.py (sesión, rol, clave de API) · auditoria.py
│   └── database/       schema.sql (tablas + datos de ejemplo)
├── frontend/           React + Vite → puerto 5173
│   └── src/            api/client.js (todas las llamadas al backend) · components/
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

### Probar la integración sin hardware
```powershell
$h = @{ "X-API-KEY" = "<tu YOLO_API_KEY>"; "Content-Type" = "application/json" }
$body = '{"tipo":"sin_casco","zona_id":1,"empleado_id":1,"confianza":0.93}'
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/incidents -Headers $h -Body $body
```
Después entrá como `maria` (o como `juan`) y la alerta aparece en la lista. Más ejemplos en [`docs/API.md`](docs/API.md) y [`docs/integracion/`](docs/integracion/).

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
- Las fotos de rostro (Fase 6) solo se guardan con consentimiento del empleado (Ley 25.326).
