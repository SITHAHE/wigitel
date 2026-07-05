import { useRef } from 'react'
import { motion, useSpring } from 'framer-motion'

// Магнитная обёртка: элемент тянется к курсору при приближении.
export default function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const x = useSpring(0, { stiffness: 160, damping: 14, mass: 0.4 })
  const y = useSpring(0, { stiffness: 160, damping: 14, mass: 0.4 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}
