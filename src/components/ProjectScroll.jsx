import { ArrowUpRight, Code2 } from 'lucide-react';
import { useLang } from '../i18n/LangContext';

// Содержимое свитка для проекта: описание, фичи, стек и ссылки
export default function ProjectScroll({ project, titleId }) {
  const { t, tr } = useLang();
  const { links = {} } = project;
  const features = tr(project.features) ?? [];

  return (
    <div className="relative">
      <span aria-hidden className="hanko absolute right-8 top-0 grid place-items-center size-14 text-3xl font-black rotate-6">
        {project.kanji}
      </span>

      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft pr-24">
        {tr(project.place)} · {tr(project.subtitle)}
      </p>
      <h2 id={titleId} className="mt-2 font-display text-3xl sm:text-4xl leading-tight pr-20">
        {tr(project.name)}
      </h2>
      <p className="mt-3 italic text-ink-soft">{tr(project.tagline)}</p>
      <p className="mt-4 leading-relaxed">{tr(project.desc)}</p>

      {features.length > 0 && (
        <>
          <h3 className="mt-6 font-mono text-xs uppercase tracking-widest border-b-2 border-ink pb-1">{t('project.inside')}</h3>
          <ul className="mt-3 space-y-2">
            {features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-[var(--accent)] font-bold">—</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={t('project.stack')}>
        {project.stack.map((t) => (
          <li key={t} className="font-mono text-[11px] px-2 py-0.5 border-2 border-ink">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        {links.demo && (
          <a
            href={links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--accent)] text-paper font-mono text-sm uppercase tracking-wider border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--color-ink)] transition-all"
          >
            {tr(project.demoLabel) ?? t('project.openDemo')} <ArrowUpRight size={16} />
          </a>
        )}
        {links.repo && (
          <a
            href={links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-paper font-mono text-sm uppercase tracking-wider border-2 border-ink shadow-[4px_4px_0_0_var(--color-ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--color-ink)] transition-all"
          >
            <Code2 size={16} /> {t('project.repo')}
          </a>
        )}
      </div>

      {project.seal && (
        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-soft">{tr(project.seal)}</p>
      )}
    </div>
  );
}
