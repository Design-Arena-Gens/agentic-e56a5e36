import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = searchParams.getAll('symbol');
  if (!symbols.length) {
    return new Response(JSON.stringify({ error: 'No symbols' }), { status: 400 });
  }
  try {
    // Binance price ticker endpoint
    // GET /api/v3/ticker/price?symbol=BTCUSDT
    const results: Record<string, number> = {};
    await Promise.all(symbols.map(async (s) => {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${s}`, { next: { revalidate: 0 } });
      if (!res.ok) throw new Error(`Failed to fetch price for ${s}`);
      const j = await res.json();
      results[s] = Number(j.price);
    }));
    return new Response(JSON.stringify(results), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'Error' }), { status: 500 });
  }
}
