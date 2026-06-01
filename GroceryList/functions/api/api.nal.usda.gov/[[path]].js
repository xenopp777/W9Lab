export async function onRequest(context) {
  const { request, env } = context;

  // Strip the /api/api.nal.usda.gov prefix and append API key as query param
  const url = new URL(request.url);
  const targetUrl = new URL(`https://api.nal.usda.gov${url.pathname.replace('/api/api.nal.usda.gov', '')}`);
  targetUrl.searchParams.append('api_key', env.VITE_USDA_API_KEY);

  try {
    return await fetch(targetUrl.toString(), {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.method === 'GET' ? undefined : await request.text(),
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
