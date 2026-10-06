// Página provisoria para las secciones que todavía no están hechas.
import Icono from './Icono.jsx'
import Titulo from './Titulo.jsx'

export default function EnConstruccion({ titulo, icono, fase, descripcion }) {
  return (
    <>
      <Titulo titulo={titulo} />
      <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-marca/15 text-marca-oscuro dark:text-marca">
          <Icono nombre={icono} className="size-7" />
        </span>
        <p className="mt-4 font-semibold">En construcción · {fase}</p>
        <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500 dark:text-zinc-400">{descripcion}</p>
      </div>
    </>
  )
}
