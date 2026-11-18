import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import BrushStroke from './BrushStroke';
import HangingScroll from './HangingScroll';
import Modal from '../Modal';
import { useLang } from '../../i18n/LangContext';

const INK = '#1b1a17';
const SEAL = '#a8321e';
const EASE_BRUSH = [0.65, 0, 0.35, 1];
const KANJI_NUMS = ['一', '二', '三', '四', '五', '六'];

// Скриншоты из docs/ трекера; иероглифы — как у разделов в его навигации
const SHOTS = [
  { id: 'gate', src: '/tracker/gate.webp', kanji: '門' },
  { id: 'scrolls', src: '/tracker/scrolls.webp', kanji: '巻' },
  { id: 'path', src: '/tracker/path.webp', kanji: '道' },
  { id: 'night', src: '/tracker/title-night.webp', kanji: '夜' },
];

// Рисунки из «Бродяги», разложенные как разворот манги.
// span — сколько места панель занимает в сетке, pos — какая часть картинки видна
const PAGES = [
  { src: '/vagabond/musashi-prayer.webp', kanji: '祈', span: 'col-span-2 row-span-2 md:col-span-5 md:row-span-2', pos: 'object-[50%_30%]' },
  { src: '/vagabond/musashi-face.webp', kanji: '眼', span: 'md:col-span-4', pos: 'object-[50%_35%]' },
  { src: '/vagabond/otsu.webp', kanji: '想', span: 'md:col-span-3', pos: 'object-[50%_30%]' },
  { src: '/vagabond/blindfold.webp', kanji: '心', span: 'md:col-span-3', pos: 'object-[50%_25%]' },
  { src: '/vagabond/musashi-otsu.webp', kanji: '縁', span: 'md:col-span-4', pos: 'object-[50%_30%]' },
];

const MIN_CUT = 0.35; // разрез засчитывается, если провели хотя бы на 35% ширины карточки
const SPLIT = 9; // насколько разъезжаются половинки, px

// Энсо — круг одним мазком кисти. Неровный край даёт SVG-фильтр с шумом
function Enso({ animate = true }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[260px]" aria-hidden>
      <defs>
        <filter id="enso-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
      </defs>
      <motion.path
        d="M150 52 A70 70 0 1 0 162 70"
        fill="none"
        stroke={INK}
        strokeWidth="15"
        strokeLinecap="round"
        filter="url(#enso-edge)"
        initial={animate ? { pathLength: 0 } : false}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE_BRUSH }}
      />
      <text x="100" y="104" textAnchor="middle" dominantBaseline="middle" fontFamily="Yuji Boku, Noto Serif JP, serif" fontSize="72" fill={INK}>
        武
      </text>
    </svg>
  );
}

function Stroke({ className = '', still = false }) {
  return (
    <motion.div
      initial={still ? false : { clipPath: 'inset(0 100% 0 0)' }}
      whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: EASE_BRUSH }}
      className={className}
      style={{ color: INK }}
    >
      <BrushStroke />
    </motion.div>
  );
}

// Всё содержимое карточки. Рендерится один раз обычным образом
// и ещё дважды — как две половинки во время разреза
function CardBody({ project, onOpen, onShot, isCopy = false }) {
  const { t, tr } = useLang();
  const { links = {} } = project;
  const features = tr(project.features);

  return (
    <>
      <div className="grid md:grid-cols-[5fr_7fr]">
        <div className="relative flex flex-col items-center gap-3 pt-8 sm:pt-10 md:border-r border-b md:border-b-0 border-[#1b1a17]/30 overflow-hidden">
          <div className="w-36 sm:w-44">
            <Enso animate={!isCopy} />
          </div>
          <p className="font-mincho text-3xl font-extrabold tracking-wide">Vagabond</p>
          <p className="-mt-2 font-jp text-xs tracking-[0.5em] text-[#625e56]">アニメ追跡</p>

          {/* Мусаси в полный рост: белый фон рисунка растворяется в бумаге через multiply */}
          <motion.img
            src="/vagabond/musashi-standing.webp"
            alt={t('tracker.pagesAlt')}
            loading="lazy"
            draggable={false}
            initial={isCopy ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4, ease: EASE_BRUSH }}
            className="mt-auto w-full max-w-[380px] h-auto mix-blend-multiply select-none [mask-image:linear-gradient(to_bottom,transparent,black_18%)]"
          />
          <p className="absolute left-5 bottom-4 font-mono text-[10px] uppercase tracking-widest text-[#625e56] bg-[#e2ded4]/80 px-1">
            <span className="font-jp">{project.num}</span> · {tr(project.place)}
          </p>
        </div>

        <div className="p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center size-11 rounded-md text-[#e2ded4] font-brush text-2xl shadow-sm" style={{ backgroundColor: SEAL }}>
              武
            </span>
            <div>
              <p className="font-mincho text-xl font-extrabold leading-none">{tr(project.name)}</p>
              <p className="mt-1 text-xs text-[#625e56]">{tr(project.subtitle)}</p>
            </div>
          </div>
          <Stroke className="mt-5" still={isCopy} />

          <h3 className="mt-7 font-spectral text-3xl sm:text-4xl font-semibold leading-tight">{t('tracker.enterTitle')}</h3>
          <p className="mt-2 text-lg italic text-[#625e56]">{tr(project.tagline)}</p>
          <p className="mt-4 text-lg leading-relaxed">{tr(project.desc)}</p>

          <ol className="mt-6 space-y-3">
            {features.map((f, i) => (
              <li key={f} className="flex gap-4 border-b border-[#1b1a17]/20 pb-3">
                <span className="font-brush text-xl leading-6 w-6 shrink-0" style={{ color: SEAL }}>
                  {KANJI_NUMS[i] ?? '・'}
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-sm text-[#625e56]">{project.stack.join(' · ')}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {links.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isCopy ? -1 : undefined}
                className="group/enter inline-flex items-center gap-3 bg-[#1b1a17] text-[#e2ded4] px-7 py-3 text-lg hover:bg-[var(--accent)] transition-colors"
              >
                <span aria-hidden className="block h-[2px] w-6 bg-current -rotate-12 transition-all duration-300 group-hover/enter:w-9" />
                {t('tracker.enter')}
              </a>
            )}
            {links.repo && (
              <a
                href={links.repo}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isCopy ? -1 : undefined}
                className="text-lg underline underline-offset-4 decoration-1 hover:decoration-2"
              >
                {t('tracker.source')}
              </a>
            )}
            <button
              type="button"
              onClick={() => onOpen(project)}
              tabIndex={isCopy ? -1 : undefined}
              className="inline-flex items-center gap-1.5 text-lg underline underline-offset-4 decoration-1 hover:decoration-2 cursor-pointer"
            >
              <ScrollText size={16} /> {t('tracker.scroll')}
            </button>
          </div>
        </div>
      </div>

      {/* Страницы манги — рисунки, из которых вырос трекер */}
      <div className="border-t border-[#1b1a17]/30 px-7 sm:px-10 pt-8 pb-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-brush text-3xl" style={{ color: SEAL }}>
            頁
          </span>
          <h4 className="font-spectral text-2xl font-semibold">{t('tracker.pagesTitle')}</h4>
          <span className="text-sm italic text-[#625e56]">{t('tracker.pagesHint')}</span>
        </div>
        <Stroke className="mt-3 max-w-xs" still={isCopy} />

        <div className="mt-6 grid grid-cols-2 md:grid-cols-12 auto-rows-[150px] sm:auto-rows-[190px] md:auto-rows-[210px] gap-2 sm:gap-3">
          {PAGES.map((pg, i) => (
            <motion.button
              key={pg.src}
              type="button"
              tabIndex={isCopy ? -1 : undefined}
              onClick={() => onShot({ src: pg.src, kanji: pg.kanji, label: t('tracker.pagesTitle'), art: true })}
              aria-label={t('tracker.pagesAlt')}
              initial={isCopy ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: EASE_BRUSH }}
              className={`group/page relative overflow-hidden border-2 border-[#1b1a17] bg-[#f1eee6] cursor-zoom-in ${pg.span}`}
            >
              <img
                src={pg.src}
                alt=""
                loading="lazy"
                draggable={false}
                className={`size-full object-cover ${pg.pos} mix-blend-multiply grayscale transition-transform duration-[1.2s] ease-out group-hover/page:scale-105`}
              />
              <span className="absolute right-1.5 top-1.5 grid place-items-center size-7 rounded-sm font-brush text-base text-[#e2ded4] opacity-0 group-hover/page:opacity-100 transition-opacity" style={{ backgroundColor: SEAL }}>
                {pg.kanji}
              </span>
            </motion.button>
          ))}
        </div>
        <p className="mt-3 text-right text-[11px] italic text-[#625e56]">{t('tracker.credit')}</p>
      </div>

      {/* Свитки-скриншоты — у трекера вместо стикеров */}
      <div className="border-t border-[#1b1a17]/30 px-7 sm:px-10 pt-8 pb-10">
        <div className="flex items-baseline gap-3">
          <span className="font-brush text-3xl" style={{ color: SEAL }}>
            巻
          </span>
          <h4 className="font-spectral text-2xl font-semibold">{t('tracker.scrollsTitle')}</h4>
          <span className="hidden sm:inline text-sm italic text-[#625e56]">{t('tracker.scrollsHint')}</span>
        </div>
        <Stroke className="mt-3 max-w-xs" still={isCopy} />
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-9 gap-y-8 sm:gap-x-10 px-2 sm:px-0">
          {SHOTS.map((s, i) => (
            <HangingScroll key={s.src} shot={{ ...s, label: t(`tracker.shots.${s.id}`) }} index={i} onOpen={onShot} still={isCopy} />
          ))}
        </div>
      </div>
    </>
  );
}

// Полуплоскость по одну сторону от линии разреза — как clip-path polygon
function halfPlane({ x1, y1, x2, y2 }, side) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const dx = (x2 - x1) / len;
  const dy = (y2 - y1) / len;
  const nx = -dy * side;
  const ny = dx * side;
  const L = 5000;
  const pts = [
    [x1 - dx * L, y1 - dy * L],
    [x1 + dx * L, y1 + dy * L],
    [x1 + dx * L + nx * L, y1 + dy * L + ny * L],
    [x1 - dx * L + nx * L, y1 - dy * L + ny * L],
  ];
  return { clip: `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(',')})`, nx, ny };
}

export default function TrackerCard({ project, onOpen }) {
  const { t } = useLang();
  const ref = useRef(null);
  const drag = useRef(null);
  const [trail, setTrail] = useState(null);
  const [cut, setCut] = useState(null);
  const [shot, setShot] = useState(null);
  const [shotOpen, setShotOpen] = useState(false);

  const point = (e) => {
    const r = ref.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width };
  };

  // Разрез мышью, как на заставке трекера: зажал, провёл, отпустил.
  // На тач-экранах не включаем, чтобы не мешать прокрутке
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || cut) return;
    const p = point(e);
    drag.current = { x1: p.x, y1: p.y };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const p = point(e);
    const t = { ...drag.current, x2: p.x, y2: p.y };
    if (Math.abs(t.x2 - t.x1) > 12) {
      window.getSelection()?.removeAllRanges();
      setTrail(t);
    }
  };
  const onPointerUp = (e) => {
    if (!drag.current) return;
    const p = point(e);
    const line = { ...drag.current, x2: p.x, y2: p.y };
    drag.current = null;
    setTrail(null);
    if (Math.hypot(line.x2 - line.x1, line.y2 - line.y1) >= p.w * MIN_CUT) {
      window.getSelection()?.removeAllRanges();
      setCut(line);
      setTimeout(() => setCut(null), 1500);
    }
  };

  const openShot = (s) => {
    setShot(s);
    setShotOpen(true);
  };

  const halves = cut ? [halfPlane(cut, 1), halfPlane(cut, -1)] : null;

  return (
    <>
      <article
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          drag.current = null;
          setTrail(null);
        }}
        className={`washi relative border border-[#1b1a17]/40 shadow-[8px_8px_0_0_var(--color-ink)] font-spectral ${trail ? 'select-none' : ''}`}
        style={{ color: INK }}
      >
        <p className="hidden md:block absolute right-4 top-3 z-10 text-xs italic text-[#625e56] pointer-events-none">
          {t('tracker.cutHint')}
        </p>

        <div style={{ visibility: cut ? 'hidden' : 'visible' }}>
          <CardBody project={project} onOpen={onOpen} onShot={openShot} />
        </div>

        {/* Две половинки после удара: разъезжаются по нормали к разрезу и сходятся обратно */}
        {halves?.map((h, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="washi absolute inset-0 overflow-hidden pointer-events-none"
            style={{ clipPath: h.clip }}
            initial={{ x: 0, y: 0 }}
            animate={{ x: [0, h.nx * SPLIT, h.nx * SPLIT, 0], y: [0, h.ny * SPLIT, h.ny * SPLIT, 0] }}
            transition={{ duration: 1.4, times: [0, 0.15, 0.7, 1], ease: EASE_BRUSH }}
          >
            <CardBody project={project} onOpen={onOpen} onShot={openShot} isCopy />
          </motion.div>
        ))}

        {/* След клинка и печать 斬 в точке удара */}
        <svg className="pointer-events-none absolute inset-0 z-20 size-full overflow-visible" aria-hidden>
          {trail && (
            <line x1={trail.x1} y1={trail.y1} x2={trail.x2} y2={trail.y2} stroke={INK} strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
          )}
          <AnimatePresence>
            {cut && (
              <motion.line
                key="slash"
                x1={cut.x1}
                y1={cut.y1}
                x2={cut.x2}
                y2={cut.y2}
                stroke={INK}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: [1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>
        </svg>
        <AnimatePresence>
          {cut && (
            <motion.span
              key="zan"
              className="pointer-events-none absolute z-30 grid place-items-center size-16 -ml-8 -mt-8 rounded-md font-brush text-4xl text-[#e2ded4]"
              style={{ left: (cut.x1 + cut.x2) / 2, top: (cut.y1 + cut.y2) / 2, backgroundColor: SEAL }}
              initial={{ scale: 2.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              斬
            </motion.span>
          )}
        </AnimatePresence>
      </article>

      <Modal open={shotOpen} onClose={() => setShotOpen(false)} labelledBy="shot-title" wide>
        {shot && (
          <figure>
            <figcaption id="shot-title" className="mb-4 flex items-center gap-3 pr-10">
              <span className="font-brush text-3xl" style={{ color: SEAL }}>
                {shot.kanji}
              </span>
              <span className="font-spectral text-2xl font-semibold">{shot.label}</span>
            </figcaption>
            <img
              src={shot.src}
              alt={shot.art ? t('tracker.pagesAlt') : t('tracker.shotAlt', { name: shot.label })}
              className={`h-auto border border-[#1b1a17]/30 ${shot.art ? 'mx-auto max-h-[70vh] w-auto bg-white' : 'w-full'}`}
            />
            {shot.art && <p className="mt-3 text-right text-xs italic text-ink-soft">{t('tracker.credit')}</p>}
          </figure>
        )}
      </Modal>
    </>
  );
}
