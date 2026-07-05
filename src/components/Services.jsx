import { motion } from 'framer-motion'
import Scramble from './Scramble'
import { services, steps } from '../data'

// Услуги — гигантские редакционные строки (awwwards-паттерн):
// огромный текст, hover сдвигает строку и проявляет описание.
export default function Services() {
  return (
    <section id="services" className="relative bg-paper py-20 md:py-[clamp(100px,16vh,200px)]">
      <div className="wrap-wide">
        <p className="section-label mb-8 md:mb-14"><Scramble text="03 — Услуги" /></p>

        <div className="border-t border-hairline">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="group relative flex cursor-default items-baseline gap-6 border-b border-hairline py-9 transition-colors duration-500 hover:bg-canvas md:gap-10 md:py-12 md:px-6">
                <span className="text-[14px] font-semibold text-accent">{s.n}</span>
                <div className="flex-1">
                  <h3 className="font-display text-[clamp(1.35rem,3.2vw,2.7rem)] font-medium leading-tight text-ink transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] md:group-hover:translate-x-4">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft opacity-70 transition-all duration-700 md:max-h-0 md:overflow-hidden md:opacity-0 md:group-hover:max-h-24 md:group-hover:opacity-100">
                    {s.desc}
                  </p>
                </div>
                <span className="hidden text-3xl text-muted transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-rotate-45 group-hover:text-accent md:block">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Процесс — компактная лента шагов */}
        <div className="mt-16 md:mt-24">
          <p className="section-label mb-8 md:mb-10"><Scramble text="Как мы работаем" /></p>
          <div className="grid gap-px overflow-hidden rounded-[28px] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st, i) => (
              <motion.div
                key={st.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
                className="flex h-full flex-col bg-paper p-8 transition-colors duration-500 hover:bg-frost"
              >
                <span className="text-[42px] font-bold leading-none tracking-tight text-outline-accent">{st.n}</span>
                <h4 className="mt-6 text-[19px] font-semibold text-ink">{st.title}</h4>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{st.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
