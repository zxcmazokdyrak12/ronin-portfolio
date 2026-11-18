// В древней Японии стражи менялись каждые 2 часа, начиная с 23:00 (Час Крысы).
// Возвращаем номер стражи 0–11, а название на нужном языке берётся из словаря UI.hours
export const getSamuraiHourIndex = (date = new Date()) => Math.floor(((date.getHours() + 1) % 24) / 2);
