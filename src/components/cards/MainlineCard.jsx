import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Code2, Fuel, KeyRound, RotateCcw } from 'lucide-react';
import Modal from '../Modal';
import { useLang } from '../../i18n/LangContext';

// Цвета — те же, что на странице игры на itch.io
const C = { bg: '#0b0907', text: '#d9cbb6', rust: '#c8562e', alarm: '#e0261b' };

const CIRCUITS = ['A', 'B', 'C'];
const SHIFT_MINUTES = 360; // 00:00 → 06:00
const TICK_MS = 100;
const MINUTES_PER_TICK = 0.8; // вся смена ≈ 45 секунд
const VALVE_BOOST = 26;
const FUEL_BOOST = 45;

const CAMS = [
  { id: 'corridor', src: '/mainline/corridor.webp', n: '01' },
  { id: 'vent', src: '/mainline/vent.webp', n: '02' },
  { id: 'locker', src: '/mainline/locker.webp', n: '03' },
  { id: 'sector', src: '/mainline/sector.webp', n: '04' },
];

const fresh = () => ({ status: 'idle', minute: 0, pressure: [80, 80, 80], fuel: 100, failed: null });

const clockText = (minute) => {
  const h = Math.floor(minute / 60);
  const m = String(Math.floor(minute % 60)).padStart(2, '0');
  return `0${h}:${m}`;
};

// Мини-игра «Пульт станции»: держи давление и топливо до шести утра
function StationConsole({ project }) {
  const { t } = useLang();
  const [game, setGame] = useState(fresh);
  const [visible, setVisible] = useState(false);
  // Каждая пережитая смена — следующая ночь, как в игре (до пятой)
  const [night, setNight] = useState(1);
  const rootRef = useRef(null);
  // У каждого контура свой «характер» утечки, чтобы не падали синхронно
  const leak = useRef([0.9, 1.15, 0.75]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => io.disconnect();
  }, []);

  // Игровой цикл. Если пульт ушёл с экрана — смена ставится на паузу
  useEffect(() => {
    if (game.status !== 'running' || !visible) return;
    const id = setInterval(() => {
      setGame((g) => {
        if (g.status !== 'running') return g;
        const minute = g.minute + MINUTES_PER_TICK;
        // К утру трубы сдают сильнее
        const strain = 1 + minute / SHIFT_MINUTES;
        const pressure = g.pressure.map((p, i) => {
          const surge = Math.random() < 0.025 ? 6 + Math.random() * 8 : 0;
          return Math.max(0, p - (leak.current[i] * (0.55 + Math.random() * 0.5) * strain + surge));
        });
        const fuel = Math.max(0, g.fuel - 0.32 * strain);

        const dead = pressure.findIndex((p) => p <= 0);
        if (dead >= 0) return { ...g, minute, pressure, fuel, status: 'failed', failed: { type: 'pressure', c: CIRCUITS[dead] } };
        if (fuel <= 0) return { ...g, minute, pressure, fuel, status: 'failed', failed: { type: 'fuel' } };
        if (minute >= SHIFT_MINUTES) return { ...g, minute: SHIFT_MINUTES, pressure, fuel, status: 'done' };
        return { ...g, minute, pressure, fuel };
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [game.status, visible]);

  const start = () => {
    if (game.status === 'done') setNight((n) => (n >= 5 ? 1 : n + 1));
    leak.current = CIRCUITS.map(() => 0.7 + Math.random() * 0.5);
    setGame({ ...fresh(), status: 'running' });
  };
  const turnValve = useCallback((i) => {
    setGame((g) => (g.status !== 'running' ? g : { ...g, pressure: g.pressure.map((p, k) => (k === i ? Math.min(100, p + VALVE_BOOST) : p)) }));
  }, []);
  const refuel = useCallback(() => {
    setGame((g) => (g.status !== 'running' ? g : { ...g, fuel: Math.min(100, g.fuel + FUEL_BOOST) }));
  }, []);

  // Клавиши 1/2/3 и F, пока смена идёт и пульт на экране
  useEffect(() => {
    if (game.status !== 'running' || !visible) return;
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea')) return;
      if (['1', '2', '3'].includes(e.key)) turnValve(Number(e.key) - 1);
      if (e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А') refuel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [game.status, visible, turnValve, refuel]);

  const lowFuel = game.status === 'running' && game.fuel < 22;

  return (
    <div
      ref={rootRef}
      className={`ml-console relative self-start overflow-hidden border border-[#d9cbb6]/25 bg-black/60 ${lowFuel ? 'is-flicker' : ''} ${game.status === 'failed' ? 'is-alarm' : ''}`}
    >
      {/* Шапка пульта */}
      <div className="flex items-center justify-between border-b border-[#d9cbb6]/20 px-4 py-2 font-mono text-[11px] uppercase tracking-widest">
        <span className="text-[#d9cbb6]/70">{t('mainline.console')}</span>
        <span className="tabular-nums text-white">
          {clockText(game.minute)} AM · NIGHT {night}
        </span>
      </div>

      <div className="relative min-h-[19rem] p-4 sm:p-5">
        {/* Приборы */}
        <div className={`grid grid-cols-4 gap-3 sm:gap-4 transition-opacity ${game.status === 'idle' ? 'opacity-25' : ''}`}>
          {CIRCUITS.map((c, i) => {
            const p = game.pressure[i];
            const low = p < 25;
            return (
              <div key={c} className="flex flex-col items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#d9cbb6]/60">{t('mainline.circuit', { c })}</span>
                <div className="relative h-32 w-8 sm:w-10 border border-[#d9cbb6]/40 bg-black">
                  {/* Риски шкалы */}
                  <div aria-hidden className="ml-ticks absolute inset-0" />
                  <div
                    className="absolute inset-x-0 bottom-0 transition-[height] duration-100"
                    style={{ height: `${p}%`, background: low ? C.alarm : C.rust, boxShadow: low ? `0 0 12px ${C.alarm}` : 'none' }}
                  />
                </div>
                <span className={`font-mono text-xs tabular-nums ${low ? 'text-[#e0261b] ml-blink' : 'text-white'}`}>
                  {low ? t('mainline.low') : `${Math.round(p)} PSI`}
                </span>
                <button
                  type="button"
                  onClick={() => turnValve(i)}
                  disabled={game.status !== 'running'}
                  className="w-full border border-[#d9cbb6]/50 px-1 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#d9cbb6] hover:bg-[#c8562e] hover:border-[#c8562e] hover:text-black active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
                >
                  {t('mainline.valve', { c })}
                </button>
              </div>
            );
          })}

          {/* Генератор */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#d9cbb6]/60">{t('mainline.generator')}</span>
            <div className="relative h-32 w-8 sm:w-10 border border-[#d9cbb6]/40 bg-black">
              <div aria-hidden className="ml-ticks absolute inset-0" />
              <div
                className="absolute inset-x-0 bottom-0 transition-[height] duration-100"
                style={{ height: `${game.fuel}%`, background: game.fuel < 22 ? C.alarm : '#d9a441' }}
              />
            </div>
            <span className={`font-mono text-xs tabular-nums ${game.fuel < 22 ? 'text-[#e0261b] ml-blink' : 'text-white'}`}>
              {game.fuel < 22 ? t('mainline.low') : `${Math.round(game.fuel)}%`}
            </span>
            <button
              type="button"
              onClick={refuel}
              disabled={game.status !== 'running'}
              className="w-full inline-flex items-center justify-center gap-1 border border-[#d9cbb6]/50 px-1 py-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#d9cbb6] hover:bg-[#d9a441] hover:border-[#d9a441] hover:text-black active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            >
              <Fuel size={12} /> {t('mainline.refuel')}
            </button>
          </div>
        </div>

        <p className="mt-4 hidden sm:block font-mono text-[10px] uppercase tracking-widest text-[#d9cbb6]/40">{t('mainline.keys')}</p>

        {/* Начало смены: начальник в кабинете */}
        <AnimatePresence>
          {game.status === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col justify-end bg-black">
              <img src="/mainline/boss.webp" alt="" aria-hidden className="absolute inset-0 size-full object-cover opacity-45" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="relative p-5">
                <p className="font-[Arial,Helvetica,sans-serif] text-sm sm:text-base text-white [text-shadow:0_1px_3px_#000]">
                  <span className="text-[#d9a441]">BOSS:</span> Nobody else showed up. Again.
                </p>
                <p className="mt-2 max-w-md text-sm text-[#d9cbb6]/80">{t('mainline.intro')}</p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-4 inline-flex items-center gap-2 bg-[#c8562e] px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-black hover:bg-[#d9cbb6] transition-colors cursor-pointer"
                >
                  <KeyRound size={14} /> {t('mainline.start')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Авария */}
          {game.status === 'failed' && (
            <motion.div key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 grid place-items-center bg-black/80 p-6 text-center" role="alert">
              <div>
                <p className="font-[Oswald,sans-serif] text-3xl sm:text-4xl font-light uppercase tracking-[0.2em] text-[#e0261b]">
                  {game.failed?.type === 'fuel' ? 'Generator down' : 'Pressure lost'}
                </p>
                <p className="mt-2 text-sm text-[#d9cbb6]/80">
                  {game.failed?.type === 'fuel' ? t('mainline.failFuel') : t('mainline.failPressure', { c: game.failed?.c })}
                </p>
                <p className="mt-1 font-mono text-xs text-[#d9cbb6]/50">{clockText(game.minute)} AM</p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-4 inline-flex items-center gap-2 border border-[#d9cbb6]/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[#d9cbb6] hover:bg-[#d9cbb6] hover:text-black transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} /> {t('mainline.retry')}
                </button>
              </div>
            </motion.div>
          )}

          {/* Утро: смена окончена, дорога домой */}
          {game.status === 'done' && (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6 }} className="absolute inset-0 z-10 flex flex-col justify-end">
              <img src="/mainline/home.webp" alt="" aria-hidden className="absolute inset-0 size-full object-cover object-[50%_35%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="relative p-5 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#d9a441]">{t('mainline.done')}</p>
                <p className="mt-3 font-[Arial,Helvetica,sans-serif] italic text-white [text-shadow:0_1px_3px_#000]">
                  She’ll be asleep. Or at the window, like always.
                </p>
                {t('mainline.doneLine') && <p className="mt-1 text-xs text-white/70">{t('mainline.doneLine')}</p>}
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {project.links?.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#c8562e] px-4 py-2 font-mono text-xs uppercase tracking-widest text-black hover:bg-[#d9cbb6] transition-colors"
                    >
                      {t('mainline.playReal')} <ArrowUpRight size={14} />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={start}
                    className="inline-flex items-center gap-1.5 border border-white/60 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} /> {t('mainline.retry')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MainlineCard({ project, onOpen }) {
  const { t, tr } = useLang();
  const [cam, setCam] = useState(null);
  const [camOpen, setCamOpen] = useState(false);
  const { links = {} } = project;
  const features = tr(project.features);

  return (
    <>
      <article className="ml-card relative overflow-hidden border-3 border-ink shadow-[8px_8px_0_0_var(--accent)]" style={{ background: C.bg, color: C.text }}>
        {/* Баннер игры */}
        <div className="relative overflow-hidden border-b border-[#d9cbb6]/15">
          <img src="/mainline/banner.webp" alt={t('mainline.bannerAlt')} className="ml-kenburns w-full h-auto block" />
          <div aria-hidden className="ml-dither absolute inset-0" />
          <span className="hidden sm:block absolute left-4 top-3 font-mono text-[10px] uppercase tracking-widest text-[#d9cbb6]/60">
            <span className="font-jp">{project.num}</span> · {tr(project.place)} · {tr(project.subtitle)}
          </span>
        </div>
        <p className="border-b border-[#d9cbb6]/15 px-4 py-2 text-center font-[Arial,Helvetica,sans-serif] text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#d9a441]/90">
          Five nights · One shift · Nobody else came
        </p>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[7fr_5fr]">
          <StationConsole project={project} />

          <div>
            <h3 className="sr-only">{tr(project.name)}</h3>
            <p className="text-lg italic text-[#d9cbb6]/80">{tr(project.tagline)}</p>
            <p className="mt-3 leading-relaxed">{tr(project.desc)}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-[#d9cbb6]/80">
              {features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span style={{ color: C.rust }}>▪</span>
                  {f}
                </li>
              ))}
            </ul>

            <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={t('project.stack')}>
              {project.stack.map((s) => (
                <li key={s} className="border border-[#d9cbb6]/30 px-2 py-0.5 font-mono text-[11px] text-[#d9cbb6]/80">
                  {s}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {links.demo && (
                <a
                  href={links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#c8562e] px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-black hover:bg-[#d9cbb6] transition-colors"
                >
                  {tr(project.demoLabel)} <ArrowUpRight size={14} />
                </a>
              )}
              {links.repo && (
                <a
                  href={links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-[#d9cbb6]/50 px-4 py-2.5 font-mono text-xs uppercase tracking-widest hover:bg-[#d9cbb6] hover:text-black transition-colors"
                >
                  <Code2 size={14} /> {t('project.code')}
                </a>
              )}
              <button
                type="button"
                onClick={() => onOpen(project)}
                className="font-mono text-xs uppercase tracking-widest underline underline-offset-4 decoration-[#d9cbb6]/50 hover:text-white cursor-pointer"
              >
                {t('project.unroll')}
              </button>
            </div>
            <p className="mt-5 text-xs text-[#d9cbb6]/45">{t('mainline.warning')}</p>
          </div>
        </div>

        {/* Камеры наблюдения */}
        <div className="border-t border-[#d9cbb6]/15 px-5 sm:px-8 py-6">
          <div className="flex items-baseline gap-3">
            <h4 className="font-[Oswald,sans-serif] font-light text-2xl uppercase tracking-[0.2em] text-white">{t('mainline.cctv')}</h4>
            <span className="text-xs italic text-[#d9cbb6]/45">{t('mainline.cctvHint')}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {CAMS.map((c) => {
              const label = t(`mainline.cams.${c.id}`);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCam({ ...c, label });
                    setCamOpen(true);
                  }}
                  aria-label={t('mainline.camAlt', { name: label })}
                  className="ml-cam group/cam relative aspect-video overflow-hidden border border-[#d9cbb6]/25 bg-black cursor-zoom-in"
                >
                  <img src={c.src} alt="" loading="lazy" className="ml-cam-img size-full object-cover" />
                  <span aria-hidden className="vhs-scan absolute inset-0" />
                  <span className="absolute left-2 top-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase text-white/85 [text-shadow:0_0_3px_#000]">
                    <span className="ml-rec size-1.5 rounded-full bg-[#e0261b]" /> CAM {c.n}
                  </span>
                  <span className="absolute bottom-1.5 left-2 font-mono text-[10px] uppercase text-white/70 [text-shadow:0_0_3px_#000]">{label}</span>
                </button>
              );
            })}
          </div>
          {project.seal && <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-[#d9cbb6]/30">{tr(project.seal)}</p>}
        </div>
      </article>

      <Modal open={camOpen} onClose={() => setCamOpen(false)} labelledBy="cam-title" wide>
        {cam && (
          <figure>
            <figcaption id="cam-title" className="mb-4 flex items-center gap-3 pr-10 font-mono uppercase tracking-widest">
              <span className="size-2 rounded-full bg-[#e0261b]" /> CAM {cam.n} · {cam.label}
            </figcaption>
            <img src={cam.src} alt={t('mainline.camAlt', { name: cam.label })} className="w-full h-auto" />
          </figure>
        )}
      </Modal>
    </>
  );
}
