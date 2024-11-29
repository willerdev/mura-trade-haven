import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      if (container.current && window.TradingView) {
        console.log('TradingView script loaded, initializing widget');
        new window.TradingView.widget({
          container_id: container.current.id,
          width: '100%',
          height: '100%',
          symbol: 'BINANCE:BTCUSDT',
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div 
      id="tradingview_widget" 
      ref={container} 
      className="w-full h-full min-h-[400px]"
    />
  );
};

export default TradingViewChart;