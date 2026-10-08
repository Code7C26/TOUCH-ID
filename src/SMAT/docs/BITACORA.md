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

**Problemas**
- Node.js y GitHub CLI no estaban instalados (resuelto con winget).
- El repo anterior (KIDO-bysmaft) tenía material de proyectos viejos; se dejó de usar.
- Los acentos se guardaban mal al cargar `schema.sql` desde la consola de Windows; se corrigió con `SET NAMES utf8mb4`.

**Decisiones**
- Ver `docs/decisiones/001` a `005`.

**Próximos pasos**
- Fase 6: foto de evidencia en las alertas, fotos de rostro con consentimiento y simulador de YOLO.
- Morena: revisar `docs/API.md` y el acuerdo de socios; probar el robot y el relé contra el backend.
