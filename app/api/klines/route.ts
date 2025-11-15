import { NextRequest } from 'next/server';
import { generateSignal, type Candle } from '@/lib/analysis';

export const dynamic = 'force-dynamic';

const BINANCE_URL = 'https://api.binance.com/api/v3/klines';

function mapBinanceKline(arr: any[]): Candle {
  return {
    time: Math.floor(Number(arr[0]) / 1000),
    open: Number(arr[1]),
    high: Number(arr[2]),
    low: Number(arr[3]),
    close: Number(arr[4]),
    volume: Number(arr[5]),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const interval = searchParams.get('interval') || '1m';
  const limit = Number(searchParams.get('limit') || '300');

  try {
    const url = `${BINANCE_URL}?symbol=${symbol}&interval=${interval}&limit=${Math.max(100, Math.min(limit, 500))}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch klines');
    const j = (await res.json()) as any[];
    const candles: Candle[] = j.map(mapBinanceKline);

    const analysis = generateSignal(candles);

    return new Response(JSON.stringify({ candles, analysis }), { headers: { 'content-type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? 'Error' }), { status: 500 });
  }
}
