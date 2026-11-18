import { RotateCcw, Sparkles } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

export default function ScriptCard({ script, samuraiHour, onPalette, onResetPalette, paletteChanged }) {
  const { t, tr } = useLang();

  return (
    <li className="panel p-5 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-2xl">{tr(script.name)}</h3>
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{script.tech}</span>
      </div>
      <p className="mt-2 leading-relaxed">{tr(script.desc)}</p>

      <div className="mt-auto pt-5">
        {script.action === 'palette' && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPalette}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-paper font-mono text-xs uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
            >
              <Sparkles size={14} /> {t('scripts.repaint')}
            </button>
            {paletteChanged && (
              <button
                type="button"
                onClick={onResetPalette}
                aria-label={t('scripts.reset')}
                title={t('scripts.reset')}
                className="px-3 border-2 border-ink hover:bg-ink hover:text-paper transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        )}

        {script.action === 'time' && (
          <span className="inline-block px-3 py-1.5 bg-ink text-paper font-mono text-xs uppercase tracking-wider">
            {t('scripts.now', { hour: samuraiHour })}
          </span>
        )}

        {!script.action && (
          <span className="inline-block font-mono text-xs uppercase tracking-wider text-ink-soft">{t('scripts.soon')}</span>
        )}
      </div>
    </li>
  );
}
