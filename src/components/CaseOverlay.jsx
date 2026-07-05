import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Fullscreen-оверлей кейса: раскрывается поверх сайта. Скроллится нативно;
// lenis игнорирует колесо над оверлеем благодаря data-lenis-prevent (если
// его остановить через stop() — он блокирует и нативный скролл, был баг).
export default function CaseOverlay({ project: p, onClose }) {
  useEffect(() => {
    // блокируем скролл фона, но НЕ через lenis.stop()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.article
        initial={{ y: '6%', opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: '4%', opacity: 0, scale: 0.99 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="absolute inset-x-0 bottom-0 top-[max(2.5vh,20px)] overflow-y-auto overscroll-contain rounded-t-[36px] bg-paper shadow-[0_-30px_90px_-30px_rgba(13,43,94,0.5)]"
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          aria-label="Закрыть кейс"
          className="fixed right-6 top-[calc(max(2.5vh,20px)+20px)] z-10 grid h-12 w-12 place-items-center rounded-full bg-ink text-white transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:rotate-90"
        >
          ✕
        </button>

        <div className="mx-auto max-w-[1100px] px-6 pb-24 pt-14 md:px-10">
          {/* Шапка кейса */}
          <p className="section-label mb-6">Кейс</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(2.2rem,6vw,4.6rem)] font-medium leading-none text-ink">
              {p.title}
            </h2>
            <span className="text-[15px] text-muted">{p.year}</span>
          </div>
          <p className="mt-3 text-[17px] text-ink-soft">{p.niche}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="rounded-full border border-ink/15 px-4 py-1.5 text-[13px] font-medium text-ink-soft">
                {t}
              </span>
            ))}
          </div>

          {/* Галерея: главный скриншот + два экрана сайта */}
          <div className="mt-10 overflow-hidden rounded-[28px] shadow-[0_40px_100px_-40px_rgba(13,43,94,0.4)]">
            <img src={(p.gallery && p.gallery[0]) || p.img} alt={`Проект ${p.title} — главный экран`} className="w-full" />
          </div>
          {p.gallery && p.gallery.length > 1 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {p.gallery.slice(1).map((src, i) => (
                <div key={src} className="overflow-hidden rounded-[22px] shadow-[0_30px_70px_-35px_rgba(13,43,94,0.35)]">
                  <img src={src} alt={`Проект ${p.title} — экран ${i + 2}`} loading="lazy" className="w-full transition-transform duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-[1.03]" />
                </div>
              ))}
            </div>
          )}

          {/* Задача / решение */}
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center gap-3 text-[20px] font-semibold text-ink">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-canvas text-[13px] font-bold text-accent">01</span>
                Задача
              </h3>
              <p className="text-[16px] leading-relaxed text-ink-soft">{p.challenge}</p>
            </div>
            <div>
              <h3 className="mb-4 flex items-center gap-3 text-[20px] font-semibold text-ink">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-canvas text-[13px] font-bold text-accent">02</span>
                Решение
              </h3>
              <p className="text-[16px] leading-relaxed text-ink-soft">{p.solution}</p>
            </div>
          </div>

          {/* CTA внизу кейса */}
          <div className="mt-16 flex flex-col items-center gap-4 rounded-[28px] bg-canvas px-8 py-12 text-center">
            <p className="font-display text-[clamp(1.3rem,2.6vw,2rem)] font-medium text-ink">
              Хотите так же — под вашу задачу?
            </p>
            <a
              href="https://t.me/wigitel"
              target="_blank"
              rel="noreferrer"
              className="pill pill-accent mt-2 !px-9 !py-4"
            >
              Обсудить проект
            </a>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
