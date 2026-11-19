import { neon } from '@neondatabase/serverless';

// Имя: буквы любого алфавита, цифры, пробел, точка, дефис и подчёркивание — до 20 символов
const NAME_RE = /^[\p{L}\p{N} ._-]{1,20}$/u;
// Быстрее 100 мс человек физически не реагирует, медленнее 1,5 с — уже не дуэль
const MIN_MS = 100;
const MAX_MS = 1500;

function readBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body || '{}');
    } catch {
      return {};
    }
  }
  return req.body ?? {};
}

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: 'db_not_configured' });
  }
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      // Лучший результат каждого бойца, десять быстрейших
      const scores = await sql`
        SELECT name, MIN(ms)::int AS ms
        FROM duel_scores
        GROUP BY name
        ORDER BY ms ASC
        LIMIT 10`;
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ scores });
    }

    if (req.method === 'POST') {
      const body = readBody(req);
      const name = String(body.name ?? '').trim().replace(/\s+/g, ' ');
      const ms = Number(body.ms);

      if (!NAME_RE.test(name)) return res.status(400).json({ error: 'bad_name' });
      if (!Number.isInteger(ms) || ms < MIN_MS || ms > MAX_MS) return res.status(400).json({ error: 'bad_ms' });

      // Простая защита от спама: одно имя — не чаще раза в 3 секунды
      const recent = await sql`
        SELECT 1 FROM duel_scores
        WHERE name = ${name} AND created_at > now() - interval '3 seconds'
        LIMIT 1`;
      if (recent.length) return res.status(429).json({ error: 'too_fast' });

      await sql`INSERT INTO duel_scores (name, ms) VALUES (${name}, ${ms})`;

      // Место считаем по лучшим результатам бойцов
      const [{ rank }] = await sql`
        SELECT COUNT(*)::int + 1 AS rank
        FROM (SELECT name, MIN(ms) AS best FROM duel_scores GROUP BY name) b
        WHERE b.best < ${ms} AND b.name <> ${name}`;
      return res.status(201).json({ ok: true, rank });
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (err) {
    console.error('duel api error:', err);
    return res.status(500).json({ error: 'server_error' });
  }
}
