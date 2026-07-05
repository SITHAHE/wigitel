import Scramble from './Scramble'
import { testimonials } from '../data'

// Отзывы — бесконечная лента карточек-цитат, замирает при наведении.
export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-paper py-20 md:py-[clamp(90px,14vh,180px)]">
      <div className="wrap-wide mb-10 md:mb-14">
        <p className="section-label mb-6"><Scramble text="06 — Отзывы" /></p>
        <h2 className="font-display max-w-[18ch] text-[clamp(1.8rem,4.4vw,3.6rem)] font-medium leading-tight text-ink">
          Что говорят <span className="text-outline-accent">клиенты</span>
        </h2>
      </div>

      <div className="group/track relative">
        {/* градиентные шторки по краям */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-paper to-transparent" />

        <div className="marquee-track gap-6 pr-6 [animation-duration:48s] group-hover/track:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((t, i) => (
            <figure
              key={i}
              className="flex w-[420px] max-w-[82vw] shrink-0 flex-col justify-between rounded-[28px] border border-hairline bg-frost p-8 transition-colors duration-500 hover:bg-white"
            >
              <blockquote className="text-[16px] leading-relaxed text-ink">
                «{t.quote}»
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span
                  className="font-display grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-sky to-accent text-[15px] font-medium text-white"
                >
                  {t.name[0]}
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{t.name}</p>
                  <p className="text-[13px] text-muted">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
