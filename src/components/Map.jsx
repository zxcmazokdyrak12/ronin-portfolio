import { motion } from 'framer-motion';
import mapImg from '../assets/map-ink.webp';
import { useLang } from '../i18n/LangContext';

export default function Map({ points, onPointClick }) {
  const { t, tr } = useLang();

  return (
    <div className="panel relative w-full overflow-hidden">
      <img
        src={mapImg}
        alt={t('map.alt')}
        width={1800}
        height={1505}
        loading="lazy"
        className="w-full h-auto block select-none"
        draggable={false}
      />

      {points.map((point, i) => (
        <motion.button
          key={point.id}
          type="button"
          aria-label={`${tr(point.place)}: ${tr(point.name)}`}
          onClick={() => onPointClick(point)}
          initial={{ opacity: 0, scale: 2.2, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + i * 0.15, type: 'spring', stiffness: 300, damping: 16 }}
          whileHover={{ scale: 1.15, rotate: 0 }}
          whileTap={{ scale: 0.9 }}
          className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ top: `${point.y}%`, left: `${point.x}%` }}
        >
          {/* Печать ханко вместо иконки */}
          <span className="relative grid place-items-center size-9 sm:size-14 bg-[var(--accent)] text-paper font-jp font-black text-lg sm:text-3xl rounded-md shadow-[3px_3px_0_0_var(--color-ink)] transition-colors duration-700">
            {point.kanji}
          </span>

          <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap bg-ink text-paper font-mono text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
            {tr(point.place)} · {tr(point.name)}
          </span>
        </motion.button>
      ))}

      <p className="absolute bottom-2 right-3 font-mono text-[10px] uppercase tracking-widest bg-paper/80 px-2 py-0.5">
        {t('map.hint')}
      </p>
    </div>
  );
}
