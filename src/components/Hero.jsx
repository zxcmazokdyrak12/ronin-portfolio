import { motion } from 'framer-motion';
import { ArrowDown, Code2 } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

const GITHUB_URL = 'https://github.com/zxcmazokdyrak12';


const rise = (delay) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero({ samuraiHour }) {
  const { t, tr } = useLang();
  const stats = t('hero.stats');

  return (
    <section id="top" className="relative min-h-[100svh] flex items-center overflow-hidden pt-20 pb-12">
      {/* Огромные иероглифы тушью на фоне */}
      <motion.div
        aria-hidden
        className="vertical-jp absolute -right-4 sm:right-6 top-16 text-[9rem] sm:text-[15rem] leading-none font-black text-ink/[0.07] select-none"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        浪人
      </motion.div>
      <div aria-hidden className="halftone absolute -left-24 bottom-0 size-80 rounded-full opacity-[0.12]" />

      <div className="relative max-w-6xl mx-auto w-full px-4 sm:px-6">
        <motion.p {...rise(0.05)} className="font-mono text-xs sm:text-sm uppercase tracking-[0.3em] text-ink-soft">
          {t('hero.eyebrow', { hour: samuraiHour })}
        </motion.p>

        <motion.h1 {...rise(0.15)} className="mt-4 font-display text-6xl sm:text-8xl lg:text-9xl leading-[0.95]">
          {t('hero.title1')}
          <br />
          <span className="brush-underline">{t('hero.title2')}</span>
          <span className="text-[var(--accent)] transition-colors duration-700">.</span>
        </motion.h1>

        <motion.p {...rise(0.3)} className="mt-8 max-w-xl text-lg sm:text-xl leading-relaxed">
          {t('hero.desc')}
        </motion.p>

        <motion.div {...rise(0.45)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper font-mono text-sm uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0_0_var(--accent)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_var(--accent)] transition-all"
          >
            {t('hero.cta')}
            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-paper font-mono text-sm uppercase tracking-wider border-3 border-ink shadow-[5px_5px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_0_var(--color-ink)] transition-all"
          >
            <Code2 size={16} /> GitHub
          </a>
        </motion.div>

        <motion.dl {...rise(0.6)} className="mt-16 grid grid-cols-3 max-w-2xl border-t-3 border-ink">
          {stats.map((s) => (
            <div key={s.value} className="pt-4 pr-3">
              <dt className="sr-only">{tr(s.label)}</dt>
              <dd className="font-display text-4xl sm:text-5xl">{s.value}</dd>
              <dd className="mt-1 text-xs sm:text-sm text-ink-soft leading-snug">{tr(s.label)}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
