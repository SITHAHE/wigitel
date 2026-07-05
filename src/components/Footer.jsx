// Футер — тёмная инверсия с гигантским вордмарком (awwwards-паттерн).
export default function Footer() {
  return (
    <footer className="overflow-hidden bg-ink text-white/70">
      <div className="wrap-wide pt-16">
        <div className="flex flex-col justify-between gap-12 pb-16 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 text-white">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-sky to-accent text-white text-sm font-bold">W</span>
              <span className="font-display text-[17px] font-medium">Wigitel</span>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-white/55">
              Web design agency. Создаём сайты, которые выглядят дороже
              и работают на результат.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
            <div>
              <p className="mb-4 text-[12px] uppercase tracking-widest text-white/40">Навигация</p>
              <ul className="space-y-2.5 text-[15px]">
                <li><a href="#work" className="transition-colors hover:text-white">Работы</a></li>
                <li><a href="#services" className="transition-colors hover:text-white">Услуги</a></li>
                <li><a href="#pricing" className="transition-colors hover:text-white">Тарифы</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[12px] uppercase tracking-widest text-white/40">Контакт</p>
              <ul className="space-y-2.5 text-[15px]">
                <li><a href="tel:+79952355609" className="transition-colors hover:text-white">+7 995 235-56-09</a></li>
                <li><a href="https://t.me/wigitel" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Telegram</a></li>
                <li><a href="mailto:hello@wigitel.ru" className="transition-colors hover:text-white">hello@wigitel.ru</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-[12px] uppercase tracking-widest text-white/40">Студия</p>
              <ul className="space-y-2.5 text-[15px] text-white/55">
                <li>Санкт-Петербург</li>
                <li>Работаем по всей России</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 pb-6 text-[13px] text-white/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Wigitel. Все права защищены.</p>
          <p>Сделано с вниманием к деталям</p>
        </div>
      </div>

      {/* Гигантский вордмарк, уходящий за нижний край */}
      <div className="select-none overflow-hidden leading-none" aria-hidden>
        <p className="font-display mx-auto -mb-[0.24em] text-center text-[clamp(4rem,13vw,13rem)] font-semibold text-white/[0.06]">
          Wigitel
        </p>
      </div>
    </footer>
  )
}
