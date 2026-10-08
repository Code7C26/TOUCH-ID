# 003 · Tailwind CSS para el diseño

**Fecha:** 2026-10-05 · **Estado:** aceptada

## Contexto
La web tiene que verse profesional, funcionar en celular (360 px) y en PC, y tener modo claro y oscuro,
en menos de un mes.

## Opciones
1. **Tailwind CSS**: clases utilitarias, modo oscuro integrado, sin librería de componentes.
2. CSS propio: cero dependencias, pero más lento de mantener.
3. Material UI / Mantine: componentes listos, pero más pesado y difícil de explicar.

## Decisión
Tailwind. Los colores de seguridad industrial se definen una sola vez en la configuración.

## Consecuencias
El manual de marca (docs/SMAT/EMPRESA-SMAT/03-marca) define los colores finales; hasta entonces son provisionales.

## Nota de implementación (2026-10-06)
Se usa **Tailwind 4** con su plugin oficial de Vite (`@tailwindcss/vite`), que reemplaza a postcss + autoprefixer.
La configuración está en `frontend/src/index.css` (`@theme`), no en un `tailwind.config.js`.
