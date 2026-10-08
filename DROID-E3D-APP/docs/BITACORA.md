# Bitácora de DROID-E3D

> Una entrada por semana (más nueva arriba). Se genera con `/bitacora`.

## Semana 1 · desde el 05/10/2026

**Hecho**
- Se definió la jerarquía: TOUCH (empresa madre) → SMAT (división) → DROID-E3D (producto).
- Se migró la app al repo compartido `Code7C26/TOUCH-ID` (rama `SMAT-web`).
- Plan completo reescrito (`docs/PLAN.md`): landing pública, empresa SMAT, hardware, push, reportes.
- Entorno verificado: Python, Node, MySQL (XAMPP), `gh`. Backend y frontend arrancan.
- Etiquetas `smat:*`, plantillas de Issue y PR, `CONTRIBUIR.md`.

**Problemas**
- Node.js y GitHub CLI no estaban instalados (resuelto con winget).
- El repo anterior (KIDO-bysmaft) tenía material de proyectos viejos; se dejó de usar.

**Decisiones**
- Ver `docs/decisiones/001` a `005`.

**Próximos pasos**
- Terminar la Fase 0 y abrir el primer PR a `main`.
- Fase 1: backend sólido y `docs/API.md` para que Morena empiece con el hardware.
