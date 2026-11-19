// Regex Blade: срезает отладочный мусор из кода.
// Работает построчно, чтобы потом показать, какие строки срублены, а какие остались.
// Ограничение честное: регулярки не считают скобки, поэтому многострочный console.log( не возьмут.

const RULES = [
  // console.error и console.warn не трогаем — их обычно пишут специально
  { tag: 'console', re: /^\s*console\.(log|debug|info|trace|table|dir|time|timeEnd|count)\(.*\);?\s*$/ },
  { tag: 'debugger', re: /^\s*debugger;?\s*$/ },
];

export function regexBlade(code) {
  let trimmed = 0;
  const lines = [];
  let prevKeptBlank = false;

  for (const raw of code.replace(/\r\n?/g, '\n').split('\n')) {
    const rule = RULES.find((r) => r.re.test(raw));
    if (rule) {
      lines.push({ text: raw, cut: rule.tag });
      continue;
    }

    // Пробелы и табы в конце строки
    const text = raw.replace(/[ \t]+$/, '');
    if (text !== raw) trimmed += 1;

    // Две и больше пустых строк подряд схлопываем в одну
    const blank = text.trim() === '';
    if (blank && prevKeptBlank) {
      lines.push({ text, cut: 'blank' });
      continue;
    }
    lines.push({ text, cut: null, trimmed: text !== raw });
    prevKeptBlank = blank;
  }

  return {
    lines,
    result: lines
      .filter((l) => !l.cut)
      .map((l) => l.text)
      .join('\n'),
    cut: lines.filter((l) => l.cut).length,
    trimmed,
  };
}

// Пример грязного кода. Собран из строк, чтобы хвостовые пробелы не съел редактор
export const SAMPLE_CODE = [
  'function fetchAnime(id) {',
  "  console.log('fetching', id);",
  '  debugger;',
  '  const url = `/api/anime/${id}`;' + '   ',
  "  console.debug('url =', url);",
  '',
  '',
  '',
  '  return fetch(url)' + '\t',
  '    .then((res) => res.json())',
  '    .catch((err) => console.error(err));',
  '}',
].join('\n');
