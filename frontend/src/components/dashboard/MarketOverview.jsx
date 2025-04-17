// MarketOverview.jsx
import React, { useState, useEffect } from 'react';
import AppNavbar from "../common/Navbar"

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
    <AppNavbar /> 
    {marketData.isLoading ? (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "12rem" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : (
      <div className="mb-4">
        <div className="mb-4">
          <h3 className="h5 fw-medium text-dark mb-3">Major Indices</h3>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {marketData.indices.map((index) => (
              <div key={index.id} className="col">
                <div className="card h-100 bg-light border-0 shadow-sm">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="fs-6 fw-medium text-secondary">{index.name}</span>
                      <span className={`badge ${
                        index.change >= 0 ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'
                      }`}>
                        {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="fs-4 fw-bold text-dark">{index.value.toLocaleString()}</div>
                    <div className="small text-secondary">
                      {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} pts
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="h5 fw-medium text-dark mb-3">Sector Performance</h3>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {marketData.sectors.map((sector, index) => (
                <div key={sector.id} className={`d-flex align-items-center p-3 ${
                  index < marketData.sectors.length - 1 ? 'border-bottom' : ''
                }`}>
                  <div className="col-4 fs-6 fw-medium text-secondary">{sector.name}</div>
                  <div className="col-8">
                    <div className="d-flex align-items-center">
                      <div className="progress flex-grow-1 me-2" style={{ height: "0.625rem" }}>
                        <div 
                          className={`progress-bar ${sector.performance >= 0 ? 'bg-success' : 'bg-danger'}`}
                          style={{ 
                            width: `${Math.min(Math.abs(sector.performance) * 10, 100)}%`,
                            marginLeft: sector.performance < 0 ? 'auto' : '0'
                          }}
                          aria-valuenow={Math.abs(sector.performance) * 10}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                        </div>
                      </div>
                      <span className={`small fw-medium ${
                        sector.performance >= 0 ? 'text-success' : 'text-danger'
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
      </div>
    )}
  </div>
  );
};

export default MarketOverview;