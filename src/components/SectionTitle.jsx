import { motion } from 'framer-motion';

// Заголовок раздела: номер-иероглиф, название и подпись мелким моноширинным
export default function SectionTitle({ id, kanji, title, caption }) {
  return (
    <motion.div
      className="flex items-end gap-4 sm:gap-6 mb-10"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span aria-hidden className="font-jp font-black text-6xl sm:text-7xl leading-none text-[var(--accent)] transition-colors duration-700">
        {kanji}
      </span>
      <div>
        <h2 id={id} className="font-display text-4xl sm:text-5xl leading-none">
          {title}
        </h2>
        {caption && <p className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-soft">{caption}</p>}
      </div>
    </motion.div>
  );
}
