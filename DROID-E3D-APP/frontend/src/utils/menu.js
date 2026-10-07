// Opciones del menú según el rol. Lo usan BarraLateral (PC) y BottomNav (celular).
//  - grupo: título de la sección en la barra lateral
//  - fin: true hace que /app no quede marcado como activo cuando estás en /app/perfil
export const MENU = {
  empleado: [
    { ruta: '/app', texto: 'Inicio', icono: 'inicio', fin: true, grupo: 'Mi trabajo' },
    { ruta: '/app/mis-alertas', texto: 'Mis alertas', icono: 'alerta', grupo: 'Mi trabajo' },
    { ruta: '/app/perfil', texto: 'Perfil', icono: 'perfil', grupo: 'Mi trabajo' },
  ],
  encargado: [
    { ruta: '/app/panel', texto: 'Panel', icono: 'panel', grupo: 'Operación' },
    { ruta: '/app/incidencias', texto: 'Incidencias', icono: 'alerta', grupo: 'Operación' },
    { ruta: '/app/robot', texto: 'Robot', icono: 'robot', grupo: 'Operación' },
    { ruta: '/app/zonas', texto: 'Zonas', icono: 'zonas', grupo: 'Gestión' },
    { ruta: '/app/empleados', texto: 'Empleados', icono: 'empleados', grupo: 'Gestión' },
    { ruta: '/app/reportes', texto: 'Reportes', icono: 'reportes', grupo: 'Análisis' },
    { ruta: '/app/auditoria', texto: 'Auditoría', icono: 'auditoria', grupo: 'Análisis' },
  ],
}

export function menuDe(usuario) {
  return MENU[usuario?.rol] || []
}

// Agrupa las opciones por sección, respetando el orden: [['Operación', [...]], ['Gestión', [...]]]
export function menuAgrupado(usuario) {
  const grupos = []
  menuDe(usuario).forEach((item) => {
    const grupo = grupos.find(([nombre]) => nombre === item.grupo)
    if (grupo) grupo[1].push(item)
    else grupos.push([item.grupo, [item]])
  })
  return grupos
}
