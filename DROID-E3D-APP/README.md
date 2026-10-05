# DROID-E3D · by SMAT

> **SMAT** es una división de **TOUCH**. **DROID-E3D** es su producto: un robot de inspección que usa
> IA (YOLO) para detectar si los empleados de una fábrica usan su equipo de protección personal (EPP),
> más esta aplicación web para ver y gestionar las alertas.
> Plan de trabajo: [docs/PLAN.md](docs/PLAN.md) · Forma de trabajo: [PROMPT_MAESTRO.md](PROMPT_MAESTRO.md)

- **Empleado:** ve las alertas donde fue detectado y el EPP de su zona.
- **Encargado:** panel, incidencias, empleados, zonas, robot, reportes y auditoría.

> La versión final de este README (capturas, demo) se escribe en la tarea 9.4.

## Estructura

```
DROID-E3D-APP/
├── backend/          Flask (Python) + MySQL  → puerto 5000
│   ├── app.py  config.py  models.py
│   ├── routes/       auth.py (login) · incidents.py (alertas y estadísticas)
│   └── database/     schema.sql
├── frontend/         React + Vite            → puerto 5173
│   └── src/          api/client.js · components/
└── docs/             PLAN.md (y luego API.md, BITACORA.md, decisiones/)
```

## Cómo ejecutarlo (Windows)

### 1. Base de datos
Iniciá MySQL desde XAMPP y ejecutá `backend/database/schema.sql` (Workbench o consola).

### 2. Backend
```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env      # y poné tu contraseña de MySQL (en XAMPP suele estar vacía)
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
Abrí: http://localhost:5173

### Usuarios de prueba
| Usuario | Contraseña | Rol |
|---|---|---|
| juan | pass123 | empleado |
| maria | pass123 | encargado |

## API (versión inicial; se amplía en docs/API.md)

| Método | Ruta | Para qué |
|---|---|---|
| POST | /api/login | Iniciar sesión |
| GET | /api/incidents | Listar alertas (`?zona=Zona A` opcional) |
| POST | /api/incidents | **Lo usa el servidor YOLO** para registrar una alerta |
| PUT | /api/incidents/:id/resolver | Marcar alerta como resuelta |
| GET | /api/stats | Estadísticas (solo encargado) |

Ejemplo de lo que envía YOLO:
```json
{ "tipo": "sin_casco", "zona": "Zona A", "empleado_id": 1, "confianza": 0.93 }
```
