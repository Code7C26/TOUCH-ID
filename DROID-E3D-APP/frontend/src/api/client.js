const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return user?.token
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en el servidor')
  return data
}

export const loginUser = (usuario, contrasena) =>
  request('/login', { method: 'POST', body: JSON.stringify({ usuario, contrasena }) })

export const getIncidents = (zona) =>
  request(`/incidents${zona ? `?zona=${encodeURIComponent(zona)}` : ''}`)

export const getStats = () => request('/stats')

export const resolveIncident = (id) =>
  request(`/incidents/${id}/resolver`, { method: 'PUT' })
