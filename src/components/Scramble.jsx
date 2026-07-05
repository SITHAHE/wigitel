import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const CHARS = '!<>-_\\/[]{}—=+*^?#WIGTEL'

const scrambled = (text) =>
  text
    .split('')
    .map((c) => (c === ' ' ? ' ' : CHARS[(Math.random() * CHARS.length) | 0]))
    .join('')

// Текст «собирается» из случайных символов при появлении в вьюпорте.
// ВАЖНО: изначально выводим scrambled-плейсхолдер той же ДЛИНЫ, а не пробел.
// Пустой ' ' схлопывал span почти в нулевую ширину → IntersectionObserver
// (useInView) не считал его видимым и анимация не запускалась — на мобилках
// оставались только линии-подписи без текста.
export default function Scramble({ text, className = '', as: Tag = 'span', speed = 26 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [out, setOut] = useState(() => scrambled(text))
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!inView || done) return
    let frame = 0
    const total = Math.max(16, Math.round(text.length * 1.8))
    const id = setInterval(() => {
      frame++
      const revealed = Math.floor((frame / total) * text.length)
      let s = text.slice(0, revealed)
      for (let i = revealed; i < text.length; i++) {
        s += text[i] === ' ' ? ' ' : CHARS[(Math.random() * CHARS.length) | 0]
      }
      setOut(s)
      if (frame >= total) { setOut(text); setDone(true); clearInterval(id) }
    }, speed)
    return () => clearInterval(id)
  }, [inView, text, speed, done])

  // Страховка: если observer по какой-то причине не сработал, всё равно
  // показываем финальный текст — подпись никогда не останется «кашей».
  useEffect(() => {
    if (done) return
    const t = setTimeout(() => { setOut(text); setDone(true) }, 2500)
    return () => clearTimeout(t)
  }, [text, done])

  return <Tag ref={ref} className={className}>{out}</Tag>
}
