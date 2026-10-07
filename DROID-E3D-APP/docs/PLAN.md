# PLAN DE DESARROLLO · DROID-E3D-APP

> Hoja de ruta que sigue Claude Code. Cada tarea se marca `[x]` al terminarla.
> Orden de ejecución: ver sección 4 (no es siempre el número de fase).

**Jerarquía:** TOUCH (empresa madre) → SMAT (división: Toro y Morena) → DROID-E3D (producto = robot + web).
**Repo:** `Code7C26/TOUCH-ID` · rama de trabajo `SMAT-web` · PR a `main` al final de cada fase.
**Hardware/IA:** **Morena** (ESP32, relé, cámara, YOLO, reconocimiento facial), rama `SMAT-hardware`.
Mientras no esté el hardware, el backend se prueba con los simuladores y el contrato de `docs/API.md`.

---

## 1. Mapa del sitio

### Pública (sin login)
| Ruta | Página | Qué muestra |
|---|---|---|
| `/` | Inicio | Qué es DROID-E3D, el problema, botón "Pedir demo" |
| `/como-funciona` | Cómo funciona | Diagrama cámara → IA → alerta → parada de máquina |
| `/planes` | Planes | Robot + abono de la web + mantenimiento |
| `/nosotros` | Nosotros | SMAT, división de TOUCH; equipo |
| `/contacto` | Contacto | mailto + WhatsApp |
| `/login` | Login | Usuario y contraseña |

### Empleado (celular) · bajo `/app`
| Ruta | Página | Qué muestra |
|---|---|---|
| `/app` | Inicio | Estado de su zona, EPP que debe usar, % cumplimiento, últimas alertas |
| `/app/mis-alertas` | Mis alertas | Alertas donde él fue detectado, con foto, filtro por fecha, comentar |
| `/app/perfil` | Perfil | Datos, zona, EPP, fotos de rostro, activar notificaciones |

### Encargado (celular y PC) · bajo `/app`
| Ruta | Página | Qué muestra |
|---|---|---|
| `/app/panel` | Panel | Tarjetas, mapa de fábrica en grilla, robot, últimas alertas |
| `/app/incidencias` | Incidencias | Tabla con filtros, detalle con foto, comentarios, resolver |
| `/app/empleados` | Empleados | CRUD, asignación de zona, fotos de rostro con consentimiento |
| `/app/zonas` | Zonas | CRUD, máquina, EPP, posición en la grilla, reactivar máquina |
| `/app/robot` | Robot | Video en vivo, estado, batería, ruta, iniciar/pausar, EMERGENCIA |
| `/app/reportes` | Reportes | Gráficos, ranking de cumplimiento, CSV y PDF |
| `/app/auditoria` | Auditoría | Quién hizo qué y cuándo |

### Comunes
- `Layout` con barra superior + menú inferior en celular (según rol); `LayoutPublico` para la landing.
- `RutaProtegida`: sin sesión → `/login`; rol incorrecto → su inicio.
- Tema claro/oscuro, banner + sonido de alerta nueva, PWA instalable.

---

## 2. Estructura de carpetas objetivo

```
backend/
├── app.py  config.py  models.py
├── routes/   auth · incidents · users · zones · robot · reports · push · auditoria
├── utils/    decoradores.py · auditoria.py · push.py
├── uploads/  (evidencias y rostros; en .gitignore)
├── database/schema.sql
└── tools/    simular_yolo.py · simular_esp32.py

frontend/src/
├── api/client.js
├── context/    AuthContext.jsx  TemaContext.jsx
├── components/ Layout LayoutPublico NavBar BottomNav RutaProtegida Logo
│               AlertCard StatCard Tabla Modal Filtros MapaFabrica VideoEnVivo AlertaSonora
├── pages/      publico/  empleado/  encargado/
├── hooks/      usePolling.js  useNotificaciones.js
├── utils/formato.js
└── App.jsx  main.jsx  index.css
```

---

## 3. Base de datos objetivo

- **usuarios**: id, usuario, contrasena, nombre, legajo, rol, zona_id, activo, created_at
- **fotos_rostro**: id, usuario_id, ruta_archivo, consentimiento_at
- **zonas**: id, nombre, maquina, epp_requerido, maquina_activa, grilla_x, grilla_y, ancho, alto
- **incidencias**: id, tipo, timestamp, zona_id, empleado_id, confianza, estado, imagen_url, resuelta_por, resuelta_at
- **comentarios**: id, incidencia_id, usuario_id, texto, created_at
- **robot**: id, estado, bateria, zona_actual_id, comando_pendiente, url_video, ultima_conexion
- **puntos_ruta**: id, orden, zona_id, tiempo_espera_seg
- **suscripciones_push**: id, usuario_id, endpoint, p256dh, auth
- **auditoria**: id, usuario_id, accion, detalle, created_at

---

## 4. Orden de ejecución y calendario (inicio 05/10/2026, < 1 mes)

`/siguiente` sigue este orden: **0 → E.0-E.1 → 1 → 2 → 3 → 4 → 5 → T → R → 6 → L → 7 → 8 → 9**.
(Actualizado 07/10/2026: se suman T (pruebas en el repo) y R (rediseño SaaS) antes de la Fase 6; L pasa después de 6).
La Fase E (resto) avanza en paralelo con los socios. Las tareas `P.N` urgentes del profe van primero.

| Semana | Web (Toro + Claude) | Empresa (Toro + Morena) | Hardware/IA (Morena) |
|---|---|---|---|
| 1 · 05/10 | Fase 0, Fase 1 (API.md + stubs) | E.0, E.1, E.2 | Revisa API.md, arma ESP32 con ejemplos |
| 2 · 12/10 | Fases 2, 3, 4 | E.3, E.4 marca | Robot + relé contra stubs |
| 3 · 19/10 | Fase L, 5, 6 | E.5, E.6 | YOLO + facial, prueba conjunta |
| 4 · 26/10 | Fases 7, 8, 9 (despliegue) | E.7-E.10 | Ajustes, demo |

> Si hay atraso se ajusta en la bitácora; no se borra nada del plan (decisión: no recortar).

---

## 5. Tareas por fase

### Fase 0 · Arranque y GitHub
- [x] 0.0 Instalar Node LTS y GitHub CLI con winget · PAUSA: el usuario corre `gh auth login`
- [x] 0.1 Crear `.env` desde `.example`, venv + `pip install`, `npm install`; MySQL (XAMPP) iniciado; `/api/health` y `npm run build` OK
- [x] 0.2 `.gitignore` de la app (venv, node_modules, .env, uploads, __pycache__, dist)
- [x] 0.3 Labels `smat:*`, plantillas `.github/` con prefijo smat, `CONTRIBUIR.md`
- [x] 0.4 `docs/FABRICA-CLIENTE.md` (borrador), `docs/BITACORA.md` (semana 1), `docs/decisiones/001…005`
- [x] 0.5 Comandos `/tarea-profe`, `/bitacora`, `/pr` · PR `SMAT-web → main`

### Fase 1 · Backend sólido
- [x] 1.1 Modelo `Zona` (con grilla), `zona_id` en usuarios e incidencias, `legajo` · PAUSA: recrear base
- [x] 1.2 `utils/decoradores.py` (`token_required`, `rol_requerido`), contraseñas con werkzeug, `GET /api/me`
- [x] 1.3 `/incidents`: empleado solo las suyas; filtros (zona_id, empleado_id, estado, desde, hasta, paginado); resolver solo encargado
- [x] 1.4 `/api/zones` y `/api/users` CRUD (escritura solo encargado)
- [x] 1.5 `schema.sql`: 4 zonas, 6 empleados, 1 encargado, ~40 incidencias de 30 días
- [x] 1.6 Auditoría: tabla + helper `registrar(accion, detalle)`
- [x] 1.7 `docs/API.md` con el contrato de hardware/IA · PAUSA: la revisa Morena
- [x] 1.8 Stubs de endpoints de hardware (`X-API-KEY`, Robot/PuntoRuta mínimos, `maquina_activa`) + `docs/integracion/`

### Fase 2 · Base del frontend
- [x] 2.1 Tailwind con colores de seguridad provisionales (hasta el manual de marca E.4) + modo oscuro
- [x] 2.2 `AuthContext` + `TemaContext`, reemplazar el estado de `App.jsx`
- [x] 2.3 `Logo` SVG, `Layout`, `NavBar`, `BottomNav`, `RutaProtegida`
- [x] 2.4 Mover a `pages/` y crear todas las rutas bajo `/app/*` (páginas vacías)
- [x] 2.5 `usePolling`, `utils/formato.js`, StatCard, Tabla, Modal, Filtros

### Fase 3 · Páginas del empleado
- [x] 3.1 Inicio · [x] 3.2 Mis alertas · [x] 3.3 Perfil

### Fase 4 · Páginas del encargado
- [x] 4.1 `MapaFabrica` (SVG en grilla)
- [x] 4.2 Panel · [x] 4.3 Incidencias · [x] 4.4 Empleados · [x] 4.5 Zonas

### Fase L · Landing pública
- [ ] L.1 `LayoutPublico` y rutas públicas
- [ ] L.2 Inicio, Cómo funciona, Planes, Nosotros, Contacto (textos de EMPRESA-SMAT; si faltan, `TODO`)
- [ ] L.3 Capturas reales, SEO básico, responsive

### Fase 5 · Robot y máquinas
- [x] 5.1 `/api/robot/estado|ruta|comando` para la web
- [x] 5.2 Endpoints ESP32 completos (`comando-pendiente`, `reporte`; robot "desconectado" si no reporta en 10 s)
- [x] 5.3 Incidencia → `maquina_activa=false`; `PUT /api/zones/<id>/reactivar` (encargado, auditado)
- [x] 5.4 Página Robot + robot visible en el mapa
- [x] 5.5 `VideoEnVivo` (MJPEG desde `url_video`)
- [x] 5.6 `tools/simular_esp32.py`

### Fase T · Pruebas automáticas en el repo
- [x] T.1 Pruebas de la API en `backend/tests/` (pytest) con base de datos de prueba
- [x] T.2 Pruebas de punta a punta de la web en `tests/e2e/` (Playwright con Edge o Chromium): empleado, encargado y robot simulado
- [ ] T.3 GitHub Actions (`.github/workflows/smat-ci.yml`): compila y corre las pruebas en cada PR que toque `DROID-E3D-APP/`

### Fase R · Rediseño estilo SaaS (pedido del usuario, 07/10/2026)
- [ ] R.1 Sistema visual: colores neutros, sombras suaves, radios, botones, campos, etiquetas y avatares con iniciales
- [ ] R.2 Barra lateral fija estilo SaaS (logo, usuario abajo, colapsable a íconos); menú inferior en celular
- [ ] R.3 Avisos flotantes (toast), confirmaciones claras con ícono y nombre de la acción, panel lateral (drawer) para formularios
- [ ] R.4 Validación en vivo en formularios (login, empleados, zonas, ruta)
- [ ] R.5 Tablas con orden por columna, búsqueda y avatares
- [ ] R.6 Tarjetas del panel con tendencia (vs. semana anterior) y mini gráfico
- [ ] R.7 Mapa: íconos de máquina y EPP, robot animado con su recorrido, panel lateral con el detalle de la zona

### Fase 6 · YOLO y reconocimiento facial
- [ ] 6.1 `POST /api/incidents` acepta imagen (multipart → `uploads/`); la clave `YOLO_API_KEY` ya se exige desde 1.8
- [ ] 6.2 Fotos de rostro con consentimiento (Ley 25.326) + `GET /api/rostros`
- [ ] 6.3 Evidencia en detalle y en AlertCard
- [ ] 6.4 `tools/simular_yolo.py`
- [ ] 6.5 Prueba de integración real (`docs/integracion/PRUEBA.md`) cuando exista el hardware

### Fase 7 · Tiempo real
- [ ] 7.1 `AlertaSonora`: polling 3 s + banner + botón "activar sonido"
- [ ] 7.2 PWA con `vite-plugin-pwa`
- [ ] 7.3 Web Push (VAPID, `/api/push/suscribir`, `useNotificaciones`)

### Fase 8 · Reportes y extras
- [ ] 8.1 `/api/reports/diario` y `/api/reports/ranking`
- [ ] 8.2 Página Reportes (recharts + ranking)
- [ ] 8.3 Export CSV y PDF mensual (reportlab)
- [ ] 8.4 Comentarios en incidencias
- [ ] 8.5 Página Auditoría

### Fase 9 · Pulido y despliegue
- [ ] 9.1 Revisión 360px / PC / modo oscuro; errores y estados de carga
- [ ] 9.2 Guía de demo local (IP de la PC, firewall)
- [ ] 9.3 PythonAnywhere + Vercel/Netlify (`docs/DESPLIEGUE.md`)
- [ ] 9.4 README final con capturas y guion de demo

### Fase E · Empresa SMAT desde cero (carpeta `../EMPRESA-SMAT/`, rama `SMAT-empresa`)
Cada socio (Toro, Morena) escribe su parte; Claude ayuda solo en las de Toro y deja `TODO (socio)` donde falte una decisión.
- [x] E.0 Estructura con plantillas y `EMPRESA-SMAT/README.md` índice
- [x] E.1 Issues `smat:empresa` (#29 a #37, uno por carpeta), asignados a Toro con revisión de Morena
- [x] E.2 Identidad (misión, visión, valores, relación con TOUCH)
- [x] E.3 Organización (organigrama TOUCH → SMAT, roles, acuerdo de socios, decisiones, actas)
- [x] E.4 Marca (nombre, logo, manual de marca, redes y dominio)
- [x] E.5 Negocio (canvas, cliente ideal, competencia, propuesta de valor)
- [x] E.6 Finanzas (inversión, costos de DROID-E3D, precios, proyección 3 años, financiamiento)
- [x] E.7 Comercial (marketing, propuesta modelo, contrato de servicio modelo)
- [x] E.8 Legal (forma jurídica, propiedad intelectual, normativa EPP, datos personales)
- [x] E.9 FODA
- [x] E.10 Pitch y guion para el jurado/cliente

### Tareas del profe (sección viva, se llena con `/tarea-profe`)
Formato: `- [ ] P.N descripción (#issue)`
- [x] P.1 Reporte de avance de 1 página en PDF subido a `docs/SMAT/` (#25)
- [x] P.2 Jornada remota: refactor + feat + docs, con capturas y tarjeta en Done (#26)
