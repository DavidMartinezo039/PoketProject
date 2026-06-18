// Capa de API: TODO lo que habla con el backend vive aquí, no en las páginas.
// Así la página solo se preocupa de "qué pinto", y este archivo de "cómo pido
// los datos". Si mañana cambia la URL o añades cabeceras, lo tocas en un sitio.

const API_URL = 'http://localhost:8013/api'

// La forma de la respuesta del backend al hacer login. Solo TypeScript.
type LoginResponse = { token: string }

// Pide el login al backend. Devuelve el token si va bien, y LANZA un Error con
// un mensaje legible si algo falla (credenciales mal, servidor caído...).
// La página captura ese Error y enseña su .message; no necesita saber de fetch.
export async function login(username: string, password: string): Promise<string> {
  let response: Response
  try {
    response = await fetch(`${API_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
  } catch {
    // fetch solo lanza si no llega a conectar (red caída, CORS, servidor off).
    throw new Error('No se pudo conectar con el servidor')
  }

  const data = (await response.json()) as LoginResponse & {
    non_field_errors?: string[]
  }

  if (!response.ok) {
    // El backend respondió, pero con error (p. ej. 400 credenciales inválidas).
    throw new Error(data.non_field_errors?.[0] ?? 'Error al iniciar sesión')
  }

  return data.token
}
