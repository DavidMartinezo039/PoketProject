import './UsuariosPage.css'
import { useState, useEffect } from 'react'
import { getUsuarios, type Usuario } from '../api/usuarios'
// Ahora SÍ es una página: tiene su propia ruta /usuarios y se inyecta en el
// <Outlet/> del layout. Placeholder hasta que el backend devuelva la lista
// (entonces haremos el fetch a través de api/).
function UsuariosPage() {

  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
      getUsuarios().then(setUsuarios).finally(() => setCargando(false))
  }, [])
  if (cargando) return <p>Cargando…</p>

  return (
    <div className="usuarios">
      {usuarios.length === 0 ? (
        <p>No hay nada todavía.</p>
      ) : (
        <ul>
          {usuarios.map((u) => <li key={u.username}>{u.username}</li>)}
        </ul>
      )}
    </div>
  )
}

export default UsuariosPage
