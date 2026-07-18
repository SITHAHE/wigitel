import { useEffect } from 'react'
import Lenis from 'lenis'

// Инерционный плавный скролл (lenis) + плавные переходы по якорям.
export default function SmoothScroll() {
  useEffect(() => {
    // Уважаем «уменьшить движение»: инерционный скролл отключаем, отдаём
    // нативный. Якорные переходы тоже мгновенные (через нативный scrollIntoView).
    const reduceMotion = window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      const onClickNative = (e) => {
        const a = e.target.closest('a[href^="#"]')
        if (!a) return
        const target = document.querySelector(a.getAttribute('href'))
        if (!target) return
        e.preventDefault()
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
      document.addEventListener('click', onClickNative)
      return () => document.removeEventListener('click', onClickNative)
    }

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    window.__lenis = lenis // доступ для оверлеев (stop/start)
    let raf
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)

    // Якорные ссылки едут плавно через lenis
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const target = document.querySelector(a.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: 0, duration: 1.6 })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('click', onClick)
      if (window.__lenis === lenis) delete window.__lenis
      lenis.destroy()
    }
  }, [])
  return null
}
