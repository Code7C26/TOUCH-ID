// Menú a la izquierda, solo en pantallas medianas o grandes (PC / tablet).
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { menuDe } from '../utils/menu.js'
import Icono from './Icono.jsx'

export default function MenuLateral() {
  const { usuario } = useAuth()

  return (
    <nav className="sticky top-20 hidden w-52 shrink-0 self-start md:block" aria-label="Menú principal">
      <ul className="space-y-1">
        {menuDe(usuario).map((item) => (
          <li key={item.ruta}>
            <NavLink
              to={item.ruta}
              end={item.fin}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-marca text-tinta'
                    : 'text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800'
                }`
              }
            >
              <Icono nombre={item.icono} />
              {item.texto}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
