// Inicio del empleado: si tiene alertas activas y sus últimas alertas.
// (En la Fase 3 se suma el EPP obligatorio de su zona y el % de cumplimiento.)
import { getIncidents } from '../../api/client.js'
import AlertCard from '../../components/AlertCard.jsx'
import Icono from '../../components/Icono.jsx'
import Titulo from '../../components/Titulo.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import usePolling from '../../hooks/usePolling.js'

export default function Inicio() {
  const { usuario } = useAuth()
  const { datos, error, cargando } = usePolling(() => getIncidents(), 5000) // el backend devuelve solo las suyas

  const incidencias = datos?.incidencias || []
  const activas = incidencias.filter((i) => i.estado === 'activa')

  return (
    <>
      <Titulo titulo={`Hola, ${usuario.nombre.split(' ')[0]}`} subtitulo={`Tu zona: ${usuario.zona || 'sin asignar'}`} />

      {!cargando && (activas.length > 0 ? (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-alerta p-4 text-white shadow">
          <Icono nombre="alerta" className="size-7 shrink-0" />
          <p className="font-semibold">
            Tenés {activas.length} alerta{activas.length > 1 ? 's' : ''} activa{activas.length > 1 ? 's' : ''}. Revisá tu equipo de protección.
          </p>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-ok p-4 text-white shadow">
          <Icono nombre="ok" className="size-7 shrink-0" />
          <p className="font-semibold">Todo en orden: no tenés alertas activas.</p>
        </div>
      ))}

      {error && <p role="alert" className="mb-4 rounded-lg bg-alerta/10 px-3 py-2 text-sm text-alerta">{error}</p>}

      <h2 className="mb-3 text-lg font-semibold">Tus últimas alertas</h2>
      {cargando && <p className="text-sm text-zinc-500">Cargando…</p>}
      {!cargando && incidencias.length === 0 && <p className="text-sm text-zinc-500">No tenés alertas registradas. ¡Bien!</p>}
      <div className="space-y-2">
        {incidencias.slice(0, 5).map((inc) => <AlertCard key={inc.id} incidencia={inc} />)}
      </div>
    </>
  )
}
