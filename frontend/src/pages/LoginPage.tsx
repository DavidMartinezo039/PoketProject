import { useEffect, useRef, useState, type MouseEvent, type SubmitEvent } from 'react'
import './LoginPage.css'

// Heurística simple de fuerza de contraseña: devuelve un nivel 0..4.
// (En un login real esto pinta poco; tiene más sentido en el registro,
//  pero lo dejo porque venía del sandbox y queda chulo.)
function scorePassword(value: string): number {
  let score = 0
  if (value.length >= 8) score++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++
  if (/\d/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++
  return score
}

// "type" describe la forma de cada partícula del fondo. Es solo de TypeScript:
// no genera código, sirve para que el editor te avise si te equivocas.
type Particle = { x: number; y: number; vx: number; vy: number; r: number }

function LoginPage() {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // useRef nos da una "caja" para guardar el <canvas> del DOM y manipularlo
  // a mano (dibujar). El <HTMLCanvasElement> es el tipo del elemento.
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ---- Fondo de partículas (canvas) ----
  // useEffect corre DESPUÉS de pintar. Arranca el bucle de animación al montar
  // y la función que devuelve (cleanup) lo apaga al desmontar. Sin ese cleanup,
  // en desarrollo (StrictMode monta/desmonta/monta) tendrías 2 bucles a la vez.
  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const context = canvasEl.getContext('2d')
    if (!context) return

    // TypeScript "olvida" que ya no son null dentro de las funciones de abajo,
    // así que los fijamos con tipo no-nulo en variables que sí lo mantienen.
    const canvas: HTMLCanvasElement = canvasEl
    const ctx: CanvasRenderingContext2D = context

    let raf = 0
    let W = 0
    let H = 0
    let particles: Particle[] = []

    // Lee el color de la variable CSS --particle del tema actual.
    function particleColor() {
      return getComputedStyle(canvas).getPropertyValue('--particle').trim() || '67,97,238'
    }

    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      const count = Math.min(90, Math.floor((W * H) / 16000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 0.6,
      }))
    }

    function tick() {
      const color = particleColor()
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, 0.6)`
        ctx.fill()

        // une con una línea las partículas cercanas
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dist = Math.hypot(p.x - q.x, p.y - q.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${color}, ${0.14 * (1 - dist / 120)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('resize', resize)
    resize()
    tick()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

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

  // ---- Envío real al backend de Django (esto ya lo tenías tú) ----
  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8013/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.non_field_errors?.[0] ?? 'Error al iniciar sesión')
        return
      }
      localStorage.setItem('token', data.token)
    } catch {
      setError('No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  // Se recalcula en cada render a partir del estado: no necesita su propio useState.
  const level = password ? scorePassword(password) : 0

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

          {/* Campo contraseña con mostrar/ocultar y medidor de fuerza */}
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
            <div className="strength" data-level={level} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
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

          <div className="socials">
            <button className="social" type="button" title="Google">G</button>
            <button className="social" type="button" title="GitHub">GH</button>
            <button className="social" type="button" title="Apple">🍎</button>
          </div>

          <p className="card__foot">
            ¿No tienes cuenta? <a className="link" href="#">Regístrate</a>
          </p>
        </form>
      </main>
    </div>
  )
}

export default LoginPage
