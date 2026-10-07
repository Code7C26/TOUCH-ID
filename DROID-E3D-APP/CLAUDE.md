# DROID-E3D-APP

**Jerarquía:** TOUCH (empresa madre, repo `Code7C26/TOUCH-ID`) → SMAT (división; socios Toro y Morena)
→ DROID-E3D (producto de SMAT = robot + web). Marca: "DROID-E3D by SMAT · una división de TOUCH".

Robot oruga con ESP32 recorre la fábrica, una cámara + IA YOLO detecta si los empleados usan su EPP
(casco, guantes, lentes, chaleco) e identifica al empleado por reconocimiento facial. Si no lo usan:
alarma y/o parada de la máquina. Esta carpeta es la app web; la empresa vive en `../EMPRESA-SMAT/`.
**Morena** es socia de SMAT y además responsable de hardware/IA (ESP32, relé, cámara, YOLO, facial). Hasta que tenga el hardware se usan simuladores y `docs/API.md`.

Flujo: cámara → servidor YOLO → POST /api/incidents (este backend) → MySQL → web (+ push al celular).
El ESP32 consulta por HTTP al backend qué comando ejecutar y si su máquina debe estar parada.

## Stack
- backend/: Flask + Flask-SQLAlchemy + PyMySQL + JWT. `python app.py` (puerto 5000). MySQL de XAMPP.
- frontend/: React 18 + Vite + react-router-dom + Tailwind (+ recharts, vite-plugin-pwa). `npm run dev` (5173).
- Roles: `empleado` (ve lo suyo) y `encargado` (panel, gestión, robot, reportes, auditoría).
- Claves en `.env` (nunca en el repo): `YOLO_API_KEY`, `ROBOT_API_KEY`, `VAPID_*`.

## Repo y equipo
- Repo `Code7C26/TOUCH-ID`. Ramas: `SMAT-web` (esta), `SMAT-empresa`, `SMAT-hardware`. PR a `main` al final de cada fase.
- No tocar las carpetas de TOUCH (`assets/`, `design/`, `docs/`, `src/` de la raíz). Permitido: `DROID-E3D-APP/`, `EMPRESA-SMAT/`, `.github/` (archivos `smat-*`).
- Nunca `git add .` desde la raíz del repo ni push directo a `main`.
- Al terminar una fase con todas las pruebas en verde, Claude abre el PR y lo mergea; se frena si algo falla o si cambia `docs/API.md` (lo revisa Morena).
- Tareas del profe llegan por Classroom: el usuario las pasa con `/tarea-profe` → Issue en GitHub + sección "Tareas del profe" del PLAN.

## Fuentes de verdad
- docs/PLAN.md → tareas, mapa del sitio, estructura, base de datos, orden y calendario.
- PROMPT_MAESTRO.md → forma de trabajo.
- docs/API.md → contrato con hardware/IA (no romperlo sin avisar).
- docs/FABRICA-CLIENTE.md → datos de la fábrica cliente. docs/decisiones/ → por qué de cada decisión.

## Reglas
- Español en código, comentarios y UI. Código simple y comentado (autor principiante).
- Trabajar tarea por tarea del PLAN, marcar [x], commit por tarea (`closes #N` si hay issue), pausa al final de cada fase.
- Verificar: `python -m py_compile` (backend), `npm run build` (frontend) y las pruebas automáticas (Fase T).
- Diseño: estilo SaaS moderno (ver Fase R del PLAN). Reportes al usuario: cortos y con capturas.
- El usuario usa Windows: dar comandos para PowerShell.
- No borrar archivos ni instalar librerías fuera de las aprobadas sin preguntar.
