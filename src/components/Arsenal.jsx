import { motion } from 'framer-motion';
import { useLang } from '../i18n/LangContext';

// Арсенал собран из стеков реальных проектов (список — в i18n/ui.js)


export default function Arsenal() {
  const { t, tr } = useLang();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {t('arsenal').map((g, i) => (
        <motion.div
          key={g.kanji}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="panel p-5"
        >
          <div className="flex items-center gap-3 border-b-2 border-ink pb-3">
            <span className="hanko grid place-items-center size-10 text-xl font-black">{g.kanji}</span>
            <h3 className="font-display text-2xl">{tr(g.title)}</h3>
          </div>
          <ul className="mt-4 space-y-2 font-mono text-sm">
            {g.items.map((it) => (
              <li key={tr(it)} className="flex gap-2">
                <span className="text-[var(--accent)] transition-colors duration-700">—</span>
                {tr(it)}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
