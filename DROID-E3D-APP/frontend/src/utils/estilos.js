// Clases de Tailwind que se repiten en formularios y botones, para que todo se vea igual.
export const campo = 'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-marca focus:ring-2 focus:ring-marca/40 dark:border-zinc-700 dark:bg-zinc-950'

const boton = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50'
export const botonPrimario = `${boton} bg-marca text-tinta hover:bg-marca-oscuro`
export const botonSecundario = `${boton} border border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800`
export const botonPeligro = `${boton} border border-alerta/40 text-alerta hover:bg-alerta/5`

export const tarjeta = 'rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
export const mensajeError = 'rounded-lg bg-alerta/10 px-3 py-2 text-sm text-alerta'
