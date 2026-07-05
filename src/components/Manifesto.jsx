import { motion } from 'framer-motion'
import Scramble from './Scramble'

const STATEMENT = [
  { w: 'Мы' }, { w: 'создаём' }, { w: 'сайты,', accent: true }, { w: 'которые' },
  { w: 'продают' }, { w: 'ваш' }, { w: 'продукт' }, { w: 'ещё' },
  { w: 'до', outline: true }, { w: 'первого', outline: true }, { w: 'слова', outline: true },
  { w: 'менеджера.' },
]

// Манифест — одно гигантское заявление на весь экран, слова
// поднимаются каскадом. Awwwards-паттерн «statement section».
export default function Manifesto() {
  return (
    <section id="about" className="relative bg-paper py-20 md:py-[clamp(100px,18vh,220px)]">
      <div className="wrap-wide">
        <p className="section-label mb-8 md:mb-14"><Scramble text="01 — Кто мы" /></p>

        <h2 className="font-display max-w-[15ch] text-[clamp(1.9rem,5vw,4.6rem)] font-medium leading-[1.14] text-ink">
          {STATEMENT.map((item, i) => (
            // whileInView на внешней маске (всегда видима), анимация внутреннего
            // слова каскадом через variants — иначе сдвинутый y:110% внутренний
            // span вытолкнут за overflow-hidden и reveal может залипнуть.
            <motion.span
              key={i}
              className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] mr-[0.24em] align-top"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            >
              <motion.span
                className={`inline-block ${item.accent ? 'text-accent' : ''} ${item.outline ? 'text-outline' : ''}`}
                variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
              >
                {item.w}
              </motion.span>
            </motion.span>
          ))}
        </h2>
      </div>
    </section>
  )
}
