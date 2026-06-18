const API_URL = 'http://localhost:8013/api/usuarios/'
export type Usuario = {username: string}

export async function getUsuarios(): Promise<Usuario[]> {
    const res = await fetch(API_URL)
    if(!res.ok) throw new Error('No se pudieron cargar los usuarios')
    return res.json()
}