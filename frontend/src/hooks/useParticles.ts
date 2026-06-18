import { useEffect, useRef } from 'react'

// "type" describe la forma de cada partícula del fondo. Es solo de TypeScript:
// no genera código, sirve para que el editor te avise si te equivocas.
type Particle = { x: number; y: number; vx: number; vy: number; r: number }

// Custom hook: una función que empieza por "use" y encapsula lógica que usa
// otros hooks (aquí useRef + useEffect). Sirve para sacar de la página el ruido
// de la animación y poder reutilizarla. Devuelve el ref que la página tiene que
// enganchar a su <canvas>; el hook se ocupa de dibujar y de limpiar al salir.
export function useParticles() {
  // useRef nos da una "caja" para guardar el <canvas> del DOM y manipularlo
  // a mano (dibujar). El <HTMLCanvasElement> es el tipo del elemento.
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

  return canvasRef
}
