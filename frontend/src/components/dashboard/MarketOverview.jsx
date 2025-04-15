// MarketOverview.jsx
import React, { useState, useEffect } from 'react';

const MarketOverview = () => {
  const [marketData, setMarketData] = useState({
    indices: [],
    sectors: [],
    isLoading: true
  });

  useEffect(() => {
    // Simulate API call to fetch market data
    const fetchMarketData = async () => {
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockIndices = [
          { id: 1, name: 'S&P 500', value: 5235.48, change: 15.23, changePercent: 0.29 },
          { id: 2, name: 'NASDAQ', value: 16421.28, change: 85.42, changePercent: 0.52 },
          { id: 3, name: 'DOW JONES', value: 38976.08, change: -32.45, changePercent: -0.08 },
          { id: 4, name: 'RUSSELL 2000', value: 2078.36, change: 4.52, changePercent: 0.22 }
        ];
        
        const mockSectors = [
          { id: 1, name: 'Technology', performance: 2.34 },
          { id: 2, name: 'Healthcare', performance: 0.87 },
          { id: 3, name: 'Financials', performance: -0.45 },
          { id: 4, name: 'Consumer Discretionary', performance: 1.21 },
          { id: 5, name: 'Energy', performance: -1.76 },
          { id: 6, name: 'Materials', performance: 0.32 }
        ];
        
        setMarketData({
          indices: mockIndices,
          sectors: mockSectors,
          isLoading: false
        });
      } catch (error) {
        console.error('Error fetching market data:', error);
        setMarketData(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div>
      {marketData.isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Major Indices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.indices.map((index) => (
                <div key={index.id} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-600">{index.name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      index.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-xl font-bold text-gray-800">{index.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} pts
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Sector Performance</h3>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {marketData.sectors.map((sector) => (
                <div key={sector.id} className="flex items-center p-3 border-b border-gray-100 last:border-b-0">
                  <div className="w-1/3 text-sm font-medium text-gray-700">{sector.name}</div>
                  <div className="w-2/3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className={`h-2.5 rounded-full ${sector.performance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ 
                            width: `${Math.min(Math.abs(sector.performance) * 10, 100)}%`,
                            marginLeft: sector.performance < 0 ? 'auto' : '0'
                          }}
                        >
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${
                        sector.performance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {sector.performance >= 0 ? '+' : ''}{sector.performance.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketOverview;