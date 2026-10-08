# 002 · HTTP (el ESP32 pregunta) en vez de MQTT

**Fecha:** 2026-10-05 · **Estado:** aceptada

## Contexto
El robot y el ESP32 de la máquina necesitan recibir órdenes (iniciar, pausar, parar) del backend.

## Opciones
1. **HTTP con consulta periódica**: el ESP32 hace un GET cada 1-2 s.
2. MQTT con broker (Mosquitto): más rápido, pero suma un servidor extra.

## Decisión
HTTP. No necesita un broker, funciona igual en red local y en PythonAnywhere, y es fácil de probar con el navegador.

## Consecuencias
Hay hasta 2 s de demora en recibir una orden. La parada de emergencia se complementa con un botón físico en el robot.
Los endpoints del hardware llevan clave `X-API-KEY`.
