---
description: Genera la entrada semanal de la bitácora
---
Armá una entrada nueva al principio de docs/BITACORA.md para la semana actual usando
`git log --since="7 days ago" --oneline` y los issues cerrados/abiertos (`gh issue list --state all`
si `gh` está disponible). Secciones: Hecho · Problemas · Decisiones · Próximos pasos · Issues cerrados.
Lenguaje simple. No inventes nada que no esté en el log. Mostrame la entrada antes de commitear.
