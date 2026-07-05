import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Полноэкранная атмосферная секция с фото офиса + параллакс.
// Фото лежит в public/studio.jpg. Пока файла нет — показывается
// живой градиентный фолбэк, поэтому секция выглядит цельно в любом случае.
export default function Studio() {
  const ref = useRef(null)
  const [hasImg, setHasImg] = useState(true)

  // Параллакс: изображение выше контейнера и медленно едет при скролле
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-14%', '14%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15])

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-[linear-gradient(135deg,#0d2b5e_0%,#1d5ae0_55%,#5aa0f2_100%)]">
      {/* Параллакс-слой с фото */}
      <motion.div style={{ y, scale }} className="absolute inset-0 -top-[14%] h-[128%] w-full">
        {hasImg && (
          <img
            src="./studio.jpg"
            alt="Студия Wigitel"
            onError={() => setHasImg(false)}
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>

      {/* Скрим для читабельности текста */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/50 to-transparent" />

      {/* Контент — только заголовок */}
      <div className="relative flex h-full items-end">
        <div className="wrap-wide pb-16 md:pb-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="font-display max-w-[18ch] text-[clamp(1.9rem,4.6vw,3.8rem)] font-medium leading-[1.08] text-white"
          >
            Небольшая команда — <span className="text-white/60">большое внимание к деталям</span>
          </motion.h2>
        </div>
      </div>
    </section>
  )
}
