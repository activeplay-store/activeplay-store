export async function POST(request: Request) {
  // Auth check
  if (process.env.INDEXNOW_SECRET) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${process.env.INDEXNOW_SECRET}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const { urls } = await request.json();
  const key = 'activeplay2026indexnow';
  const host = 'https://activeplay.games';
  const keyLocation = `${host}/${key}.txt`;

  const urlList = Array.isArray(urls) ? urls : [urls];

  const body = {
    host: 'activeplay.games',
    key,
    keyLocation,
    urlList: urlList.map((u: string) => (u.startsWith('http') ? u : `${host}${u}`)),
  };

  const results = await Promise.allSettled([
    fetch('https://yandex.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
    fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  ]);

  return Response.json({
    success: true,
    submitted: urlList.length,
    results: results.map((r) => (r.status === 'fulfilled' ? r.value.status : 'failed')),
  });
}
