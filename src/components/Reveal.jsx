import { motion } from 'framer-motion'

// Плавное появление снизу с patient-кривой monopo
export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const M = motion[as] || motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1, delay, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </M>
  )
}
