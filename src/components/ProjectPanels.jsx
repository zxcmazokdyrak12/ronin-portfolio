import { motion } from 'framer-motion';
import { ArrowUpRight, Code2, ScrollText } from 'lucide-react';
import ChatCard from './cards/ChatCard';
import TrackerCard from './cards/TrackerCard';
import MandelaCard from './cards/MandelaCard';
import MainlineCard from './cards/MainlineCard';
import { useLang } from '../i18n/LangContext';

// У каждого проекта свой стиль — как у самих приложений
const CUSTOM_CARDS = { edo: ChatCard, kyoto: TrackerCard, osorezan: MandelaCard, kasukabe: MainlineCard };

const reveal = (i) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
});

// Проекты: у чата и трекера собственные карточки, остальные — панели манги
export default function ProjectPanels({ projects, onOpen }) {
  const { t, tr } = useLang();

  return (
    <div className="grid gap-10 lg:gap-14">
      {projects.map((p, i) => {
        const Custom = CUSTOM_CARDS[p.id];
        if (Custom) {
          return (
            <motion.div key={p.id} {...reveal(i)}>
              <Custom project={p} onOpen={onOpen} />
            </motion.div>
          );
        }
        return (
        <motion.article
          key={p.id}
          {...reveal(i)}
          className={`panel group relative overflow-hidden p-6 sm:p-8 flex flex-col `}
        >
          {/* Огромный иероглиф-водяной знак и скринтон в углу */}
          <span
            aria-hidden
            className="absolute -right-4 -bottom-10 font-jp font-black text-[12rem] leading-none text-ink/[0.06] group-hover:text-[var(--accent)]/15 transition-colors duration-500 select-none"
          >
            {p.kanji}
          </span>
          <div aria-hidden className="halftone absolute top-0 right-0 w-40 h-24 opacity-15 [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]" />

          <div className="relative flex items-start justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              <span className="font-jp text-base text-[var(--accent)] mr-2 transition-colors duration-700">{p.num}</span>
              {tr(p.place)} · {tr(p.subtitle)}
            </p>
          </div>

          <h3 className={`relative mt-4 font-display leading-tight text-3xl sm:text-5xl`}>
            {tr(p.name)}
          </h3>
          <p className="relative mt-3 text-lg italic text-ink-soft">{tr(p.tagline)}</p>
          <p className={`relative mt-4 leading-relaxed max-w-2xl`}>{tr(p.desc)}</p>

          <ul className="relative mt-6 flex flex-wrap gap-1.5" aria-label={t('project.stack')}>
            {p.stack.map((t) => (
              <li key={t} className="font-mono text-[11px] px-2 py-0.5 border-2 border-ink bg-paper">
                {t}
              </li>
            ))}
          </ul>

          <div className="relative mt-auto pt-8 flex flex-wrap gap-3">
            {p.links?.demo && (
              <a
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--accent)] text-paper font-mono text-xs uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-ink)] transition-all"
              >
                {tr(p.demoLabel) ?? t('project.demo')} <ArrowUpRight size={14} />
              </a>
            )}
            {p.links?.repo && (
              <a
                href={p.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-paper font-mono text-xs uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-ink)] transition-all"
              >
                <Code2 size={14} /> {t('project.code')}
              </a>
            )}
            <button
              type="button"
              onClick={() => onOpen(p)}
              className="inline-flex items-center gap-1.5 px-4 py-2 font-mono text-xs uppercase tracking-wider underline decoration-2 underline-offset-4 hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <ScrollText size={14} /> {t('project.unroll')}
            </button>
          </div>
        </motion.article>
        );
      })}
    </div>
  );
}
