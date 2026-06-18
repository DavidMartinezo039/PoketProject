import { useState, type MouseEvent, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router'
import { useParticles } from '../hooks/useParticles'
import { login } from '../api/auth'
import './LoginPage.css'

function LoginPage() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // useNavigate: función para cambiar de ruta desde el código (sin recargar)
  const navigate = useNavigate()

  // El custom hook se encarga de toda la animación del fondo y nos devuelve el
  // ref que enganchamos al <canvas> de abajo. La página queda limpia de ese ruido.
  const canvasRef = useParticles()

  // ---- Tilt 3D + spotlight siguiendo el cursor ----
  // e.currentTarget ES el <form> sobre el que está el ratón. Lo inclinamos
  // según dónde esté el cursor y movemos el brillo con variables CSS.
  function handleTilt(e: MouseEvent<HTMLFormElement>) {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    card.style.transform = `rotateX(${(0.5 - py) * 18}deg) rotateY(${(px - 0.5) * 18}deg)`
    card.style.setProperty('--mx', `${px * 100}%`)
    card.style.setProperty('--my', `${py * 100}%`)
  }

  function resetTilt(e: MouseEvent<HTMLFormElement>) {
    e.currentTarget.style.transform = 'rotateX(0) rotateY(0)'
  }

  // ---- Onda (ripple) al pulsar el botón ----
  // Creamos un <span> temporal que se anima y se borra solo al terminar.
  function handleRipple(e: MouseEvent<HTMLButtonElement>) {
    const btn = e.currentTarget
    const r = btn.getBoundingClientRect()
    const size = Math.max(r.width, r.height)
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${e.clientX - r.left - size / 2}px`
    ripple.style.top = `${e.clientY - r.top - size / 2}px`
    btn.appendChild(ripple)
    ripple.addEventListener('animationend', () => ripple.remove())
  }

  // ---- Envío al backend ----
  // Toda la fontanería del fetch vive ahora en api/auth.ts. Aquí solo pedimos
  // el login y reaccionamos: si va bien guardamos el token y navegamos; si la
  // función lanza un Error, mostramos su .message.
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await login(user, password)
      localStorage.setItem('token', token)
      navigate('/inicio') // credenciales OK → a la página de inicio del menú
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <canvas ref={canvasRef} className="login-bg" aria-hidden="true" />

      <main className="stage">
        <form
          className="card"
          onSubmit={handleSubmit}
          onMouseMove={handleTilt}
          onMouseLeave={resetTilt}
        >
          <div className="card__spotlight" aria-hidden="true" />

          <div className="card__head">
            <div className="card__logo">🐉</div>
            <h1 className="card__title">Bienvenido de nuevo</h1>
            <p className="card__subtitle">Inicia sesión para continuar</p>
          </div>

          {/* Campo usuario (tu backend espera "username", no email) */}
          <div className={`field ${error ? 'has-error' : ''}`}>
            <input
              className="field__input"
              id="user"
              type="text"
              placeholder=" "
              autoComplete="username"
              value={user}
              onChange={(e) => {
                setUser(e.target.value)
                setError('')
              }}
              autoFocus
            />
            <label className="field__label" htmlFor="user">Usuario</label>
          </div>

          {/* Campo contraseña con mostrar/ocultar */}
          <div className={`field ${error ? 'has-error' : ''}`}>
            <input
              className="field__input"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
            />
            <label className="field__label" htmlFor="password">Contraseña</label>
            <button
              className="field__toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Mostrar u ocultar contraseña"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          <div className="row">
            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="check__box" />
              <span>Recuérdame</span>
            </label>
            <a className="link" href="#">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Mensaje de error real del backend */}
          {error && <p className="error">{error}</p>}

          <button
            className={`btn ${loading ? 'is-loading' : ''}`}
            type="submit"
            onClick={handleRipple}
            disabled={loading}
          >
            <span className="btn__text">Entrar</span>
            <span className="btn__spinner" aria-hidden="true" />
          </button>

          <div className="divider"><span>o continúa con</span></div>

          <p className="card__foot">
            ¿No tienes cuenta? <a className="link" href="#">Regístrate</a>
          </p>
        </form>
      </main>
    </div>
  )
}

export default LoginPage
