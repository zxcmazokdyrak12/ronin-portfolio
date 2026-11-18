import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import SectionTitle from './components/SectionTitle';
import Map from './components/Map';
import ProjectPanels from './components/ProjectPanels';
import Arsenal from './components/Arsenal';
import ScriptCard from './components/ScriptCard';
import Modal from './components/Modal';
import ProjectScroll from './components/ProjectScroll';
import data from './data/projects.json';
import { getSamuraiHourIndex } from './utils/samuraiTime';
import { useLang } from './i18n/LangContext';
import { DEFAULT_PALETTE, generateNayutaPalette } from './utils/nayutaPalette';

const TITLE_ID = 'scroll-title';
const projects = data.points.filter((p) => p.type === 'project');
const scripts = data.points.find((p) => p.type === 'scripts');

const CONTACTS = [
  { label: 'GitHub', handle: 'zxcmazokdyrak12', href: 'https://github.com/zxcmazokdyrak12' },
  { label: 'itch.io', handle: 'spookytake', href: 'https://spookytake.itch.io' },
];

// Номер текущей стражи 0–11; название берётся из словаря на нужном языке
function useSamuraiHour() {
  const [index, setIndex] = useState(getSamuraiHourIndex);
  useEffect(() => {
    const id = setInterval(() => setIndex(getSamuraiHourIndex()), 60_000);
    return () => clearInterval(id);
  }, []);
  return index;
}

function App() {
  // Точку не обнуляем при закрытии — иначе свиток опустеет посреди анимации исчезновения
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [palette, setPalette] = useState(DEFAULT_PALETTE);
  const { t, tr } = useLang();
  const samuraiHour = t('hours')[useSamuraiHour()];

  const openScroll = useCallback((point) => {
    // Печать Эдзо ведёт не в свиток, а в мастерскую со скриптами
    if (point.type === 'scripts') {
      document.getElementById('workshop')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setSelected(point);
    setIsOpen(true);
  }, []);
  const closeScroll = useCallback(() => setIsOpen(false), []);

  return (
    <div className="paper-grain min-h-screen" style={{ '--accent': palette.accent }}>
      <Nav />

      <main>
        <Hero samuraiHour={samuraiHour} />

        <section id="map" className="scroll-mt-20 py-20 sm:py-28 border-t-3 border-ink">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionTitle kanji="地図" title={t('sections.map.title')} caption={t('sections.map.caption')} />
            <Map points={data.points} onPointClick={openScroll} />
          </div>
        </section>

        <section id="projects" className="scroll-mt-20 py-20 sm:py-28 bg-paper-dark border-y-3 border-ink">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionTitle kanji="戦" title={t('sections.projects.title')} caption={t('sections.projects.caption')} />
            <ProjectPanels projects={projects} onOpen={openScroll} />
          </div>
        </section>

        <section id="arsenal" className="scroll-mt-20 py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <SectionTitle kanji="武器" title={t('sections.arsenal.title')} caption={t('sections.arsenal.caption')} />
            <Arsenal />
          </div>
        </section>

        {scripts && (
          <section id="workshop" className="scroll-mt-20 py-20 sm:py-28 border-t-3 border-ink">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <SectionTitle kanji="筆" title={t('sections.workshop.title')} caption={`${tr(scripts.place)} · ${tr(scripts.subtitle)}`} />
              <p className="-mt-4 mb-8 max-w-xl text-lg italic text-ink-soft">{tr(scripts.tagline)}</p>
              <ul className="grid gap-6 md:grid-cols-3">
                {scripts.content.map((s) => (
                  <ScriptCard
                    key={s.tech}
                    script={s}
                    samuraiHour={samuraiHour}
                    onPalette={() => setPalette((p) => generateNayutaPalette(p.hue))}
                    onResetPalette={() => setPalette(DEFAULT_PALETTE)}
                    paletteChanged={palette !== DEFAULT_PALETTE}
                  />
                ))}
              </ul>
            </div>
          </section>
        )}

        <section id="contact" className="scroll-mt-20 relative overflow-hidden bg-ink text-paper py-24 sm:py-32">
          <span
            aria-hidden
            className="vertical-jp absolute right-4 sm:right-12 top-8 text-[8rem] sm:text-[12rem] leading-none font-black text-paper/[0.06] select-none"
          >
            道
          </span>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
            <motion.h2
              className="font-display text-5xl sm:text-7xl leading-tight max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {t('contact.before')}
              <span className="text-[var(--accent)] transition-colors duration-700">{t('contact.accent')}</span>
              {t('contact.after')}
            </motion.h2>
            <p className="mt-6 max-w-xl text-lg text-paper/75">
              {t('contact.text')}
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 max-w-2xl">
              {CONTACTS.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-2 border-paper/80 px-5 py-4 hover:bg-paper hover:text-ink transition-colors"
                  >
                    <span>
                      <span className="block font-mono text-xs uppercase tracking-widest opacity-70">{c.label}</span>
                      <span className="font-display text-xl">{c.handle}</span>
                    </span>
                    <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="bg-ink text-paper/50 border-t border-paper/15">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap justify-between gap-2 font-mono text-[11px] uppercase tracking-widest">
          <span>{t('footer.dedication')}</span>
          <span>{t('footer.map')}</span>
        </div>
      </footer>

      <Modal open={isOpen} onClose={closeScroll} labelledBy={TITLE_ID}>
        {selected && <ProjectScroll project={selected} titleId={TITLE_ID} />}
      </Modal>
    </div>
  );
}

export default App;
