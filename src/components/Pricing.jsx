import { motion } from 'framer-motion'
import Scramble from './Scramble'
import Magnetic from './Magnetic'
import { tiers } from '../data'

// Тарифы — три статусных плана, средний — глубокий синий монолит.
export default function Pricing() {
  return (
    <section id="pricing" className="relative bg-canvas py-20 md:py-[clamp(100px,16vh,200px)]">
      <div className="wrap-wide">
        <div className="mb-10 md:mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="section-label mb-6"><Scramble text="05 — Тарифы" /></p>
            <h2 className="font-display text-[clamp(1.8rem,4.4vw,3.6rem)] font-medium leading-tight text-ink">
              Прозрачные <span className="text-outline">условия</span>
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Ниже — ориентиры, от которых мы отталкиваемся. Точную смету называем
            после знакомства с задачей.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className={`flex h-full flex-col rounded-[32px] p-9 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-2 md:p-11 ${
                t.highlight
                  ? 'bg-gradient-to-b from-[#0d2b5e] to-[#123a80] text-white shadow-[0_40px_100px_-40px_rgba(13,43,94,0.7)]'
                  : 'border border-hairline bg-paper text-ink shadow-[0_20px_60px_-40px_rgba(13,43,94,0.25)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`text-[22px] font-semibold ${t.highlight ? 'text-white' : 'text-ink'}`}>{t.name}</h3>
                {t.highlight && (
                  <span className="rounded-full bg-accent px-3.5 py-1.5 text-[12px] font-semibold text-white">Популярный</span>
                )}
              </div>
              <p className={`mt-1 text-[14px] ${t.highlight ? 'text-white/60' : 'text-muted'}`}>{t.tagline}</p>

              <p className={`mt-8 text-[clamp(2.2rem,3vw,2.9rem)] font-bold tracking-tight leading-none ${t.highlight ? 'text-white' : 'text-ink'}`}>
                {t.price}
              </p>

              <ul className="mt-9 flex flex-1 flex-col gap-3.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px]">
                    <span className={`mt-[3px] text-[13px] ${t.highlight ? 'text-[#7ab4ff]' : 'text-accent'}`}>✓</span>
                    <span className={t.highlight ? 'text-white/85' : 'text-ink-soft'}>{f}</span>
                  </li>
                ))}
              </ul>

              {t.note && (
                <p className={`mt-6 text-[13px] ${t.highlight ? 'text-white/50' : 'text-muted'}`}>{t.note}</p>
              )}

              <Magnetic strength={0.25} className="mt-4 w-full">
                <a
                  href="https://t.me/wigitel"
                  target="_blank"
                  rel="noreferrer"
                  className={`pill w-full justify-center ${t.highlight ? 'pill-accent' : 'pill-ghost'}`}
                >
                  Выбрать тариф
                </a>
              </Magnetic>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
