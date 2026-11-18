import { useEffect, useState } from 'react';
import { LANGS, useLang } from '../i18n/LangContext';

const LINKS = [
  { href: '#map', key: 'nav.map' },
  { href: '#projects', key: 'nav.projects' },
  { href: '#arsenal', key: 'nav.arsenal' },
  { href: '#contact', key: 'nav.contact' },
];

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-paper/90 backdrop-blur border-b-2 border-ink' : 'bg-transparent border-b-2 border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 h-14">
        <a href="#top" className="flex items-center gap-2 font-display text-lg shrink-0">
          <span className="hanko inline-grid place-items-center size-8 text-sm font-black">浪</span>
          <span className="hidden lg:inline">{t('nav.home')}</span>
        </a>

        <ul className="hidden sm:flex gap-5 md:gap-7 font-mono text-xs md:text-sm uppercase tracking-wider">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="py-1 hover:text-[var(--accent)] transition-colors">
                {t(l.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Переключатель языка — как три печати */}
        <div role="group" aria-label={t('nav.language')} className="flex border-2 border-ink font-mono text-[11px] sm:text-xs shrink-0">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              lang={l.code}
              aria-pressed={lang === l.code}
              onClick={() => setLang(l.code)}
              className={`px-2 sm:px-2.5 py-1 cursor-pointer transition-colors border-l-2 border-ink first:border-l-0 ${
                lang === l.code ? 'bg-ink text-paper' : 'hover:bg-ink/10'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
