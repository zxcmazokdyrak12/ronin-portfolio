// Свежие коммиты из моих репозиториев. Ответ кэшируется на CDN Vercel на 15 минут,
// поэтому GitHub API дёргается редко и в лимиты без токена мы не упираемся
const OWNER = 'zxcmazokdyrak12';
const REPOS = ['chainsaw-chat', 'vagabond-anime-tracker', 'ronin-portfolio', 'the-mandela-catalogue', 'mainline'];
const LIMIT = 10;

async function repoCommits(repo, headers) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${repo}/commits?per_page=8`, { headers });
  if (!res.ok) throw new Error(`${repo}: ${res.status}`);
  const list = await res.json();
  return list.map((c) => ({
    repo,
    sha: c.sha.slice(0, 7),
    message: c.commit.message.split('\n')[0].slice(0, 120),
    date: c.commit.author?.date ?? c.commit.committer?.date,
    url: c.html_url,
  }));
}

export default async function handler(req, res) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'ronin-portfolio' };
  // Токен необязателен: с ним лимит GitHub выше
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const settled = await Promise.allSettled(REPOS.map((repo) => repoCommits(repo, headers)));
  settled.filter((s) => s.status === 'rejected').forEach((s) => console.error('commits api:', s.reason?.message));

  const commits = settled
    .flatMap((s) => (s.status === 'fulfilled' ? s.value : []))
    .filter((c) => !c.message.startsWith('Merge '))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, LIMIT);

  if (!commits.length) return res.status(502).json({ error: 'github_unavailable' });

  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
  return res.status(200).json({ commits });
}
