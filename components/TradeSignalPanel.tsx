"use client";

export function TradeSignalPanel({ symbol, interval, latestPrice, analysis }: { symbol: string; interval: string; latestPrice?: number; analysis: any | null }) {
  const signal = analysis?.signal ?? 'neutral';
  const color = signal === 'buy' ? '#16a34a' : signal === 'sell' ? '#dc2626' : '#334155';

  return (
    <div className="signal">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontWeight: 700 }}>Signal & Insights</div>
        <div className={`badge ${signal}`.trim()} style={{ color }}>{signal.toUpperCase()}</div>
      </div>
      <div className="small">{symbol} ? {interval}</div>

      <div className="signalRow">
        <div>Latest Price</div>
        <div style={{ fontWeight: 700 }}>{latestPrice ? `$${latestPrice.toLocaleString()}` : '?'}</div>
      </div>

      <div className="signalRow">
        <div>Pattern</div>
        <div>{analysis?.pattern ?? '?'}</div>
      </div>

      <div className="signalRow">
        <div>RSI (14)</div>
        <div>{typeof analysis?.rsi === 'number' ? analysis.rsi.toFixed(2) : '?'}</div>
      </div>

      <div className="signalRow">
        <div>SMA 20 / 50</div>
        <div>
          {typeof analysis?.sma20 === 'number' ? analysis.sma20.toFixed(2) : '?'} / {typeof analysis?.sma50 === 'number' ? analysis.sma50.toFixed(2) : '?'}
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 600 }}>Rationale</div>
        <div className="small" style={{ lineHeight: 1.5 }}>{analysis?.rationale ?? 'Waiting for stronger confirmation.'}</div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 600 }}>Risk Management</div>
        <div className="small" style={{ lineHeight: 1.5 }}>
          {analysis?.risk?.text ?? 'Use tight stops during high volatility.'}
        </div>
      </div>
    </div>
  );
}
