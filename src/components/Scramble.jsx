import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const CHARS = '!<>-_\\/[]{}—=+*^?#WIGTEL'

// Текст «собирается» из случайных символов при появлении в вьюпорте.
export default function Scramble({ text, className = '', as: Tag = 'span', speed = 26 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [out, setOut] = useState('')

  useEffect(() => {
    if (!inView) return
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
      if (frame >= total) { setOut(text); clearInterval(id) }
    }, speed)
    return () => clearInterval(id)
  }, [inView, text, speed])

  return <Tag ref={ref} className={className}>{out || ' '}</Tag>
}
