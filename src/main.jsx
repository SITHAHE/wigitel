import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App.jsx'
import './index.css'

// Без StrictMode: его двойной mount в dev ломает framer-motion whileInView
// (once:true) — часть reveal-анимаций «залипала» в initial-состоянии,
// из-за чего, например, заголовок в секции «Контакт» оставался пустым.
// MotionConfig reducedMotion="user" — framer уважает системную настройку
// «уменьшить движение»: гасит transform/y-сдвиги, оставляя лишь opacity,
// поэтому контент всегда доезжает до конечного состояния (без «залипаний»).
ReactDOM.createRoot(document.getElementById('root')).render(
  <MotionConfig reducedMotion="user">
    <App />
  </MotionConfig>
)
