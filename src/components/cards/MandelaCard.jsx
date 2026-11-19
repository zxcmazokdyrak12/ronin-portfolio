import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from '../Modal';
import { useLang } from '../../i18n/LangContext';

// Кадры из игры — «кассеты». Подписи переводятся, таймкоды как на VHS
const TAPES = [
  { id: 'living', src: '/mandela/living.webp', code: 'SP 0:09:13' },
  { id: 'garage', src: '/mandela/garage.webp', code: 'SP 0:12:03' },
  { id: 'hallway', src: '/mandela/hallway.webp', code: 'SP 0:12:06' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Часы в углу, как в HUD игры: ночь идёт с 12:00 AM до 6:00 AM, потом следующая
function HudClock() {
  const [mins, setMins] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setMins((m) => (m + 1) % (6 * 60 * 3)), 2500);
    return () => clearInterval(id);
  }, []);
  const night = Math.floor(mins / 360) + 1;
  const inNight = mins % 360;
  const h = Math.floor(inNight / 60);
  const m = String(inNight % 60).padStart(2, '0');
  return (
    <div className="absolute right-4 top-11 z-30 text-right font-[Arial,Helvetica,sans-serif] text-white [text-shadow:0_1px_3px_#000] pointer-events-none select-none">
      <p className="text-xl sm:text-2xl font-bold leading-none tabular-nums">
        {h === 0 ? 12 : h}:{m} AM
      </p>
      <p className="mt-1 text-xs sm:text-sm font-bold tracking-wide text-white/70">NIGHT {night}</p>
    </div>
  );
}

function Tape({ tape, label, onOpen, big = false }) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={() => onOpen({ ...tape, label })}
      aria-label={t('mandela.tapeAlt', { name: label })}
      className={`vhs-frame group/tape relative block w-full overflow-hidden border border-white/15 bg-black cursor-zoom-in ${big ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}
    >
      <img src={tape.src} alt="" loading="lazy" draggable={false} className="vhs-img size-full object-cover" />
      <span aria-hidden className="vhs-scan absolute inset-0" />
      <span aria-hidden className="vhs-band absolute inset-x-0 h-6" />
      <span className="absolute left-2 top-1.5 font-mono text-[11px] sm:text-xs text-white/90 [text-shadow:0_0_4px_#000]">▶ PLAY</span>
      <span className="absolute right-2 bottom-1.5 font-mono text-[10px] sm:text-[11px] text-white/80 [text-shadow:0_0_4px_#000]">{tape.code}</span>
      <span className="absolute left-2 bottom-1.5 font-mono text-[10px] sm:text-[11px] text-white/60 [text-shadow:0_0_4px_#000] lowercase">{label}</span>
    </button>
  );
}

export default function MandelaCard({ project, onOpen }) {
  const { t, tr } = useLang();
  const cardRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const [showStack, setShowStack] = useState(false);
  const [face, setFace] = useState(null);
  const [ending, setEnding] = useState(null); // null | 'face' | 'static'
  const [tape, setTape] = useState(null);
  const [tapeOpen, setTapeOpen] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const { links = {} } = project;
  const features = tr(project.features);

  // Фонарик: луч плавно тянется за курсором, а без курсора сам бродит по карточке.
  // Позиция пишется прямо в CSS-переменные, без перерисовки React
  useEffect(() => {
    const el = cardRef.current;
    if (!el || reduced) return;
    let raf = 0;
    let visible = false;
    const pos = { x: el.clientWidth * 0.3, y: el.clientHeight * 0.4 };

    const tick = (time) => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const p = pointer.current;
      const tx = p.active ? p.x : w * (0.5 + 0.34 * Math.sin(time * 0.00031));
      const ty = p.active ? p.y : h * (0.48 + 0.3 * Math.sin(time * 0.00047 + 1.3));
      const k = p.active ? 0.22 : 0.04;
      pos.x += (tx - pos.x) * k;
      pos.y += (ty - pos.y) * k;
      el.style.setProperty('--fx', `${pos.x}px`);
      el.style.setProperty('--fy', `${pos.y}px`);
      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Иногда в темноте на мгновение проступает альтернатив. Тихо, без звука
  useEffect(() => {
    if (reduced) return;
    let timer;
    const schedule = () => {
      timer = setTimeout(() => {
        setFace({ x: 8 + Math.random() * 70, y: 15 + Math.random() * 55 });
        setTimeout(() => setFace(null), 220);
        schedule();
      }, 9000 + Math.random() * 12000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [reduced]);

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = cardRef.current.getBoundingClientRect();
    pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top, active: true };
  };
  const onPointerLeave = () => {
    pointer.current.active = false;
  };

  // «goodbye» — сам же просили не нажимать
  const goodbye = () => {
    if (ending) return;
    setEnding('face');
    setTimeout(() => setEnding('static'), 260);
    setTimeout(() => setEnding(null), 1900);
  };

  const openTape = (tp) => {
    setTape(tp);
    setTapeOpen(true);
  };

  const menu = [
    { key: 'newTape', label: 'New tape.', href: links.demo, cls: 'font-body text-3xl sm:text-4xl tracking-[0.3em] text-[#c9c1ae]' },
    { key: 'continue', label: 'continue', href: links.repo, cls: 'font-[Oswald,Impact,sans-serif] font-bold text-4xl sm:text-5xl tracking-tight text-white scale-y-110 origin-left' },
    { key: 'settings', label: 'settings', onClick: () => setShowStack((v) => !v), cls: 'font-body text-2xl sm:text-3xl text-[#8f8f8f]', expanded: showStack },
    { key: 'credits', label: 'credits', onClick: () => onOpen(project), cls: 'font-body text-xl sm:text-2xl tracking-[0.4em] text-[#a3a3a3]' },
    { key: 'goodbye', label: 'goodbye', onClick: goodbye, cls: 'font-[Oswald,Impact,sans-serif] font-bold text-3xl sm:text-4xl text-[#cfd0ff] -ml-3' },
  ];

  return (
    <>
      <article
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className={`mandela-card relative min-w-0 overflow-hidden bg-[#070707] text-[#d4d4d4] border-3 border-ink shadow-[8px_8px_0_0_var(--accent)] ${reduced ? 'is-lit' : ''}`}
      >
        {/* Бегущая строка экстренного оповещения — она «в эфире», поэтому всегда освещена */}
        <div className="relative z-30 h-8 overflow-hidden bg-[#a50d12] text-white font-mono text-xs sm:text-sm uppercase tracking-wider">
          <div className="eas-ticker absolute left-0 top-0 h-full flex items-center whitespace-nowrap">
            <span className="px-4">{t('mandela.ticker').repeat(3)}</span>
            <span className="px-4" aria-hidden>
              {t('mandela.ticker').repeat(3)}
            </span>
          </div>
        </div>

        <HudClock />

        <div className="relative grid gap-8 md:grid-cols-[5fr_7fr] p-6 sm:p-10 pt-10">
          {/* Левая колонка: логотип и меню, как в игре */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
              <span className="font-jp">{project.num}</span> · {tr(project.place)} · {tr(project.subtitle)}
            </p>
            <h3 className="mt-3">
              <span className="sr-only">{tr(project.name)}</span>
              <img
                src="/mandela/logo.webp"
                alt={t('mandela.logoAlt')}
                className="w-full max-w-[360px] mix-blend-screen contrast-125 select-none"
                draggable={false}
              />
            </h3>

            <ul className="mt-6 space-y-3 overflow-hidden">
              {menu.map((item) => {
                const inner = (
                  <>
                    <span className={`block transition-all duration-200 group-hover/menu:translate-x-2 group-hover/menu:text-white group-focus-visible/menu:text-white ${item.cls}`}>
                      {item.label}
                    </span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-white/35 group-hover/menu:text-[var(--accent)] transition-colors">
                      ▸ {t(`mandela.menu.${item.key}`)}
                    </span>
                  </>
                );
                return (
                  <li key={item.key}>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="group/menu block w-fit outline-none">
                        {inner}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={item.onClick}
                        aria-expanded={item.expanded}
                        className="group/menu block w-fit text-left cursor-pointer outline-none"
                      >
                        {inner}
                      </button>
                    )}
                    {item.key === 'settings' && (
                      <AnimatePresence>
                        {showStack && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 flex flex-wrap gap-1.5 overflow-hidden"
                            aria-label={t('project.stack')}
                          >
                            {project.stack.map((s) => (
                              <li key={s} className="font-mono text-[11px] px-2 py-0.5 border border-white/30 text-white/80">
                                {s}
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Правая колонка: описание и кассеты */}
          <div className="md:pt-14">
            <p className="text-lg italic text-white/60">{tr(project.tagline)}</p>
            <p className="mt-3 leading-relaxed">{tr(project.desc)}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-white/70">
              {features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-[#a50d12]">■</span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-baseline gap-3">
              <h4 className="font-[Oswald,Impact,sans-serif] font-bold uppercase tracking-widest text-white">{t('mandela.tapes')}</h4>
              <span className="text-xs italic text-white/40">{t('mandela.tapesHint')}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Tape tape={TAPES[0]} label={t(`mandela.tapeNames.${TAPES[0].id}`)} onOpen={openTape} big />
              </div>
              {TAPES.slice(1).map((tp) => (
                <Tape key={tp.id} tape={tp} label={t(`mandela.tapeNames.${tp.id}`)} onOpen={openTape} />
              ))}
            </div>

            {project.seal && <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">{tr(project.seal)}</p>}
          </div>
        </div>

        {/* Темнота с лучом фонарика. Клики проходят сквозь неё */}
        <div aria-hidden className="flash-dark pointer-events-none absolute inset-0 z-20" />
        <div aria-hidden className="flash-glow pointer-events-none absolute inset-0 z-20" />

        {/* Альтернатив в темноте */}
        <AnimatePresence>
          {face && (
            <motion.img
              key="face"
              src="/mandela/alt.webp"
              alt=""
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.28 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              className="pointer-events-none absolute z-[21] w-40 sm:w-56 mix-blend-screen grayscale"
              style={{ left: `${face.x}%`, top: `${face.y}%` }}
            />
          )}
        </AnimatePresence>

        {/* Плёночный шум поверх всего */}
        <div aria-hidden className="film-grain pointer-events-none absolute inset-0 z-[25]" />

        {!reduced && (
          <p className="hidden [@media(hover:hover)]:block pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-30 font-mono text-[10px] uppercase tracking-widest text-white/40 whitespace-nowrap">
            {t('mandela.hint')}
          </p>
        )}

        {/* Конец кассеты после «goodbye» */}
        {ending && (
          <div className="absolute inset-0 z-40 grid place-items-center bg-black" aria-live="polite">
            {ending === 'face' ? (
              <img src="/mandela/alt.webp" alt="" aria-hidden className="size-full object-cover grayscale contrast-150" />
            ) : (
              <>
                <div aria-hidden className="film-grain absolute inset-0 opacity-90" />
                <p className="relative font-mono text-sm sm:text-base uppercase tracking-[0.4em] text-white/80">{t('mandela.ended')}</p>
              </>
            )}
          </div>
        )}
      </article>

      <Modal open={tapeOpen} onClose={() => setTapeOpen(false)} labelledBy="tape-title" wide>
        {tape && (
          <figure>
            <figcaption id="tape-title" className="mb-4 flex items-center gap-3 pr-10 font-mono uppercase tracking-widest">
              <span className="text-[#a50d12]">▶</span> {tape.label} <span className="ml-auto text-xs text-ink-soft">{tape.code}</span>
            </figcaption>
            <div className="vhs-frame relative">
              <img src={tape.src} alt={t('mandela.tapeAlt', { name: tape.label })} className="w-full h-auto" />
              <span aria-hidden className="vhs-scan absolute inset-0" />
            </div>
          </figure>
        )}
      </Modal>
    </>
  );
}
