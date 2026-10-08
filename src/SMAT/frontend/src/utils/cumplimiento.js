// Mide qué tan bien cumple un empleado con su EPP, a partir de sus alertas.
// Definición (simple, para poder explicarla): un día "cumple" si ese día no tuvo ninguna alerta.
//   cumplimiento = días sin alertas / días del período
//   racha        = días seguidos sin alertas hasta hoy
import { fechaISO } from './formato.js'

// incidencias: lista de alertas del empleado (cada una con .timestamp)
// dias: tamaño del período (por defecto los últimos 30 días, contando hoy)
export function calcularCumplimiento(incidencias, dias = 30) {
  const diasConAlerta = new Set(incidencias.map((i) => fechaISO(new Date(i.timestamp))))

  let diasSinAlerta = 0
  let racha = 0
  let rachaCortada = false
  for (let atras = 0; atras < dias; atras += 1) {
    const dia = new Date()
    dia.setDate(dia.getDate() - atras)
    if (diasConAlerta.has(fechaISO(dia))) {
      rachaCortada = true // el primer día con alerta corta la racha
    } else {
      diasSinAlerta += 1
      if (!rachaCortada) racha += 1
    }
  }
  return { porcentaje: Math.round((diasSinAlerta * 100) / dias), racha, dias }
}
