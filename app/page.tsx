"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { PriceTicker } from '@/components/PriceTicker';
import { TradeSignalPanel } from '@/components/TradeSignalPanel';

const CandlestickChart = dynamic(() => import('@/components/CandlestickChart'), {
  ssr: false,
});

const DEFAULT_SYMBOL = 'BTCUSDT';
const DEFAULT_INTERVAL = '1m';

const SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT'];
const INTERVALS = ['1m', '3m', '5m', '15m', '30m', '1h', '4h', '1d'];

export default function Page() {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [interval, setInterval] = useState<string>(DEFAULT_INTERVAL);
  const [candles, setCandles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const fetchKlines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/klines?symbol=${symbol}&interval=${interval}&limit=300`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch klines');
      const data = await res.json();
      setCandles(data.candles);
      setAnalysis(data.analysis);
    } catch (e: any) {
      setError(e.message ?? 'Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  useEffect(() => {
    fetchKlines();
    const id = window.setInterval(() => { void fetchKlines(); }, 5000);
    return () => window.clearInterval(id);
  }, [fetchKlines]);

  const latestPrice = useMemo(() => {
    if (!candles.length) return undefined;
    const c = candles[candles.length - 1];
    return Number(c.close);
  }, [candles]);

  return (
    <div className="container">
      <div className="header">
        <div className="title">Crypto Live Dashboard</div>
        <div className="controls">
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {SYMBOLS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={interval} onChange={(e) => setInterval(e.target.value)}>
            {INTERVALS.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <button className="primary" onClick={fetchKlines}>Refresh</button>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <CandlestickChart data={candles} symbol={symbol} interval={interval} />
        </div>
        <div className="card">
          <TradeSignalPanel symbol={symbol} interval={interval} latestPrice={latestPrice} analysis={analysis} />
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <PriceTicker symbols={["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT"]} />
      </div>

      {loading && <div className="small" style={{ marginTop: 8 }}>Loading latest data?</div>}
      {error && <div className="small" style={{ color: '#dc2626', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
