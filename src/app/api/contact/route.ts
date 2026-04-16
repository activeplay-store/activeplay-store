export async function POST(request: Request) {
  const body = await request.json();
  const token = process.env.CHATWOOT_API_TOKEN || '';

  const res = await fetch('https://chat.activeplay.games/api/v1/accounts/1/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api_access_token': token },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
