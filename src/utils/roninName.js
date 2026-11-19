// Генератор имени ронина. Имя выводится из ника хешем, поэтому один ник — всегда одно имя.

const FAMILY = [
  { kanji: '黒川', kana: 'くろかわ', romaji: 'Kurokawa', ru: 'Чёрная река', en: 'Black River' },
  { kanji: '風間', kana: 'かざま', romaji: 'Kazama', ru: 'Меж ветров', en: 'Between the Winds' },
  { kanji: '月島', kana: 'つきしま', romaji: 'Tsukishima', ru: 'Лунный остров', en: 'Moon Island' },
  { kanji: '霧島', kana: 'きりしま', romaji: 'Kirishima', ru: 'Туманный остров', en: 'Misty Island' },
  { kanji: '鬼塚', kana: 'おにづか', romaji: 'Onizuka', ru: 'Курган демона', en: 'Demon’s Mound' },
  { kanji: '白鳥', kana: 'しらとり', romaji: 'Shiratori', ru: 'Белая птица', en: 'White Bird' },
  { kanji: '雪村', kana: 'ゆきむら', romaji: 'Yukimura', ru: 'Снежная деревня', en: 'Snow Village' },
  { kanji: '神谷', kana: 'かみや', romaji: 'Kamiya', ru: 'Долина богов', en: 'Valley of the Gods' },
  { kanji: '桜井', kana: 'さくらい', romaji: 'Sakurai', ru: 'Колодец сакуры', en: 'Cherry Well' },
  { kanji: '影山', kana: 'かげやま', romaji: 'Kageyama', ru: 'Гора теней', en: 'Shadow Mountain' },
  { kanji: '石田', kana: 'いしだ', romaji: 'Ishida', ru: 'Каменное поле', en: 'Stone Field' },
  { kanji: '竹内', kana: 'たけうち', romaji: 'Takeuchi', ru: 'В бамбуковой роще', en: 'Within the Bamboo' },
];

const GIVEN = [
  { kanji: '迅', kana: 'じん', romaji: 'Jin', ru: 'Стремительный', en: 'Swift' },
  { kanji: '嵐', kana: 'あらし', romaji: 'Arashi', ru: 'Буря', en: 'Storm' },
  { kanji: '蓮', kana: 'れん', romaji: 'Ren', ru: 'Лотос', en: 'Lotus' },
  { kanji: '隼人', kana: 'はやと', romaji: 'Hayato', ru: 'Человек-сокол', en: 'Falcon Man' },
  { kanji: '静', kana: 'しずか', romaji: 'Shizuka', ru: 'Тишина', en: 'Quiet' },
  { kanji: '朧', kana: 'おぼろ', romaji: 'Oboro', ru: 'Дымка', en: 'Haze' },
  { kanji: '灯', kana: 'あかり', romaji: 'Akari', ru: 'Огонёк', en: 'Little Light' },
  { kanji: '鋼', kana: 'はがね', romaji: 'Hagane', ru: 'Сталь', en: 'Steel' },
  { kanji: '凛', kana: 'りん', romaji: 'Rin', ru: 'Строгий', en: 'Dignified' },
  { kanji: '翔', kana: 'しょう', romaji: 'Shō', ru: 'Парящий', en: 'Soaring' },
  { kanji: '刹那', kana: 'せつな', romaji: 'Setsuna', ru: 'Мгновение', en: 'Instant' },
  { kanji: '雷', kana: 'らい', romaji: 'Rai', ru: 'Гром', en: 'Thunder' },
];

const EPITHETS = [
  { ru: 'Ронин тихого клинка', en: 'Ronin of the Silent Blade', ja: '静かなる刃の浪人' },
  { ru: 'Ронин десяти тысяч коммитов', en: 'Ronin of Ten Thousand Commits', ja: '一万コミットの浪人' },
  { ru: 'Ронин последней точки с запятой', en: 'Ronin of the Last Semicolon', ja: '最後のセミコロンの浪人' },
  { ru: 'Ронин полуночного деплоя', en: 'Ronin of the Midnight Deploy', ja: '真夜中のデプロイの浪人' },
  { ru: 'Ронин несломанной сборки', en: 'Ronin of the Unbroken Build', ja: '折れぬビルドの浪人' },
  { ru: 'Ронин бесконечного рефакторинга', en: 'Ronin of the Endless Refactor', ja: '終わりなきリファクタの浪人' },
  { ru: 'Ронин мержа без конфликтов', en: 'Ronin of the Conflict-free Merge', ja: '衝突なきマージの浪人' },
  { ru: 'Ронин, читающий логи', en: 'Ronin Who Reads the Logs', ja: 'ログを読む浪人' },
];

// FNV-1a: быстрый 32-битный хеш строки
function fnv1a(str) {
  let h = 0x811c9dc5;
  for (const ch of str) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function roninName(nickname) {
  const key = nickname.trim().toLowerCase();
  if (!key) return null;
  const h = fnv1a(key);
  // Разные «срезы» хеша, чтобы фамилия, имя и прозвище выбирались независимо
  const family = FAMILY[h % FAMILY.length];
  const given = GIVEN[Math.floor(h / FAMILY.length) % GIVEN.length];
  const epithet = EPITHETS[fnv1a(key + '#') % EPITHETS.length];
  return { family, given, epithet };
}
