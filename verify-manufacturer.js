// Vercel serverless function: keeps manufacturer API credentials on the server.
// Configure MANUFACTURER_API_URL and MANUFACTURER_API_KEY in Vercel Project Settings.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ verified: null, message: 'Method not allowed' });
  }

  const upstreamUrl = process.env.MANUFACTURER_API_URL;
  const apiKey = process.env.MANUFACTURER_API_KEY;
  if (!upstreamUrl || !apiKey) {
    return res.status(503).json({
      verified: null,
      configured: false,
      message: '제조사 공식 API가 아직 연결되지 않았습니다.'
    });
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body || {})
    });
    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(502).json({ verified: null, message: '제조사 검증 서비스에서 정상 응답을 받지 못했습니다.' });
    }
    // The connected provider must explicitly return a boolean `verified` field.
    if (typeof data.verified !== 'boolean') {
      return res.status(502).json({ verified: null, message: '제조사 응답 형식에 verified(boolean) 값이 없습니다.' });
    }
    return res.status(200).json({ verified: data.verified, reference: data.reference || null, message: data.message || null });
  } catch (error) {
    return res.status(502).json({ verified: null, message: '제조사 검증 서비스 연결에 실패했습니다.' });
  }
}
