// Opciones del menú según el rol. Lo usan MenuLateral (PC) y BottomNav (celular).
// "fin: true" hace que /app no quede marcado como activo cuando estás en /app/perfil.
export const MENU = {
  empleado: [
    { ruta: '/app', texto: 'Inicio', icono: 'inicio', fin: true },
    { ruta: '/app/mis-alertas', texto: 'Mis alertas', icono: 'alerta' },
    { ruta: '/app/perfil', texto: 'Perfil', icono: 'perfil' },
  ],
  encargado: [
    { ruta: '/app/panel', texto: 'Panel', icono: 'panel' },
    { ruta: '/app/incidencias', texto: 'Incidencias', icono: 'alerta' },
    { ruta: '/app/robot', texto: 'Robot', icono: 'robot' },
    { ruta: '/app/zonas', texto: 'Zonas', icono: 'zonas' },
    { ruta: '/app/empleados', texto: 'Empleados', icono: 'empleados' },
    { ruta: '/app/reportes', texto: 'Reportes', icono: 'reportes' },
    { ruta: '/app/auditoria', texto: 'Auditoría', icono: 'auditoria' },
  ],
}

export function menuDe(usuario) {
  return MENU[usuario?.rol] || []
}
