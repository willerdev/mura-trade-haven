import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create script element with CSP-compliant attributes
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    
    // Configure widget through data attributes
    const widgetConfig = {
      "autosize": true,
      "symbol": "BINANCE:BTCUSDT",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "save_image": false,
      "container_id": "tradingview_widget"
    };

    script.innerHTML = JSON.stringify(widgetConfig);

    // Cleanup function
    const cleanup = () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    // Append script if container exists
    if (container.current) {
      container.current.appendChild(script);
    }

    return cleanup;
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