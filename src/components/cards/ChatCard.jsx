import { motion, useAnimationControls } from 'framer-motion';
import { ArrowUpRight, ScrollText } from 'lucide-react';
import { useLang } from '../../i18n/LangContext';

// Наклоны стикеров заданы заранее, чтобы при каждом рендере они не прыгали
const TILTS = [-7, 4, -3, 8, -5, 6, -9, 3, -4, 7, -6];

// Стартер бензопилы: шнур тянется при наведении на карточку
function Starter() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 sm:w-24 text-[#f5f2ea]" aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="14" y="8" width="92" height="50" rx="10" />
        <circle cx="25" cy="19" r="3.5" />
        <circle cx="95" cy="19" r="3.5" />
        <circle cx="25" cy="47" r="3.5" />
        <circle cx="95" cy="47" r="3.5" />
        <path d="M34 20v26M40 20v26M80 20v26M86 20v26" strokeWidth="2.5" />
        <circle cx="60" cy="33" r="15" />
        <circle cx="60" cy="33" r="6" />
      </g>
      <g className="transition-transform duration-500 ease-out group-hover:translate-y-4" fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M60 39v40" strokeWidth="3" strokeDasharray="2 3" />
        <rect x="36" y="80" width="48" height="16" rx="8" strokeWidth="3" />
        <path d="M44 84v8M76 84v8" strokeWidth="2" />
      </g>
    </svg>
  );
}

// Стикеры-вырезки из манги — те же, что в самом Chainsaw Chat (public/stickers).
// pos — позиция поверх карточки, mobile: false — прячем на узких экранах, чтобы не закрывать текст
const MANGA_STICKERS = [
  { src: 'makima_sit', alt: { ru: 'Макима', en: 'Makima', ja: 'マキマ' }, tilt: 6, size: 'w-24 sm:w-36', pos: '-top-12 sm:-top-20 right-[22%]' },
  { src: 'power_salute', alt: { ru: 'Пауэр', en: 'Power', ja: 'パワー' }, tilt: -10, size: 'w-20 sm:w-32', pos: '-left-5 sm:-left-14 top-[42%] md:-top-6' },
  { src: 'himeno_wink', alt: { ru: 'Химено', en: 'Himeno', ja: '姫野' }, tilt: 12, size: 'w-20 sm:w-28', pos: '-right-4 sm:-right-10 top-[6%]' },
  { src: 'reze_smile', alt: { ru: 'Резе', en: 'Reze', ja: 'レゼ' }, tilt: -6, size: 'w-20 sm:w-28', pos: 'right-[44%] sm:right-[43%] top-[19%] sm:top-[24%]', mobile: false },
  { src: 'denji_asa_teeth', alt: { ru: 'Дэндзи и Аса', en: 'Denji and Asa', ja: 'デンジとアサ' }, tilt: -8, size: 'w-28', pos: 'left-[60%] top-[3%]', mobile: false },
  { src: 'kobeni_peace', alt: { ru: 'Кобени', en: 'Kobeni', ja: 'コベニ' }, tilt: 8, size: 'w-24', pos: '-bottom-14 left-[38%]', mobile: false },
  { src: 'yoru_point', alt: { ru: 'Ёру', en: 'Yoru', ja: 'ヨル' }, tilt: -4, size: 'w-32', pos: '-bottom-20 right-[6%]', mobile: false },
  { src: 'aki_smoke', alt: { ru: 'Аки', en: 'Aki', ja: 'アキ' }, tilt: 5, size: 'w-20', pos: '-bottom-16 -left-6', mobile: true },
];

function MangaSticker({ src, alt, tilt, size, pos, mobile = true, delay }) {
  const { tr } = useLang();

  return (
    <motion.img
      src={`/stickers/${src}.webp`}
      alt={tr(alt)}
      loading="lazy"
      draggable={false}
      initial={{ opacity: 0, scale: 1.6, rotate: tilt * 2 }}
      whileInView={{ opacity: 1, scale: 1, rotate: tilt }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 14 }}
      whileHover={{ scale: 1.15, rotate: 0, zIndex: 40 }}
      drag
      dragSnapToOrigin
      className={`absolute z-30 ${pos} ${size} ${mobile ? '' : 'hidden md:block'} h-auto cursor-grab active:cursor-grabbing select-none drop-shadow-[3px_5px_0_rgba(0,0,0,0.35)]`}
    />
  );
}

function Sticker({ children, tilt = 0, className = '' }) {
  return (
    <motion.span
      style={{ rotate: tilt }}
      whileHover={{ rotate: 0, scale: 1.12, y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      className={`sticker inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

export default function ChatCard({ project, onOpen }) {
  const shake = useAnimationControls();
  const { t, tr } = useLang();
  const { links = {} } = project;

  // Пасхалка как в самом чате: нажал на BRRRM — карточку трясёт
  const rev = () =>
    shake.start({ x: [0, -6, 6, -5, 5, -3, 3, 0], rotate: [0, -0.6, 0.6, -0.4, 0.4, 0], transition: { duration: 0.5 } });

  return (
    <motion.article
      animate={shake}
      className="group relative bg-[#111] p-2 sm:p-3 shadow-[8px_8px_0_0_var(--accent)] font-hand text-[#111] mt-10 sm:mt-14 mb-14 sm:mb-20"
    >
      {/* Стикербомбинг: вырезки можно таскать мышкой, отпустил — вернулись на место */}
      {MANGA_STICKERS.map((st, i) => (
        <MangaSticker key={st.src} {...st} delay={0.3 + i * 0.1} />
      ))}

      <div className="grid gap-2 sm:gap-3 md:grid-cols-12">
        {/* Панель 1: лучи скорости, BRRRM и название */}
        <div className="speed-lines relative overflow-hidden border-2 border-[#111] md:col-span-7 min-h-64 sm:min-h-80 flex items-center justify-center">
          <button
            type="button"
            onClick={rev}
            aria-label={t('chat.rev')}
            className="relative z-10 sfx-text text-6xl sm:text-8xl tracking-wider -rotate-6 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          >
            BRRRM!
          </button>

          <Sticker tilt={-4} className="absolute z-10 left-4 bottom-4 sm:left-6 sm:bottom-6 bg-[#f5f2ea] px-4 py-2">
            <span className="block font-comic text-3xl sm:text-5xl leading-none tracking-wide">CHAINSAW CHAT</span>
          </Sticker>

          <Sticker tilt={10} className="absolute z-10 right-4 top-4 starburst bg-[#f5f2ea] !shadow-none px-6 py-5">
            <span className="block font-jp font-black text-lg">ワン!</span>
          </Sticker>

        </div>

        {/* Панель 2: тёмная, стартер и речевой пузырь */}
        <div className="relative overflow-hidden border-2 border-[#f5f2ea]/80 bg-[#1b1b1b] md:col-span-5 p-5 flex flex-col items-center justify-center gap-5 min-h-64">
          <div className="halftone-fine absolute inset-0 opacity-[0.07] invert" aria-hidden />
          <Starter />
          <div className="relative bg-[#f5f2ea] border-2 border-[#111] rounded-[50%] px-7 py-5 text-center shadow-[0_0_0_3px_#f5f2ea]">
            <p className="text-lg sm:text-xl leading-snug uppercase">{tr(project.tagline)}</p>
            <span
              aria-hidden
              className="absolute -top-3 left-1/2 size-5 bg-[#f5f2ea] border-l-2 border-t-2 border-[#111] rotate-45"
            />
          </div>
          <p className="relative font-mono text-[10px] uppercase tracking-[0.3em] text-[#f5f2ea]/60">pull the cord, hunter…</p>
        </div>

        {/* Панель 3: описание, стек-стикеры, кнопки */}
        <div className="relative overflow-hidden border-2 border-[#111] bg-[#f5f2ea] md:col-span-12 p-5 sm:p-7">
          <div className="halftone-fine absolute inset-0 opacity-25" aria-hidden />

          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div>
                <Sticker tilt={-2} className="bg-[#111] text-[#f5f2ea] px-3 py-1 font-comic text-xl tracking-wider">
                  CHAPTER 0
                </Sticker>
                <span className="ml-4 font-mono text-[10px] uppercase tracking-widest">
                  <span className="font-jp">{project.num}</span> · {tr(project.place)}
                </span>
              </div>
              <p className="mt-5 max-w-2xl text-xl leading-snug">
                <span className="bg-[#f5f2ea] box-decoration-clone px-1">{tr(project.desc)}</span>
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-4" aria-label={t('project.stack')}>
                {project.stack.map((t, i) => (
                  <li key={t}>
                    <Sticker tilt={TILTS[i % TILTS.length]} className={`px-2.5 py-1 text-base ${i % 3 === 1 ? 'bg-[#111] text-[#f5f2ea]' : 'bg-[#f5f2ea]'}`}>
                      {t}
                    </Sticker>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
              {links.demo && (
                <a
                  href={links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#111] text-[#f5f2ea] border-2 border-[#111] px-6 py-2.5 text-lg uppercase tracking-wide hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                >
                  Just start <ArrowUpRight size={18} />
                </a>
              )}
              {links.repo && (
                <a
                  href={links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#f5f2ea] border-2 border-[#111] px-6 py-2.5 text-lg uppercase tracking-wide hover:bg-[#111] hover:text-[#f5f2ea] transition-colors"
                >
                  {t('chat.code')}
                </a>
              )}
              <button
                type="button"
                onClick={() => onOpen(project)}
                className="inline-flex items-center justify-center gap-1.5 px-2 py-1 text-lg uppercase underline decoration-2 underline-offset-4 hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                <ScrollText size={16} /> {t('chat.fullScroll')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
