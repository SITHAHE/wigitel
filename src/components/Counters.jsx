import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { counters } from '../data'

// Гигантские цифры студии — раскручиваются от 0 при появлении.
export default function Counters() {
  return (
    <section className="relative border-y border-hairline bg-canvas">
      <div className="wrap-wide grid grid-cols-2 divide-hairline lg:grid-cols-4 lg:divide-x">
        {counters.map((c, i) => (
          <Counter key={c.label} c={c} delay={i * 0.12} />
        ))}
      </div>
    </section>
  )
}

function Counter({ c, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const dur = 1600
    let start
    let raf
    const tick = (now) => {
      if (!start) start = now + delay * 1000
      const t = Math.min(1, Math.max(0, (now - start) / dur))
      // ease-out expo — цифры «долетают» медленно и дорого
      const e = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setN(Math.round(c.value * e))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, c.value, delay])

  return (
    <div ref={ref} className="flex flex-col items-start gap-3 px-8 py-14 md:py-20">
      <span className="font-display text-[clamp(2.6rem,5.4vw,4.6rem)] font-semibold leading-none text-ink tabular-nums">
        {n}<span className="text-accent">{c.suffix}</span>
      </span>
      <span className="text-[14.5px] leading-snug text-ink-soft">{c.label}</span>
    </div>
  )
}
