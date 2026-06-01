export async function onRequest(context) {
  const { request, env } = context;

  // Strip the /api/web-service prefix: /api/web-service/search → https://api.web-service.com/search
  const url = new URL(request.url);
  const targetUrl = `https://api.nal.usda.gov${url.pathname.replace('/api/web-service', '')}`;

  try {
    return await fetch(targetUrl, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${env.VITE_USDA_API_KEY}`,
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