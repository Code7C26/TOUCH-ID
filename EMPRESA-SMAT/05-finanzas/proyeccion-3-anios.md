# Proyección a 3 años (2027 · 2028 · 2029)

> **Estado:** completo (v1) · **Responsable:** Toro · **Revisión:** Morena · **Actualizado:** 06/10/2026

**Para qué sirve:** estimación de ventas, gastos y resultado. Es una estimación: los supuestos están escritos para poder defenderla.

## Supuestos

| Supuesto | Valor | De dónde sale |
|---|---|---|
| Clientes nuevos por año | 3 (2027) · 7 (2028) · 15 (2029) | Llegar a 25 fábricas en 2029 (visión) |
| Plan | Todos en Plan Compra | `precios.md` |
| Pago único | USD 2.200 (el primer cliente, piloto: USD 1.100) | `precios.md` |
| Abono | USD 70 por mes | `precios.md` |
| Un cliente nuevo paga abono la mitad de su primer año | Promedio de altas a lo largo del año | — |
| Costo por instalación | USD 1.343 | `costos-droid-e3d.md` |
| Costo mensual por cliente | USD 39 | `costos-droid-e3d.md` |
| Trabajo de los socios | Incluido en los costos a USD 8 por hora | `costos-droid-e3d.md` |
| Todos los valores | USD, sin inflación ni impuestos | Simplificación |

## Ingresos

| | 2027 | 2028 | 2029 |
|---|---|---|---|
| Clientes nuevos | 3 | 7 | 15 |
| Clientes totales | 3 | 10 | 25 |
| Pagos únicos | 5.500 | 15.400 | 33.000 |
| Abonos | 1.260 | 5.460 | 14.700 |
| **Total ingresos** | **6.760** | **20.860** | **47.700** |

Cálculo de abonos: 2027 = 3 × 70 × 6 · 2028 = 3 × 70 × 12 + 7 × 70 × 6 · 2029 = 10 × 70 × 12 + 15 × 70 × 6.

## Gastos

| | 2027 | 2028 | 2029 |
|---|---|---|---|
| Instalaciones (clientes nuevos × 1.343) | 4.029 | 9.401 | 20.145 |
| Servicio mensual (meses-cliente × 39) | 702 | 3.042 | 8.190 |
| Fijos (dominio, herramientas, cuentas) | 150 | 200 | 300 |
| Marketing (demos, traslados, ferias) | 300 | 1.000 | 2.000 |
| Contador | — | — | 1.200 |
| **Total gastos** | **5.181** | **13.643** | **31.835** |

Meses-cliente: 2027 = 18 · 2028 = 36 + 42 = 78 · 2029 = 120 + 90 = 210.

## Resultado

| | 2027 | 2028 | 2029 |
|---|---|---|---|
| Ingresos | 6.760 | 20.860 | 47.700 |
| Gastos | 5.181 | 13.643 | 31.835 |
| **Resultado** | **1.579** | **7.217** | **15.865** |
| Fondo de reserva (20 %) | 316 | 1.443 | 3.173 |

## Punto de equilibrio

- La **inversión inicial** (USD 740, `inversion-inicial.md`) se recupera en **2027** con los 3 primeros clientes.
- Cada instalación a precio completo deja **USD 857** y cada cliente aporta **USD 31 por mes**. El cliente piloto, en cambio, deja una pérdida de USD 243 en la instalación (paga 1.100 y cuesta 1.343).
- Con los costos fijos de 2027 (USD 450): **1 cliente a precio completo** ya cubre el año (857 + 6 × 31 = 1.043). Si el primero es el piloto, hacen falta **2 clientes** en total. El riesgo real es **no conseguir clientes**, no el margen.

## Qué podría salir mal

| Riesgo | Efecto | Qué hacemos |
|---|---|---|
| Se consiguen la mitad de los clientes | El resultado de 2028 baja a la mitad aproximadamente | Ofrecer el precio piloto a más fábricas; vender junto con Touch ID |
| Suben los componentes (dólar) | Baja el margen por instalación | Precios en USD; revisar cada 6 meses |
| Más visitas de soporte de las previstas | Sube el costo mensual | Mejorar la documentación y el soporte remoto |
