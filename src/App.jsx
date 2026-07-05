import SmoothScroll from './components/SmoothScroll'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Manifesto from './components/Manifesto'
import Work from './components/Work'
import Services from './components/Services'
import Principles from './components/Principles'
import Counters from './components/Counters'
import Studio from './components/Studio'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative">
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        <Marquee className="border-b border-hairline bg-paper" />
        <Manifesto />
        <Studio />
        <Work />
        <Services />
        <Principles />
        <Counters />
        <Marquee items={['Дизайн', 'Разработка', 'Анимация', 'Поддержка']} className="bg-paper" />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
