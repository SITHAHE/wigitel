import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import Scramble from './Scramble'
import CaseOverlay from './CaseOverlay'
import { projects } from '../data'

// Портфолио — горизонтальная лента на вертикальном скролле (pin-секция).
// Дистанция прокрутки считается в пикселях от реальной ширины ленты,
// поэтому лента всегда доезжает ровно до последней карточки.
export default function Work() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [dist, setDist] = useState(0)
  const [selected, setSelected] = useState(null)

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return
      const total = trackRef.current.scrollWidth
      const view = window.innerWidth
      setDist(Math.max(0, total - view + view * 0.06)) // небольшой хвост справа
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef })
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -dist])
  // Пружина сглаживает x на частоте дисплея: тач-скролл iOS шлёт события
  // реже 120 Гц, из-за чего прямая привязка к скроллу дёргалась. Мягкая,
  // но отзывчивая — почти без задержки, но убирает микрорывки.
  const x = useSpring(xRaw, { stiffness: 260, damping: 40, mass: 0.35 })

  return (
    <section id="work" className="relative bg-canvas">
      <div ref={sectionRef} className="relative h-[420vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="wrap-wide mb-10 flex items-end justify-between">
            <div>
              <p className="section-label mb-6"><Scramble text="02 — Работы" /></p>
              <h2 className="font-display text-[clamp(1.8rem,4.4vw,3.6rem)] font-medium leading-tight text-ink">
                Избранные <span className="text-outline-accent">проекты</span>
              </h2>
            </div>
            <p className="hidden max-w-[240px] text-right text-[14px] leading-relaxed text-muted md:block">
              Листайте вниз — лента едет вбок. Клик по кейсу откроет детали
            </p>
          </div>

          <motion.div ref={trackRef} style={{ x }} className="flex gap-[3.5vw] pl-[4vw] pr-[6vw] will-change-transform">
            {projects.map((p, i) => (
              <Card key={p.id} p={p} i={i} onOpen={() => setSelected(p)} />
            ))}
            {/* Финальная карточка-приглашение */}
            <a
              href="#contact"
              className="group relative flex w-[70vw] max-w-[680px] shrink-0 flex-col items-center justify-center rounded-[32px] bg-gradient-to-br from-accent to-[#5aa0f2] p-10 text-center text-white sm:w-[42vw] lg:w-[38vw]"
            >
              <span className="font-display text-[clamp(1.4rem,2.6vw,2.2rem)] font-medium leading-snug">
                Здесь будет<br />ваш проект
              </span>
              <span className="mt-6 grid h-14 w-14 place-items-center rounded-full border border-white/50 text-xl transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:rotate-45">
                ↗
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selected && <CaseOverlay project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  )
}

function Card({ p, i, onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="group relative w-[84vw] max-w-[900px] shrink-0 cursor-pointer text-left sm:w-[60vw] lg:w-[56vw]">
      <div className="relative overflow-hidden rounded-[32px] bg-frost shadow-[0_30px_80px_-40px_rgba(13,43,94,0.35)]">
        <div className="aspect-[16/10]">
          <img
            src={p.img}
            alt={`Проект ${p.title}`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition-transform duration-[1.6s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
          />
        </div>
        {/* Гигантский номер поверх */}
        <span className="font-display pointer-events-none absolute -bottom-4 right-5 text-[clamp(3.6rem,7vw,6.4rem)] font-semibold leading-none text-white/90 [text-shadow:0_4px_40px_rgba(13,43,94,0.5)]">
          {String(i + 1).padStart(2, '0')}
        </span>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {/* Подсказка при наведении */}
        <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[13px] font-semibold text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
          Открыть кейс ↗
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 px-1 sm:mt-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="flex items-center gap-3 text-[clamp(1.3rem,2.2vw,1.9rem)] font-semibold tracking-tight text-ink">
            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.accent }} />
            {p.title}
          </h3>
          <p className="mt-1.5 text-[15px] text-ink-soft">{p.niche}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-0.5 sm:shrink-0 sm:justify-end sm:pt-1">
          {p.tags.slice(0, 2).map((t) => (
            <span key={t} className="whitespace-nowrap rounded-full border border-ink/15 px-3.5 py-1.5 text-[12px] font-medium text-ink-soft">
              {t}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}
