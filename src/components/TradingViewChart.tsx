import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: any) => any;
    };
  }
}

const TradingViewChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const initializeWidget = () => {
      if (!containerRef.current || !window.TradingView) {
        console.log('TradingView or container not available');
        return;
      }

      try {
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }

        const widgetOptions = {
          autosize: true,
          symbol: 'BINANCE:BTCUSDT',
          interval: '1',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart'
        };

        widgetRef.current = new window.TradingView.widget(widgetOptions);
        console.log('TradingView widget initialized successfully');
      } catch (error) {
        console.error('Failed to initialize TradingView widget:', error instanceof Error ? error.message : 'Unknown error');
      }
    };

    if (!window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initializeWidget;
      script.onerror = () => console.error('Failed to load TradingView script');
      document.head.appendChild(script);
    } else {
      initializeWidget();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      widgetRef.current = null;
    };
  }, []);

  return (
    <div ref={containerRef} id="tradingview_chart" className="w-full h-full glass" />
  );
};

export default TradingViewChart;