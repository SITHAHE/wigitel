import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Scramble from './Scramble'
import { principles } from '../data'

const THEMES = {
  paper:  'bg-paper text-ink border border-hairline',
  frost:  'bg-frost text-ink border border-hairline',
  accent: 'bg-gradient-to-br from-accent to-[#5aa0f2] text-white',
  ink:    'bg-gradient-to-b from-[#0d2b5e] to-[#123a80] text-white',
}

// Принципы — stacking cards: карточки прилипают к верху и складываются
// в стопку, каждая предыдущая слегка уезжает и уменьшается под новой.
export default function Principles() {
  return (
    <section className="relative bg-paper py-[clamp(100px,16vh,200px)]">
      <div className="wrap-wide">
        <p className="section-label mb-6"><Scramble text="04 — Принципы" /></p>
        <h2 className="font-display mb-20 max-w-[16ch] text-[clamp(1.8rem,4.4vw,3.6rem)] font-medium leading-tight text-ink">
          На чём стоит <span className="text-outline">Wigitel</span>
        </h2>

        <div className="relative flex flex-col gap-6">
          {principles.map((p, i) => (
            <StackCard key={p.n} p={p} i={i} total={principles.length} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StackCard({ p, i, total }) {
  const ref = useRef(null)
  // Прогресс карточки: 0 когда её верх у верха экрана, 1 когда следующая наехала
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94 - (total - i) * 0.004])
  const isLast = i === total - 1

  return (
    <div ref={ref} className="sticky" style={{ top: `${96 + i * 26}px` }}>
      <motion.div
        style={isLast ? {} : { scale }}
        className={`flex min-h-[300px] flex-col justify-between rounded-[32px] p-9 shadow-[0_24px_70px_-30px_rgba(13,43,94,0.35)] md:min-h-[320px] md:flex-row md:items-end md:gap-16 md:p-14 ${THEMES[p.theme]}`}
      >
        <div className="max-w-2xl">
          <span className={`font-display text-[15px] font-medium ${p.theme === 'accent' || p.theme === 'ink' ? 'text-white/60' : 'text-accent'}`}>
            {p.n}
          </span>
          <h3 className="font-display mt-5 text-[clamp(1.6rem,3.4vw,2.8rem)] font-medium leading-tight">
            {p.title}
          </h3>
        </div>
        <p className={`mt-6 max-w-md text-[16px] leading-relaxed md:mt-0 ${p.theme === 'accent' || p.theme === 'ink' ? 'text-white/80' : 'text-ink-soft'}`}>
          {p.text}
        </p>
      </motion.div>
    </div>
  )
}
