// Гигантская контурная маркиза — редакционная пауза между секциями.
export default function Marquee({ items = ['Wigitel', 'Web Design', 'Development', 'Motion'], className = '' }) {
  return (
    <div className={`overflow-hidden py-8 select-none ${className}`} aria-hidden>
      <div className="marquee-mega whitespace-nowrap">
        {[...Array(2)].map((_, k) => (
          <span key={k} className="inline-flex items-baseline">
            {items.map((it, i) => (
              <span key={i} className="inline-flex items-baseline">
                <span className={`font-display mx-6 text-[clamp(2rem,5.5vw,4.6rem)] font-semibold leading-none ${i % 2 ? 'text-outline' : 'text-ink'}`}>
                  {it}
                </span>
                <span className="mx-2 text-[clamp(1.5rem,3vw,2.5rem)] text-accent">✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}
