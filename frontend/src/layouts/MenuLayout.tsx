import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import './MenuLayout.css'

// Las secciones del menú: ahora cada una apunta a una RUTA (to), no a un id.
const SECCIONES = [
  { to: '/inicio', label: 'Inicio', icon: '🏠' },
  { to: '/usuarios', label: 'Usuarios', icon: '🪪' },
]

// NO es una página: es el LAYOUT (el marco fijo). Pinta la sidebar + la cabecera
// y deja un hueco <Outlet/> donde React Router inyecta la página de la URL actual.
// No tiene ruta propia: por eso "/menu" ya no existe.
function MenuLayout() {
  const navigate = useNavigate()

  // useLocation nos da la URL actual. El título de la cabecera sale de ella,
  // no de un useState: la "sección activa" la manda ahora la ruta.
  const { pathname } = useLocation()
  const seccionActual = SECCIONES.find((s) => s.to === pathname)

  function cerrarSesion() {
    localStorage.removeItem('token') // borramos el token...
    navigate('/') // ...y volvemos al login
  }

  return (
    <div className="menu-page">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <span className="sidebar__logo">🐉</span>
          <span>Mi Campaña</span>
        </div>

        <nav className="sidebar__nav">
          {/* NavLink cambia la URL al pulsarlo y nos da "isActive" para marcar
              el botón de la ruta en la que estamos. Sustituye al viejo onClick. */}
          {SECCIONES.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
            >
              <span className="nav-item__icon">{s.icon}</span>
              {s.label}
            </NavLink>
          ))}
        </nav>

        <button className="sidebar__logout" onClick={cerrarSesion}>
          ⎋ Cerrar sesión
        </button>
      </aside>

      <main className="content">
        <header className="content__header">
          <h1>{seccionActual?.label}</h1>
          <div className="avatar">🐲</div>
        </header>

        <section className="content__body">
          {/* Aquí entra la página hija según la URL (InicioPage, UsuariosPage...) */}
          <Outlet />
        </section>
      </main>
    </div>
  )
}

export default MenuLayout
