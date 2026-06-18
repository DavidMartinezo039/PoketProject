import { BrowserRouter, Navigate, Routes, Route } from 'react-router'
import { type ReactNode } from 'react'
import LoginPage from './pages/LoginPage.tsx'
import MenuLayout from './layouts/MenuLayout.tsx'
import InicioPage from './pages/InicioPage.tsx'
import UsuariosPage from './pages/UsuariosPage.tsx'

// Ruta protegida: envuelve a un componente y solo lo deja pasar si hay token.
// Si no lo hay, <Navigate> redirige al login. "replace" evita que la ruta
// quede en el historial (así el botón Atrás no te devuelve a una ruta vetada).
function RutaProtegida({ children }: { children: ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    // BrowserRouter activa el enrutado según la URL del navegador.
    <BrowserRouter>
      <Routes>
        {/* "/" es público: la pantalla de login. */}
        <Route path="/" element={<LoginPage />} />

        {/* Ruta de LAYOUT, sin path propio: no es una URL, solo el marco.
            Protege de una vez a todas sus hijas y pinta el menú alrededor.
            Cada hija se inyecta en el <Outlet/> del MenuLayout. */}
        <Route
          element={
            <RutaProtegida>
              <MenuLayout />
            </RutaProtegida>
          }
        >
          <Route path="/inicio" element={<InicioPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
