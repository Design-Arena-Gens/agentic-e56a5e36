"use client";

import { useEffect, useRef } from 'react';
import { createChart, IChartApi, CandlestickData, Time, ISeriesApi } from 'lightweight-charts';

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export default function CandlestickChart({ data, symbol, interval }: { data: Candle[]; symbol: string; interval: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 420,
      layout: { background: { color: '#ffffff' }, textColor: '#0f172a' },
      grid: { vertLines: { color: '#e2e8f0' }, horzLines: { color: '#e2e8f0' } },
      timeScale: { timeVisible: true, borderColor: '#94a3b8' },
      rightPriceScale: { borderColor: '#94a3b8' },
      crosshair: { mode: 0 },
    });

    const series = chart.addCandlestickSeries({
      upColor: '#16a34a', downColor: '#dc2626', borderDownColor: '#dc2626', borderUpColor: '#16a34a', wickDownColor: '#dc2626', wickUpColor: '#16a34a'
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({ width: containerRef.current.clientWidth });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      try {
        if (seriesRef.current) {
          chart.removeSeries(seriesRef.current);
        }
      } catch {}
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Reset chart series when symbol/interval changes for clarity
    if (!chartRef.current || !containerRef.current) return;
    try {
      if (seriesRef.current) chartRef.current.removeSeries(seriesRef.current);
    } catch {}
    const newSeries = chartRef.current.addCandlestickSeries({
      upColor: '#16a34a', downColor: '#dc2626', borderDownColor: '#dc2626', borderUpColor: '#16a34a', wickDownColor: '#dc2626', wickUpColor: '#16a34a'
    });
    seriesRef.current = newSeries;
  }, [symbol, interval]);

  useEffect(() => {
    if (!seriesRef.current) return;
    const formatted: CandlestickData[] = (data || []).map((c) => ({
      time: (c.time as number) as Time,
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
    }));
    seriesRef.current.setData(formatted);
  }, [data]);

  return (
    <div>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 700 }}>{symbol} ? {interval} candlesticks</div>
      </div>
      <div ref={containerRef} />
    </div>
  );
}
