import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { href: '#work', label: 'Работы' },
  { href: '#services', label: 'Услуги' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#contact', label: 'Контакт' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
      className={`fixed inset-x-0 top-0 z-50 rounded-b-[22px] border border-t-0 backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ${
        scrolled
          ? 'border-white/50 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_20px_50px_-26px_rgba(21,74,166,0.4)]'
          : 'border-white/35 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]'
      }`}
    >
      {/* Бегущий стеклянный блик — только над панелью (не задевает мобильное меню) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[68px] overflow-hidden rounded-b-[22px]">
        <div className="glass-sheen" />
      </div>

      <nav className="wrap-wide relative flex h-[68px] items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 text-ink transition-colors">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-sky to-accent text-white text-sm font-bold shadow-sm">W</span>
          <span className="font-hero text-[19px] font-medium">Wigitel</span>
        </a>

        <ul className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-[15px] text-ink-soft transition-colors hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="https://t.me/wigitel" target="_blank" rel="noreferrer" className="pill pill-accent !hidden md:!inline-flex !py-2.5 !px-6 !text-[15px]">
          Telegram
        </a>

        {/* Мобильное меню */}
        <button className="md:hidden text-ink transition-colors" onClick={() => setOpen(!open)} aria-label="Меню">
          <div className="flex flex-col gap-[5px]">
            <span className={`h-[2px] w-6 bg-current transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-[2px] w-6 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-[2px] w-6 bg-current transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </div>
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          className="overflow-hidden rounded-b-[22px] border-t border-white/40 bg-white/35 backdrop-blur-2xl backdrop-saturate-150 md:hidden"
        >
          <ul className="wrap flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg text-ink">{l.label}</a>
              </li>
            ))}
            <li className="pt-2">
              <a href="https://t.me/wigitel" target="_blank" rel="noreferrer" className="pill pill-accent w-full justify-center">Написать в Telegram</a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  )
}
