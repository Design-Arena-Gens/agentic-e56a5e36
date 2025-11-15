"use client";

import { useEffect, useState } from 'react';

async function fetchPrices(symbols: string[]): Promise<Record<string, number>> {
  const qs = symbols.map((s) => `symbol=${s}`).join('&');
  const res = await fetch(`/api/prices?${qs}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch prices');
  return await res.json();
}

export function PriceTicker({ symbols }: { symbols: string[] }) {
  const [prices, setPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const p = await fetchPrices(symbols);
        setPrices(p);
      } catch {}
    };
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, [symbols]);

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Live Prices</div>
      <div className="ticker">
        {symbols.map((s) => (
          <div key={s} className="tickerItem">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{s}</span>
              <span style={{ fontWeight: 700 }}>${prices[s]?.toLocaleString() ?? '?'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
