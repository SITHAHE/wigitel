import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Scramble from './Scramble'
import Magnetic from './Magnetic'

const socials = [
  { label: 'Telegram', href: 'https://t.me/wigitel' },
  { label: 'Instagram', href: 'https://instagram.com/wigitel' },
  { label: 'ВКонтакте', href: 'https://vk.com/wigitel' },
]

// Финальный контакт — тёмный драматичный экран (контраст к светлому сайту):
// световое пятно следует за курсором, гигантский призыв с пословным reveal,
// магнитная кнопка Telegram, крупные соцссылки и живое время студии.
export default function CTA() {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section
      id="contact"
      ref={ref}
      onMouseMove={onMove}
      className="relative overflow-hidden bg-[#081b3f] py-[clamp(120px,22vh,280px)] text-white"
    >
      {/* световое пятно за курсором */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity"
        style={{ background: 'radial-gradient(600px circle at var(--mx,50%) var(--my,40%), rgba(47,128,237,0.35), transparent 60%)' }}
      />
      {/* дрейфующие блики */}
      <div className="pointer-events-none absolute inset-0">
        <div className="blob" style={{ width: '38vw', height: '38vw', left: '-8vw', top: '4vw', background: 'radial-gradient(circle, rgba(47,128,237,0.5), transparent 70%)', animation: 'drift1 22s ease-in-out infinite' }} />
        <div className="blob" style={{ width: '32vw', height: '32vw', right: '-6vw', bottom: '2vw', background: 'radial-gradient(circle, rgba(122,224,255,0.35), transparent 68%)', animation: 'drift2 26s ease-in-out infinite' }} />
      </div>

      <div className="wrap-wide relative">
        <p className="section-label mb-10 !text-[#7db4ff]"><Scramble text="08 — Контакт" /></p>

        {/* Гигантский призыв */}
        <h2 className="font-display max-w-[16ch] text-[clamp(2.4rem,8vw,7.5rem)] font-medium leading-[1.02]">
          {['Расскажите', 'о', 'вашем'].map((w, i) => (
            <Word key={w} delay={i * 0.08}>{w}{' '}</Word>
          ))}
          <Word delay={0.24} className="text-outline-accent">проекте</Word>
        </h2>

        {/* Кнопка + соцсети */}
        <div className="mt-16 flex flex-col gap-16 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          >
            <Magnetic strength={0.45}>
              <a
                href="https://t.me/wigitel"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-4 rounded-full bg-white py-5 pl-8 pr-6 text-[18px] font-medium text-ink-deep shadow-[0_20px_60px_-15px_rgba(47,128,237,0.6)] transition-all duration-500 hover:bg-accent hover:text-white"
              >
                <TgIcon /> Написать в Telegram
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-deep text-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:rotate-45 group-hover:bg-white group-hover:text-accent">↗</span>
              </a>
            </Magnetic>
            <div className="mt-6 flex flex-col gap-1.5">
              <a href="tel:+79952355609" className="text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-tight text-white transition-colors hover:text-[#7db4ff]">
                +7 995 235-56-09
              </a>
              <p className="text-[14px] text-white/50">
                Отвечаем в течение дня ·{' '}
                <a href="mailto:hello@wigitel.ru" className="text-white/80 underline-offset-4 hover:text-white hover:underline">hello@wigitel.ru</a>
              </p>
            </div>
          </motion.div>

          {/* Соцсети — крупные магнитные ссылки */}
          <div className="flex flex-col items-start gap-1 lg:items-end">
            {socials.map((s) => (
              <Magnetic key={s.label} strength={0.3}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 py-1.5 text-[clamp(1.5rem,3vw,2.4rem)] font-medium tracking-tight text-white/70 transition-colors duration-300 hover:text-white"
                >
                  {s.label}
                  <span className="text-[0.6em] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-1 group-hover:opacity-100">↗</span>
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        {/* Нижняя линия: город + живое время */}
        <div className="mt-20 flex flex-col gap-3 border-t border-white/10 pt-8 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>Санкт-Петербург · работаем по всей России</p>
          <Clock />
        </div>
      </div>
    </section>
  )
}

function Word({ children, delay = 0, className = '' }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: '110%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, delay, ease: [0.19, 1, 0.22, 1] }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function Clock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const t = new Intl.DateTimeFormat('ru-RU', {
        timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit', second: '2-digit',
      }).format(new Date())
      setTime(t)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <p className="tabular-nums">Местное время — {time} МСК</p>
}

function TgIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  )
}
