// Все подписи интерфейса на трёх языках. Тексты проектов — в data/projects.json
export const UI = {
  meta: {
    title: {
      ru: 'Путь Ронина — портфолио фуллстак-разработчика',
      en: 'The Way of the Ronin — full-stack developer portfolio',
      ja: '浪人の道 — フルスタック開発者のポートフォリオ',
    },
  },

  nav: {
    home: { ru: 'Ронин', en: 'Ronin', ja: '浪人' },
    map: { ru: 'Карта', en: 'Map', ja: '地図' },
    projects: { ru: 'Проекты', en: 'Projects', ja: '作品' },
    arsenal: { ru: 'Арсенал', en: 'Arsenal', ja: '武器庫' },
    contact: { ru: 'Связь', en: 'Contact', ja: '連絡' },
    language: { ru: 'Язык', en: 'Language', ja: '言語' },
  },

  hero: {
    eyebrow: { ru: 'Фуллстак-разработчик · {hour}', en: 'Full-stack developer · {hour}', ja: 'フルスタック開発者 · {hour}' },
    title1: { ru: 'Путь', en: 'The Way', ja: '浪人' },
    title2: { ru: 'Ронина', en: 'of the Ronin', ja: 'の道' },
    desc: {
      ru: 'Пишу фуллстак на React, Node.js и PostgreSQL — от сокетов до анимаций. В свободное время делаю PSX-хорроры на Unity. Каждый проект — отдельный поединок.',
      en: 'I build full-stack apps with React, Node.js and PostgreSQL — from sockets to animations. In my spare time I make PSX horror games in Unity. Every project is its own duel.',
      ja: 'React・Node.js・PostgreSQLでフルスタック開発をしています。ソケットからアニメーションまで。空いた時間にはUnityでPSX風ホラーゲームを作っています。プロジェクトはひとつひとつが真剣勝負です。',
    },
    cta: { ru: 'Смотреть проекты', en: 'See projects', ja: '作品を見る' },
    stats: [
      { value: '2', label: { ru: 'фуллстак-приложения в проде', en: 'full-stack apps in production', ja: '本番稼働中のフルスタックアプリ' } },
      { value: '1', label: { ru: 'игра на itch.io', en: 'game on itch.io', ja: 'itch.ioで公開中のゲーム' } },
      { value: '∞', label: { ru: 'правок на пути меча', en: 'refactors on the way of the sword', ja: '剣の道の推敲' } },
    ],
  },

  // Двенадцать страж — по старояпонскому счёту, начиная с Часа Крысы (23:00)
  hours: {
    ru: ['Час Крысы', 'Час Быка', 'Час Тигра', 'Час Кролика', 'Час Дракона', 'Час Змеи', 'Час Лошади', 'Час Козы', 'Час Обезьяны', 'Час Петуха', 'Час Собаки', 'Час Свиньи'],
    en: ['Hour of the Rat', 'Hour of the Ox', 'Hour of the Tiger', 'Hour of the Rabbit', 'Hour of the Dragon', 'Hour of the Snake', 'Hour of the Horse', 'Hour of the Goat', 'Hour of the Monkey', 'Hour of the Rooster', 'Hour of the Dog', 'Hour of the Boar'],
    ja: ['子の刻', '丑の刻', '寅の刻', '卯の刻', '辰の刻', '巳の刻', '午の刻', '未の刻', '申の刻', '酉の刻', '戌の刻', '亥の刻'],
  },

  sections: {
    map: {
      title: { ru: 'Карта похода', en: 'Campaign map', ja: '旅の地図' },
      caption: { ru: 'Каждая печать — место, где был бой', en: 'Every seal marks a place where a battle was fought', ja: '印のひとつひとつが戦いの地' },
    },
    projects: {
      title: { ru: 'Проекты', en: 'Projects', ja: '作品' },
      caption: { ru: 'В проде, с кодом в открытом доступе', en: 'In production, with open source code', ja: '本番稼働中・ソースコード公開' },
    },
    arsenal: {
      title: { ru: 'Арсенал', en: 'Arsenal', ja: '武器庫' },
      caption: { ru: 'Чем пользуюсь в реальных проектах', en: 'What I actually use in real projects', ja: '実際のプロジェクトで使っている技術' },
    },
    workshop: {
      title: { ru: 'Мастерская', en: 'Workshop', ja: '工房' },
    },
  },

  contact: {
    before: { ru: 'Ищу додзё, где можно ', en: 'Looking for a dojo where I can ', ja: '' },
    accent: { ru: 'расти', en: 'grow', ja: '成長' },
    after: { ru: '.', en: '.', ja: 'できる道場を探しています。' },
    text: {
      ru: 'Открыт к стажировкам и junior-позициям во фронтенде и фуллстаке. Код и игры — по ссылкам ниже.',
      en: 'Open to internships and junior roles in frontend and full-stack. Code and games are linked below.',
      ja: 'フロントエンド・フルスタックのインターンやジュニア職を探しています。コードとゲームは下のリンクから。',
    },
  },

  footer: {
    dedication: { ru: 'Для Наюты и чистого кода', en: 'For Nayuta and clean code', ja: 'ナユタときれいなコードのために' },
    map: { ru: 'Карта: J. H. Colton, 1855', en: 'Map: J. H. Colton, 1855', ja: '地図：J・H・コルトン、1855年' },
  },

  map: {
    alt: { ru: 'Старинная карта Японии, 1855', en: 'Antique map of Japan, 1855', ja: '1855年の日本古地図' },
    hint: { ru: 'Нажми на печать', en: 'Click a seal', ja: '印を押してみて' },
  },

  project: {
    demo: { ru: 'Демо', en: 'Demo', ja: 'デモ' },
    code: { ru: 'Код', en: 'Code', ja: 'コード' },
    unroll: { ru: 'Развернуть свиток', en: 'Unroll the scroll', ja: '巻物を開く' },
    inside: { ru: 'Что внутри', en: "What's inside", ja: '中身' },
    openDemo: { ru: 'Открыть демо', en: 'Open demo', ja: 'デモを開く' },
    repo: { ru: 'Репозиторий', en: 'Repository', ja: 'リポジトリ' },
    stack: { ru: 'Стек', en: 'Stack', ja: '技術スタック' },
    close: { ru: 'Закрыть', en: 'Close', ja: '閉じる' },
  },

  chat: {
    rev: { ru: 'Завести бензопилу', en: 'Start the chainsaw', ja: 'チェンソーを起動' },
    code: { ru: 'Код ›', en: 'Code ›', ja: 'コード ›' },
    fullScroll: { ru: 'Весь свиток', en: 'Full scroll', ja: '巻物を読む' },
  },

  tracker: {
    cutHint: { ru: 'Проведи мышью по карточке — разруби её', en: 'Drag across the card to cut it', ja: 'カードをなぞって斬れ' },
    enterTitle: { ru: 'Войти в додзё', en: 'Enter the dojo', ja: '道場に入る' },
    enter: { ru: 'Войти', en: 'Enter', ja: '入る' },
    source: { ru: 'Исходный код', en: 'Source code', ja: 'ソースコード' },
    scroll: { ru: 'Свиток', en: 'Scroll', ja: '巻物' },
    scrollsTitle: { ru: 'Свитки из додзё', en: 'Scrolls from the dojo', ja: '道場の巻物' },
    scrollsHint: {
      ru: 'наведи — проступит цвет, нажми — развернётся',
      en: 'hover to bring out the color, click to unroll',
      ja: '触れると色が浮かび、押すと広がる',
    },
    openShot: { ru: 'Открыть скриншот: {name}', en: 'Open screenshot: {name}', ja: 'スクリーンショットを開く：{name}' },
    shotAlt: { ru: 'Скриншот трекера: {name}', en: 'Tracker screenshot: {name}', ja: 'トラッカーの画面：{name}' },
    shots: {
      gate: { ru: 'Врата', en: 'The gate', ja: '入口' },
      scrolls: { ru: 'Мои свитки', en: 'My scrolls', ja: 'マイ巻物' },
      path: { ru: 'Путь', en: 'The path', ja: '道のり' },
      night: { ru: 'Ночная тема', en: 'Night theme', ja: '夜モード' },
    },
    pagesTitle: { ru: 'Страницы манги', en: 'Manga pages', ja: '漫画の頁' },
    pagesHint: { ru: 'Рисунки, из которых вырос трекер', en: 'The art the tracker grew out of', ja: 'このトラッカーが生まれた絵' },
    pagesAlt: { ru: 'Иллюстрация из манги «Бродяга»', en: 'Illustration from the Vagabond manga', ja: '漫画『バガボンド』の絵' },
    credit: { ru: '«Бродяга» © Такэхико Иноуэ', en: 'Vagabond © Takehiko Inoue', ja: '『バガボンド』© 井上雄彦' },
  },

  mandela: {
    ticker: {
      ru: 'ЭКСТРЕННОЕ ОПОВЕЩЕНИЕ · Если вы видите кого-то, кто выглядит как вы, — не открывайте дверь · Не смотрите на них · Оставайтесь дома · ',
      en: 'EMERGENCY ALERT · If you see someone who looks like you, do not open the door · Do not look at them · Stay indoors · ',
      ja: '緊急警報 · 自分にそっくりな誰かを見ても、扉を開けないでください · 目を合わせないで · 屋内にとどまってください · ',
    },
    hint: { ru: 'Двигай мышью — это фонарик', en: 'Move the mouse — it’s a flashlight', ja: 'マウスを動かして — それが懐中電灯' },
    menu: {
      newTape: { ru: 'играть на itch.io', en: 'play on itch.io', ja: 'itch.ioで遊ぶ' },
      continue: { ru: 'исходный код', en: 'source code', ja: 'ソースコード' },
      settings: { ru: 'стек', en: 'stack', ja: '技術スタック' },
      credits: { ru: 'весь свиток', en: 'full scroll', ja: '巻物を読む' },
      goodbye: { ru: 'не нажимай', en: 'don’t press', ja: '押すな' },
    },
    tapes: { ru: 'Кассеты', en: 'Tapes', ja: 'テープ' },
    tapesHint: { ru: 'нажми, чтобы посмотреть', en: 'click to watch', ja: '押して再生' },
    tapeAlt: { ru: 'Кадр из игры: {name}', en: 'Game screenshot: {name}', ja: 'ゲーム画面：{name}' },
    tapeNames: {
      living: { ru: 'гостиная, день 2', en: 'living room, day 2', ja: 'リビング・2日目' },
      garage: { ru: 'гараж, ночь 3', en: 'garage, night 3', ja: 'ガレージ・3日目の夜' },
      hallway: { ru: 'коридор, ночь 1', en: 'hallway, night 1', ja: '廊下・1日目の夜' },
    },
    ended: { ru: 'кассета закончилась', en: 'tape ended', ja: 'テープ終了' },
    logoAlt: { ru: 'Логотип игры The Mandela Catalogue', en: 'The Mandela Catalogue game logo', ja: 'The Mandela Catalogueのロゴ' },
  },

  arsenal: [
    { kanji: '表', title: { ru: 'Фронтенд', en: 'Frontend', ja: 'フロントエンド' }, items: ['React', 'TypeScript', 'JavaScript', 'Vite', 'Tailwind CSS', 'Framer Motion'] },
    { kanji: '裏', title: { ru: 'Бэкенд', en: 'Backend', ja: 'バックエンド' }, items: ['Node.js', 'Express', 'Socket.io', 'REST API', 'Passport.js', 'OAuth 2.0 / JWT'] },
    {
      kanji: '蔵',
      title: { ru: 'Данные', en: 'Data', ja: 'データ' },
      items: ['PostgreSQL', { ru: 'Чистый SQL (pg)', en: 'Raw SQL (pg)', ja: '生SQL（pg）' }, 'Prisma ORM', 'Neon'],
    },
    {
      kanji: '舞',
      title: { ru: 'Деплой и прочее', en: 'Deploy & more', ja: 'デプロイほか' },
      items: ['Vercel', 'Render', 'Git / GitHub', 'Unity + C#', { ru: 'Django (учёба)', en: 'Django (coursework)', ja: 'Django（授業）' }],
    },
  ],

  scripts: {
    repaint: { ru: 'Перекрасить сайт', en: 'Repaint the site', ja: 'サイトを塗り替える' },
    reset: { ru: 'Вернуть киноварь', en: 'Restore vermilion', ja: '朱色に戻す' },
    now: { ru: 'Сейчас: {hour}', en: 'Now: {hour}', ja: '今：{hour}' },
    soon: { ru: 'В ножнах · скоро', en: 'Sheathed · soon', ja: '鞘の中・近日' },
  },
};
