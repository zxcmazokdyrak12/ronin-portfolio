import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { roninName } from '../utils/roninName';

export default function RoninName() {
  const { lang, t } = useLang();
  const [nick, setNick] = useState('');
  const [copied, setCopied] = useState(false);
  const name = useMemo(() => roninName(nick), [nick]);

  const meaning = (part) => (lang === 'ja' ? part.kana : part[lang] ?? part.ru);
  const fullText = name
    ? `${name.family.kanji}${name.given.kanji} — ${name.family.romaji} ${name.given.romaji} · ${name.epithet[lang]}`
    : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // буфер обмена недоступен — молча пропускаем
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{t('scripts.name.label')}</span>
        <input
          value={nick}
          onChange={(e) => {
            setNick(e.target.value);
            setCopied(false);
          }}
          maxLength={40}
          placeholder={t('scripts.name.placeholder')}
          className="mt-1.5 w-full bg-paper border-2 border-ink px-3 py-2 font-mono text-sm outline-none focus:shadow-[0_0_0_3px_var(--accent)]"
        />
      </label>

      <div className="relative min-h-[15rem] border-2 border-ink bg-paper-dark/60 p-4 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {!name ? (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center italic text-ink-soft">
              {t('scripts.name.empty')}
            </motion.p>
          ) : (
            <motion.div
              key={`${name.family.kanji}${name.given.kanji}${name.epithet.en}`}
              initial={{ opacity: 0, scale: 1.4, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="flex items-center gap-4"
              aria-live="polite"
            >
              {/* Вертикальная печать с именем */}
              <span className="vertical-jp shrink-0 grid place-items-center px-2 py-3 bg-[var(--accent)] text-paper text-3xl font-black leading-tight rounded-md shadow-[3px_3px_0_0_var(--color-ink)] transition-colors duration-700">
                {name.family.kanji}
                {name.given.kanji}
              </span>
              <div className="min-w-0">
                <p className="font-display text-2xl leading-tight">
                  {name.family.romaji} {name.given.romaji}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {meaning(name.family)} · {meaning(name.given)}
                </p>
                <p className="mt-3 italic">{name.epithet[lang]}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copy}
          disabled={!name}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-paper font-mono text-xs uppercase tracking-wider border-2 border-ink hover:bg-ink hover:text-paper disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t('scripts.name.copied') : t('scripts.name.copy')}
        </button>
        <span className="text-xs italic text-ink-soft">{t('scripts.name.note')}</span>
      </div>
    </div>
  );
}
