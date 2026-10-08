# Bitácora de DROID-E3D

> Una entrada por semana (más nueva arriba). Se genera con `/bitacora`.

## Semana 1 · desde el 05/10/2026

**Hecho**
- Se definió la jerarquía: TOUCH (empresa madre) → SMAT (división) → DROID-E3D (producto).
- Se migró la app al repo compartido `Code7C26/TOUCH-ID` (rama `SMAT-web`).
- Plan completo reescrito (`docs/PLAN.md`): landing pública, empresa SMAT, hardware, push, reportes.
- Entorno verificado: Python, Node, MySQL (XAMPP), `gh`. Backend y frontend arrancan.
- Etiquetas `smat:*`, plantillas de Issue y PR, `CONTRIBUIR.md`.
- 06/10: **Fase 2 y 3** de la web: Tailwind, claro/oscuro, menú por rol y las tres pantallas del empleado.
- 06/10: **Empresa SMAT** completa (versión 1): 29 documentos, acuerdo de socios, finanzas, legal, FODA, pitch y guion del jurado.
- 06/10: **Fase 4** de la web: mapa de la fábrica, panel, incidencias, empleados y zonas del encargado.
- 06/10: **Fase 5**: control del robot desde la web (órdenes, parada de emergencia, ruta), video en vivo, parada automática de la máquina y su reactivación, y simulador del ESP32.
- 07/10: **Fase T**: pruebas automáticas del backend (pytest) y de la web (Playwright), corriendo solas en GitHub Actions en cada PR.
- 07/10: **Fase R** (rediseño estilo SaaS): barra lateral, avisos flotantes, paneles laterales, validación en vivo, tablas ordenables con búsqueda, tarjetas con tendencia y mini gráfico, y mapa con íconos de máquina y EPP, robot animado, recorrido numerado y detalle de cada zona.
- 07/10: **Fase 6**: foto de evidencia en cada alerta, fotos de rostro con consentimiento (Ley 25.326) que maneja el encargado o el propio empleado, `GET /rostros` para la IA, simulador de YOLO y guía de la prueba real.
- 08/10: Morena reorganiza el repo (la web pasa a `src/SMAT/`, la empresa a `docs/SMAT/`) y sube su servidor de IA (YOLO + reconocimiento facial). Se renombra a `src/SMAT/servidor_ia/` y se conecta con el backend: cada alerta llega a la web con la foto, el nombre del trabajador y la zona del robot, y detiene la máquina.
- 08/10: **Revisión general**: recorrido automático de las 14 pantallas en 5 tamaños y temas (sin errores), pruebas de robustez (el servidor ya no se cae con datos raros), la baja o el cambio de rol cortan la sesión al instante, validación de la dirección del video y arreglos de la web en celular y tablet. 76 pruebas de la API y 17 de punta a punta.
- 08/10: **Fase L**: página pública de SMAT en `/` (Inicio, Cómo funciona, Planes, Nosotros, Contacto) con los textos de la empresa, capturas reales de la app con datos ficticios, título y descripción por página, menú para celular y 4 pruebas e2e.
- 08/10: **Entregas de Classroom** (tomando como modelo KIDO y lo de TOUCH): viabilidad comercial con costos reales y fuentes, Business Model Canvas, punto de equilibrio (2 clientes por año), mercado TAM/SAM/SOM (≈ 495 industrias en la zona), «Los primeros 10» con empresas reales de Alta Gracia y Malagueño, y balance del MVP (75 %). Todo en `docs/SMAT/documentacion-comercial/` con PDF. Tareas pendientes cargadas como Issues en el tablero Kanban con su estimación (#48 a #66). Se suman `assets/SMAT` y `design/SMAT`.

**Problemas**
- Node.js y GitHub CLI no estaban instalados (resuelto con winget).
- El repo anterior (KIDO-bysmaft) tenía material de proyectos viejos; se dejó de usar.
- Los acentos se guardaban mal al cargar `schema.sql` desde la consola de Windows; se corrigió con `SET NAMES utf8mb4`.

**Decisiones**
- Ver `docs/decisiones/001` a `005`.

**Próximos pasos**
- Fase 7: tiempo real (alerta sonora, PWA y notificaciones push). Fase 6.5: prueba real con el hardware de Morena (`docs/integracion/PRUEBA.md`).
- Morena: revisar `docs/API.md` y el acuerdo de socios; probar el robot y el relé contra el backend.
