import { motion } from 'framer-motion'
import HeroFluid from './HeroFluid'

// HERO — «волны света» + круглая стеклянная ЛИНЗА (сфера, рендерится в
// шейдере: преломление, увеличение, аберрация, один ободок). Имя студии
// плавает над сферой — как «United, Unbound» у monopo. Шрифт Crake.
export default function Hero() {
  return (
    <section id="top" className="relative h-[100svh] min-h-[620px] w-full overflow-hidden">
      <HeroFluid />

      {/* Имя над сферой — никакого DOM-стекла, кромка одна (из шейдера) */}
      <div className="pointer-events-none relative flex h-full flex-col items-center justify-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="font-hero text-center text-ink-deep leading-none text-[clamp(2.8rem,7.5vw,7rem)]"
        >
          W<span className="hero-i">i</span>g<span className="hero-i">i</span>tel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="font-display mt-6 text-[clamp(0.72rem,1.5vw,1.05rem)] font-medium uppercase tracking-[0.6em] text-ink-deep/70 [word-spacing:0.3em]"
        >
          web design agency
        </motion.p>
      </div>

      {/* Вращающийся scroll-badge внизу слева */}
      <a href="#work" className="absolute bottom-8 left-7 hidden md:block" aria-label="Листайте вниз">
        <div className="relative h-[92px] w-[92px]">
          <svg viewBox="0 0 100 100" className="spin-badge h-full w-full">
            <defs>
              <path id="wg-circlePath" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
            </defs>
            <text fontSize="8.4" letterSpacing="2.6" fill="rgba(13,43,94,0.7)">
              <textPath href="#wg-circlePath">ЛИСТАЙТЕ ВНИЗ · ЛИСТАЙТЕ ВНИЗ · </textPath>
            </text>
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-ink-deep text-base">↓</span>
        </div>
      </a>

      {/* Тихая студийная сигнатура справа */}
      <div className="absolute bottom-10 right-7 hidden text-right text-[12px] tracking-wide text-ink-deep/60 lg:block">
        <p>Санкт-Петербург</p>
        <p>est. 2024</p>
      </div>
    </section>
  )
}
