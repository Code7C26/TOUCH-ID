# 005 · Despliegue: PythonAnywhere + Vercel/Netlify

**Fecha:** 2026-10-05 · **Estado:** aceptada

## Contexto
La demo se muestra en red local y además tiene que existir una versión online accesible desde cualquier celular.

## Opciones
1. **PythonAnywhere** (backend + MySQL) + **Vercel o Netlify** (frontend): simple y con plan gratuito.
2. Render / Railway: más moderno, pero la base de datos MySQL es paga o limitada.
3. VPS propio: máximo control, más mantenimiento.

## Decisión
PythonAnywhere para Flask y MySQL; Vercel o Netlify para el frontend. Desarrollo y demo local con XAMPP.

## Consecuencias
La URL del backend se configura en `VITE_API_URL`. Hay que permitir CORS para el dominio del frontend.
Los archivos subidos (evidencias) viven en el disco de PythonAnywhere.
