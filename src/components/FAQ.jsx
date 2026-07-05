import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Scramble from './Scramble'
import { faq } from '../data'

// FAQ — аккордеон с плавным раскрытием и вращающимся плюсом.
export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section className="relative bg-canvas py-20 md:py-[clamp(90px,14vh,180px)]">
      <div className="wrap-wide grid gap-10 md:gap-14 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="section-label mb-6"><Scramble text="07 — FAQ" /></p>
          <h2 className="font-display text-[clamp(1.8rem,4.4vw,3.4rem)] font-medium leading-tight text-ink">
            Частые <span className="text-outline">вопросы</span>
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-soft">
            Не нашли свой вопрос? Напишите в{' '}
            <a href="https://t.me/wigitel" target="_blank" rel="noreferrer" className="text-accent underline-offset-4 hover:underline">
              Telegram
            </a>{' '}
            — ответим в течение дня.
          </p>
        </div>

        <div className="divide-y divide-hairline border-y border-hairline">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className={`text-[clamp(1.05rem,1.7vw,1.35rem)] font-semibold tracking-tight transition-colors ${isOpen ? 'text-accent' : 'text-ink'}`}>
                    {item.q}
                  </span>
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border text-lg transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                      isOpen ? 'rotate-45 border-accent bg-accent text-white' : 'border-ink/20 text-ink'
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-[15.5px] leading-relaxed text-ink-soft">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
