import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Без StrictMode: его двойной mount в dev ломает framer-motion whileInView
// (once:true) — часть reveal-анимаций «залипала» в initial-состоянии,
// из-за чего, например, заголовок в секции «Контакт» оставался пустым.
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
