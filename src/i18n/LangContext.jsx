import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { UI } from './ui';

// eslint-disable-next-line react-refresh/only-export-components
export const LANGS = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
];
const CODES = LANGS.map((l) => l.code);
const STORAGE_KEY = 'ronin-lang';

function detectLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (CODES.includes(saved)) return saved;
  } catch {
    // localStorage может быть недоступен (приватный режим) — просто идём дальше
  }
  const nav = (navigator.language || 'ru').slice(0, 2);
  return CODES.includes(nav) ? nav : 'en';
}

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectLang);

  const setLang = useCallback((code) => {
    setLangState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // не сохранилось — не страшно, язык всё равно переключится
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = UI.meta.title[lang];
  }, [lang]);

  const value = useMemo(() => {
    // tr: строка остаётся строкой, объект { ru, en, ja } превращается в текст на текущем языке
    const tr = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] ?? v.ru) : v);
    // t('hero.cta') — строка из словаря интерфейса; {name} в строке заменяется значением из vars
    const t = (path, vars) => {
      const node = path.split('.').reduce((o, k) => o?.[k], UI);
      let s = tr(node) ?? path;
      if (vars) for (const [k, val] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, val);
      return s;
    };
    return { lang, setLang, tr, t };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  return useContext(LangContext);
}
