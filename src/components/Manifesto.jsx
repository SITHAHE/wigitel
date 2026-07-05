import { motion } from 'framer-motion'
import Scramble from './Scramble'

const STATEMENT = [
  { w: 'Мы' }, { w: 'создаём' }, { w: 'сайты,', accent: true }, { w: 'которые' },
  { w: 'продают' }, { w: 'ваш' }, { w: 'бизнес' }, { w: 'ещё' },
  { w: 'до', outline: true }, { w: 'первого', outline: true }, { w: 'слова', outline: true },
  { w: 'менеджера.' },
]

// Манифест — одно гигантское заявление на весь экран, слова
// поднимаются каскадом. Awwwards-паттерн «statement section».
export default function Manifesto() {
  return (
    <section id="about" className="relative bg-paper py-[clamp(100px,18vh,220px)]">
      <div className="wrap-wide">
        <p className="section-label mb-14"><Scramble text="01 — Кто мы" /></p>

        <h2 className="font-display max-w-[15ch] text-[clamp(1.9rem,5vw,4.6rem)] font-medium leading-[1.14] text-ink">
          {STATEMENT.map((item, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] mr-[0.24em] align-top">
              <motion.span
                className={`inline-block ${item.accent ? 'text-accent' : ''} ${item.outline ? 'text-outline' : ''}`}
                initial={{ y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
              >
                {item.w}
              </motion.span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}
