import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

// Печать и короткое имя для каждого репозитория — как на карте
const REPO_SEALS = {
  'chainsaw-chat': { kanji: '鋸', label: 'chat' },
  'vagabond-anime-tracker': { kanji: '剣', label: 'tracker' },
  'ronin-portfolio': { kanji: '浪', label: 'portfolio' },
  'the-mandela-catalogue': { kanji: '霊', label: 'mandela' },
};

const LOCALES = { ru: 'ru-RU', en: 'en-US', ja: 'ja-JP' };
const UNITS = [
  ['year', 31536000],
  ['month', 2592000],
  ['week', 604800],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
];

// «3 часа назад» на нужном языке — встроенным Intl, без библиотек
function timeAgo(date, lang) {
  const rtf = new Intl.RelativeTimeFormat(LOCALES[lang], { numeric: 'auto' });
  const seconds = (new Date(date).getTime() - Date.now()) / 1000;
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(Math.round(seconds), 'second');
}

export default function CommitScroll() {
  const { lang, t } = useLang();
  const [state, setState] = useState({ status: 'loading', commits: [] });

  useEffect(() => {
    let alive = true;
    fetch('/api/commits')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => alive && setState({ status: 'ready', commits: data.commits }))
      .catch(() => alive && setState({ status: 'error', commits: [] }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mt-4 flex flex-col items-center">
      {/* Верхняя палочка свитка */}
      <span className="block h-3 w-[calc(100%+12px)] rounded-full bg-ink" />
      <div className="w-full max-h-[26rem] overflow-y-auto bg-paper-dark/60 border-x-2 border-ink px-3 py-3">
        {state.status === 'loading' && <p className="py-8 text-center text-sm italic text-ink-soft">{t('scripts.commits.loading')}</p>}

        {state.status === 'error' && (
          <div className="py-6 text-center text-sm">
            <p className="italic text-ink-soft">{t('scripts.commits.error')}</p>
            <a
              href="https://github.com/zxcmazokdyrak12"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider underline underline-offset-4"
            >
              {t('scripts.commits.profile')} <ArrowUpRight size={12} />
            </a>
          </div>
        )}

        {state.status === 'ready' && (
          <ol className="space-y-2.5">
            {state.commits.map((c, i) => {
              const seal = REPO_SEALS[c.repo] ?? { kanji: '・', label: c.repo };
              return (
                <motion.li
                  key={c.sha + c.repo}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/commit flex gap-2.5 border-b border-ink/15 pb-2.5"
                  >
                    <span className="mt-0.5 grid place-items-center size-7 shrink-0 rounded-sm bg-[var(--accent)] text-paper font-jp text-sm transition-colors duration-700">
                      {seal.kanji}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm leading-snug group-hover/commit:text-[var(--accent)] transition-colors">{c.message}</span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                        {seal.label} · {c.sha} · {timeAgo(c.date, lang)}
                      </span>
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </ol>
        )}
      </div>
      {/* Нижняя палочка */}
      <span className="block h-3.5 w-[calc(100%+20px)] rounded-full bg-ink" />
    </div>
  );
}
