import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, RotateCcw, Sword } from 'lucide-react';
import { useLang } from '../i18n/LangContext';
import { regexBlade, SAMPLE_CODE } from '../utils/regexBlade';

const EASE = [0.65, 0, 0.35, 1];

export default function RegexBlade() {
  const { t } = useLang();
  const [code, setCode] = useState(SAMPLE_CODE);
  const [strike, setStrike] = useState(null); // { id, ...результат regexBlade }
  const [copied, setCopied] = useState(false);

  const draw = () => {
    setCopied(false);
    setStrike({ id: Date.now(), ...regexBlade(code) });
  };

  const reset = () => {
    setCode(SAMPLE_CODE);
    setStrike(null);
    setCopied(false);
  };

  const copy = async () => {
    if (!strike) return;
    try {
      await navigator.clipboard.writeText(strike.result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // буфер обмена недоступен (например, без https) — просто ничего не делаем
    }
  };

  const tagLabel = (tag) => (tag === 'blank' ? t('scripts.blade.blank') : tag);

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      {/* Слева — код, который надо почистить */}
      <label className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{t('scripts.blade.input')}</span>
        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setStrike(null);
          }}
          spellCheck={false}
          rows={12}
          className="mt-1.5 w-full flex-1 resize-y bg-ink text-paper/90 font-mono text-xs sm:text-[13px] leading-relaxed p-3 border-2 border-ink outline-none focus:shadow-[0_0_0_3px_var(--accent)] [tab-size:2] whitespace-pre"
        />
      </label>

      {/* Справа — что осталось после удара */}
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{t('scripts.blade.output')}</span>
        <div className="relative mt-1.5 flex-1 min-h-[16rem] overflow-hidden border-2 border-ink bg-paper">
          {!strike && (
            <p className="absolute inset-0 grid place-items-center p-6 text-center italic text-ink-soft">{t('scripts.blade.idle')}</p>
          )}

          {strike && (
            <ol key={strike.id} className="p-3 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto" aria-live="polite">
              {strike.lines.map((l, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 whitespace-pre"
                  initial={false}
                  animate={l.cut ? { x: [0, 0, 14], opacity: [1, 1, 0.55] } : { x: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.03, times: [0, 0.4, 1], ease: EASE }}
                >
                  <span className="w-6 shrink-0 text-right text-ink-soft/50 select-none">{i + 1}</span>
                  <span
                    className={
                      l.cut
                        ? 'text-[var(--accent)] line-through decoration-2'
                        : l.trimmed
                          ? 'bg-[var(--accent)]/10'
                          : ''
                    }
                  >
                    {l.text || ' '}
                  </span>
                  {l.cut && (
                    <span className="ml-auto shrink-0 px-1.5 text-[10px] uppercase tracking-wider bg-[var(--accent)] text-paper no-underline">
                      {tagLabel(l.cut)}
                    </span>
                  )}
                </motion.li>
              ))}
            </ol>
          )}

          {/* Удар клинка по диагонали */}
          <AnimatePresence>
            {strike && (
              <motion.span
                key={`slash-${strike.id}`}
                aria-hidden
                className="pointer-events-none absolute left-[-10%] top-1/2 h-[3px] w-[120%] origin-left bg-ink"
                style={{ rotate: -14 }}
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: [1, 1, 0] }}
                transition={{ duration: 0.6, ease: 'easeOut', opacity: { duration: 0.9, times: [0, 0.6, 1] } }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Кнопки и итог */}
      <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={draw}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-paper font-mono text-xs uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
        >
          <Sword size={14} /> {t('scripts.blade.draw')}
        </button>
        <button
          type="button"
          onClick={copy}
          disabled={!strike}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-paper font-mono text-xs uppercase tracking-wider border-2 border-ink hover:bg-ink hover:text-paper disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? t('scripts.blade.copied') : t('scripts.blade.copy')}
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-2 font-mono text-xs uppercase tracking-wider underline decoration-2 underline-offset-4 hover:text-[var(--accent)] transition-colors cursor-pointer"
        >
          <RotateCcw size={14} /> {t('scripts.blade.reset')}
        </button>

        {strike && (
          <motion.p
            key={`stats-${strike.id}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-mono text-xs sm:text-sm"
          >
            {strike.cut + strike.trimmed === 0
              ? t('scripts.blade.clean')
              : t('scripts.blade.stats', { n: strike.cut, t: strike.trimmed })}
          </motion.p>
        )}
      </div>

      <p className="lg:col-span-2 text-xs italic text-ink-soft">{t('scripts.blade.note')}</p>
    </div>
  );
}
