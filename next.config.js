module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' https://static.tradingview.com https://www.tradingview.com;"
          },
        ],
      },
    ]
  }
} 