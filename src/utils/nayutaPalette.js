// Набор «базовых» оттенков, которые нравятся Наюте: розовый, бирюзовый, золотой, лавандовый, коралловый, зелёный
const HUES = [330, 180, 45, 270, 15, 120];

// По умолчанию — киноварь, цвет японской печати
export const DEFAULT_PALETTE = { hue: 352, accent: '#c8102e' };

export const generateNayutaPalette = (currentHue) => {
  // Не выдаём тот же цвет два раза подряд — иначе кажется, что кнопка не сработала
  const pool = HUES.filter((h) => h !== currentHue);
  const hue = pool[Math.floor(Math.random() * pool.length)];

  // Акцент должен читаться на светлой бумаге, поэтому держим его насыщенным и не слишком светлым
  return { hue, accent: `hsl(${hue}, 80%, 40%)` };
};
