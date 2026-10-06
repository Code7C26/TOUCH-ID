// Cliente de la API: TODAS las llamadas al backend de Flask pasan por este archivo.
// (Regla del proyecto: ningún componente usa fetch directamente.)

// URL del backend. En el celular hay que poner la IP de la PC en frontend/.env (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Devuelve el token de la sesión guardada al hacer login, o undefined si no hay sesión.
function getToken() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return user?.token
}

// Convierte { zona: 'Zona A', estado: 'activa' } en '?zona=Zona%20A&estado=activa'.
// Ignora los valores vacíos para no mandar filtros que no se usan.
function armarConsulta(filtros = {}) {
  const params = new URLSearchParams()
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') params.append(clave, valor)
  })
  const texto = params.toString()
  return texto ? `?${texto}` : ''
}

// Hace la llamada al backend y devuelve el JSON.
// Si algo sale mal lanza un Error con un mensaje en español, listo para mostrar en pantalla.
async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}` // sin sesión (login) no se manda

  let res
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    // fetch falla cuando no hay conexión o el backend está apagado
    throw new Error('No se pudo conectar con el servidor')
  }

  // Si la respuesta no es JSON (por ejemplo una página de error), seguimos con un objeto vacío
  const data = await res.json().catch(() => ({}))

  // 401 con sesión = el token venció o es inválido: se cierra la sesión y AuthContext lo detecta
  if (res.status === 401 && token) {
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('sesion-vencida'))
  }

  if (!res.ok) throw new Error(data.error || `Error ${res.status} en el servidor`)
  return data
}

// ---------- Sesión ----------

export const loginUser = (usuario, contrasena) =>
  request('/login', { method: 'POST', body: JSON.stringify({ usuario, contrasena }) })

// ---------- Incidencias ----------

// Lista alertas. Por ahora solo se filtra por nombre de zona; el backend ya acepta
// más filtros (zona_id, estado, tipo, desde, hasta, page) que se usarán en la Fase 4.
export const getIncidents = (zona) => request(`/incidents${armarConsulta({ zona })}`)

export const resolveIncident = (id) => request(`/incidents/${id}/resolver`, { method: 'PUT' })

// ---------- Estadísticas (solo encargado) ----------

export const getStats = () => request('/stats')
