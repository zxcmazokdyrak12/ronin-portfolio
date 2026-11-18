import { motion } from 'framer-motion';
import { useLang } from '../../i18n/LangContext';

// Какэдзику — висящий свиток. Внутри скриншот трекера, «отпечатанный» тушью
// (как InkImage в самом трекере): цвет проступает при наведении
export default function HangingScroll({ shot, index, onOpen, still = false }) {
  const { t } = useLang();

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(shot)}
      aria-label={t('tracker.openShot', { name: shot.label })}
      initial={still ? false : { opacity: 0, y: -30 }}
      tabIndex={still ? -1 : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 * index, type: 'spring', stiffness: 120, damping: 12 }}
      whileHover={{ rotate: [0, -2.5, 2, -1, 0.5, 0], transition: { duration: 1.4 } }}
      style={{ originY: 0 }}
      className="group/scroll relative flex flex-col items-center cursor-zoom-in"
    >
      {/* Шнурок и гвоздик */}
      <svg viewBox="0 0 60 22" className="w-14 h-5 text-[#1b1a17]" aria-hidden>
        <circle cx="30" cy="3" r="2.5" fill="currentColor" />
        <path d="M30 4 L8 21 M30 4 L52 21" stroke="currentColor" strokeWidth="1.2" fill="none" />
      </svg>

      {/* Верхняя палочка */}
      <span className="relative z-10 block h-2.5 w-[calc(100%+10px)] rounded-full bg-[#1b1a17]" />

      {/* Полотно свитка */}
      <span className="relative block w-full bg-[#d5d0c3] px-2.5 pt-3 pb-4 shadow-[0_8px_14px_-8px_rgba(27,26,23,0.5)]">
        <span className="block border border-[#1b1a17]/25 overflow-hidden aspect-[3/4] bg-[#e2ded4]">
          <img
            src={shot.src}
            alt={shot.label}
            loading="lazy"
            className="size-full object-cover object-top grayscale-[1] contrast-[1.12] brightness-[1.04] mix-blend-multiply transition-all duration-700 group-hover/scroll:grayscale-0 group-hover/scroll:mix-blend-normal group-hover/scroll:scale-105"
          />
        </span>
        <span className="mt-3 flex items-center justify-center gap-2">
          <span className="font-brush text-xl leading-none text-[#a8321e]">{shot.kanji}</span>
          <span className="font-spectral text-sm">{shot.label}</span>
        </span>
      </span>

      {/* Нижняя палочка с утяжелителями */}
      <span className="relative block h-3 w-[calc(100%+18px)] rounded-full bg-[#1b1a17]">
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 size-4 rounded-full bg-[#1b1a17]" />
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 size-4 rounded-full bg-[#1b1a17]" />
      </span>
    </motion.button>
  );
}
