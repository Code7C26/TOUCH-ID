# 001 · Flask + MySQL para el backend

**Fecha:** 2026-10-05 · **Estado:** aceptada

## Contexto
Hace falta un servidor que reciba alertas de la IA, las guarde y las muestre en la web.
El equipo conoce Python y ya trabaja con MySQL.

## Opciones
1. **Flask + MySQL** (SQLAlchemy). Simple, mucho material, corre en PythonAnywhere.
2. Node/Express + MongoDB. Un solo lenguaje con el frontend, pero el equipo no lo domina.
3. Firebase. Rápido, pero depende de un tercero y es difícil de explicar al jurado.

## Decisión
Flask + MySQL. YOLO también es Python, lo que facilita la integración.

## Consecuencias
Hay que usar SQL compatible con MariaDB (XAMPP en desarrollo) y MySQL (PythonAnywhere en producción).
