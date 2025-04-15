// WatchlistPreview.jsx
import React, { useState, useEffect } from 'react';
import MarketOverview from './MarketOverview';
import RecentTransactions from './RecentTransactions';

const WatchlistPreview = () => {
  const [watchlistData, setWatchlistData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('watchlist');

  useEffect(() => {
    // Simulate API call to fetch watchlist data
    const fetchWatchlistData = async () => {
      try {
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockData = [
          { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 187.54, change: 1.24, changePercent: 0.67 },
          { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.32, change: -2.18, changePercent: -0.52 },
          { id: 3, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 175.98, change: 3.42, changePercent: 1.98 },
          { id: 4, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 162.78, change: 0.34, changePercent: 0.21 },
          { id: 5, symbol: 'TSLA', name: 'Tesla Inc.', price: 248.92, change: -4.76, changePercent: -1.88 }
        ];
        
        setWatchlistData(mockData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching watchlist data:', error);
        setIsLoading(false);
      }
    };

    fetchWatchlistData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Market Dashboard</h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTab === 'watchlist' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleTabChange('watchlist')}
          >
            Watchlist
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTab === 'market' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleTabChange('market')}
          >
            Market Overview
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTab === 'transactions' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleTabChange('transactions')}
          >
            Transactions
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'watchlist' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {watchlistData.map((stock) => (
                    <tr key={stock.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${stock.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          stock.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'market' && <MarketOverview />}
          
          {activeTab === 'transactions' && <RecentTransactions />}
        </>
      )}
    </div>
  );
};

export default WatchlistPreview;