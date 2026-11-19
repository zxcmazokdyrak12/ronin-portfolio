import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../i18n/LangContext';

const NAME_KEY = 'ronin-duel-name';
const BEST_KEY = 'ronin-duel-best';
const NAME_RE = /^[\p{L}\p{N} ._-]{1,20}$/u;

// Звание по времени реакции
function rankOf(ms) {
  if (ms < 200) return 'musashi';
  if (ms < 260) return 'ronin';
  if (ms < 330) return 'samurai';
  if (ms < 450) return 'student';
  return 'peasant';
}

function readStorage(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // приватный режим — не сохраняем, и ладно
  }
}

export default function Duel() {
  const { t } = useLang();
  // idle → wait → go → result; клик во время wait — early (фальстарт)
  const [phase, setPhase] = useState('idle');
  const [ms, setMs] = useState(null);
  const [best, setBest] = useState(() => Number(readStorage(BEST_KEY, 0)) || null);
  const [name, setName] = useState(() => readStorage(NAME_KEY, ''));
  const [save, setSave] = useState({ state: 'idle' }); // idle | saving | saved | error
  const [board, setBoard] = useState({ state: 'loading', scores: [] });
  const timer = useRef(null);
  const startedAt = useRef(0);

  const loadBoard = useCallback(async () => {
    try {
      const res = await fetch('/api/duel');
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      setBoard({ state: 'ready', scores: data.scores });
    } catch {
      setBoard({ state: 'error', scores: [] });
    }
  }, []);

  useEffect(() => {
    // Загружаем свиток рекордов один раз при появлении дуэли
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBoard();
    return () => clearTimeout(timer.current);
  }, [loadBoard]);

  const begin = () => {
    setMs(null);
    setSave({ state: 'idle' });
    setPhase('wait');
    // Случайная пауза, чтобы нельзя было угадать момент
    timer.current = setTimeout(() => {
      startedAt.current = performance.now();
      setPhase('go');
    }, 1500 + Math.random() * 2500);
  };

  const strike = () => {
    if (phase === 'wait') {
      clearTimeout(timer.current);
      setPhase('early');
      return;
    }
    if (phase === 'go') {
      const result = Math.round(performance.now() - startedAt.current);
      // Быстрее 100 мс — это не реакция, а угаданный клик
      if (result < 100) {
        setPhase('early');
        return;
      }
      setMs(result);
      setPhase('result');
      if (!best || result < best) {
        setBest(result);
        writeStorage(BEST_KEY, String(result));
      }
      return;
    }
    begin();
  };

  const onKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!e.repeat) strike();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const clean = name.trim().replace(/\s+/g, ' ');
    if (!NAME_RE.test(clean)) {
      setSave({ state: 'error', message: t('scripts.duel.errName') });
      return;
    }
    writeStorage(NAME_KEY, clean);
    setSave({ state: 'saving' });
    try {
      const res = await fetch('/api/duel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: clean, ms }),
      });
      if (res.status === 429) throw new Error('fast');
      if (res.status === 400) throw new Error('name');
      if (!res.ok) throw new Error('server');
      const data = await res.json();
      setSave({ state: 'saved', rank: data.rank });
      loadBoard();
    } catch (err) {
      const key = err.message === 'fast' ? 'errFast' : err.message === 'name' ? 'errName' : 'errServer';
      setSave({ state: 'error', message: t(`scripts.duel.${key}`) });
    }
  };

  const arenaText = {
    idle: { big: '決闘', small: t('scripts.duel.start') },
    wait: { big: '待', small: t('scripts.duel.wait') },
    go: { big: '斬', small: t('scripts.duel.go') },
    early: { big: '負', small: t('scripts.duel.early') },
    result: { big: ms, small: ms ? t(`scripts.duel.ranks.${rankOf(ms)}`) : '' },
  }[phase];

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-[3fr_2fr]">
      <div className="flex flex-col gap-3">
        {/* Арена: реагирует на нажатие сразу (pointerdown), а не на отпускание — так честнее */}
        <button
          type="button"
          onPointerDown={(e) => {
            if (e.button === 0) strike();
          }}
          onKeyDown={onKeyDown}
          className={`relative h-64 sm:h-72 w-full overflow-hidden border-2 border-ink select-none cursor-pointer outline-none focus-visible:shadow-[0_0_0_3px_var(--accent)] transition-colors duration-75 ${
            phase === 'go' ? 'bg-[var(--accent)] text-paper' : phase === 'wait' ? 'bg-ink text-paper' : 'bg-paper text-ink'
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase + String(ms)}
              initial={{ opacity: 0, scale: phase === 'go' ? 2 : 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: phase === 'go' ? 0.08 : 0.25 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4"
            >
              <span className={`leading-none ${phase === 'result' ? 'font-display text-7xl sm:text-8xl' : 'font-jp font-black text-7xl sm:text-8xl'}`}>
                {arenaText.big}
                {phase === 'result' && <span className="ml-2 text-2xl font-mono">{t('scripts.duel.ms')}</span>}
              </span>
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-center">{arenaText.small}</span>
              {(phase === 'result' || phase === 'early') && (
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">{t('scripts.duel.again')}</span>
              )}
            </motion.span>
          </AnimatePresence>
        </button>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="italic text-ink-soft">{t('scripts.duel.startHint')}</span>
          {best && <span className="font-mono">{t('scripts.duel.best', { ms: best })}</span>}
        </div>

        {phase === 'result' && ms && save.state !== 'saved' && (
          <form onSubmit={submit} className="flex flex-wrap items-end gap-2">
            <label className="flex-1 min-w-[10rem]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">{t('scripts.duel.nameLabel')}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                required
                className="mt-1 w-full bg-paper border-2 border-ink px-3 py-2 font-mono text-sm outline-none focus:shadow-[0_0_0_3px_var(--accent)]"
              />
            </label>
            <button
              type="submit"
              disabled={save.state === 'saving'}
              className="px-4 py-2.5 bg-[var(--accent)] text-paper font-mono text-xs uppercase tracking-wider border-2 border-ink shadow-[3px_3px_0_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-ink)] disabled:opacity-60 transition-all cursor-pointer"
            >
              {save.state === 'saving' ? t('scripts.duel.saving') : t('scripts.duel.submit')}
            </button>
          </form>
        )}
        {save.state === 'saved' && <p className="font-mono text-sm">{t('scripts.duel.saved', { rank: save.rank })}</p>}
        {save.state === 'error' && <p className="font-mono text-sm text-[var(--accent)]">{save.message}</p>}
      </div>

      {/* Свиток рекордов из базы */}
      <div className="border-2 border-ink bg-paper-dark/60 p-4">
        <h4 className="font-display text-xl">{t('scripts.duel.board')}</h4>
        {board.state === 'loading' && <p className="mt-3 text-sm italic text-ink-soft">{t('scripts.duel.boardLoading')}</p>}
        {board.state === 'error' && <p className="mt-3 text-sm italic text-ink-soft">{t('scripts.duel.errServer')}</p>}
        {board.state === 'ready' && board.scores.length === 0 && (
          <p className="mt-3 text-sm italic text-ink-soft">{t('scripts.duel.boardEmpty')}</p>
        )}
        {board.state === 'ready' && board.scores.length > 0 && (
          <ol className="mt-3 space-y-1.5 font-mono text-sm">
            {board.scores.map((s, i) => (
              <li key={s.name} className="flex items-baseline gap-2 border-b border-ink/15 pb-1">
                <span className={`w-6 text-right ${i === 0 ? 'text-[var(--accent)] font-bold' : 'text-ink-soft'}`}>{i + 1}</span>
                <span className="flex-1 truncate">{s.name}</span>
                <span className="tabular-nums">
                  {s.ms} {t('scripts.duel.ms')}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
