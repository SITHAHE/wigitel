import Reveal from './Reveal'
import { steps } from '../data'

// Процесс — ледяная полоса, крупные номера, спокойный ритм.
export default function Process() {
  return (
    <section className="relative bg-canvas py-[clamp(80px,14vh,160px)]">
      <div className="wrap-wide">
        <Reveal>
          <p className="eyebrow mb-4">Как мы работаем</p>
          <h2 className="h-anchor max-w-[16ch] text-[clamp(2rem,5vw,4rem)] text-ink">
            Четыре шага до запуска
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="flex h-full flex-col bg-paper p-8 transition-colors hover:bg-frost">
                <span className="text-[46px] font-light leading-none tracking-tight text-sky">{s.n}</span>
                <h3 className="mt-6 text-[20px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
