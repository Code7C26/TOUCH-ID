// Marco de todas las páginas con sesión: barra arriba, menú al costado (PC) o abajo (celular).
// <Outlet /> es donde React Router dibuja la página actual.
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'
import MenuLateral from './MenuLateral.jsx'
import NavBar from './NavBar.jsx'

export default function Layout() {
  return (
    <div className="min-h-dvh">
      <NavBar />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 pt-5 pb-24 md:pb-10">
        <MenuLateral />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
