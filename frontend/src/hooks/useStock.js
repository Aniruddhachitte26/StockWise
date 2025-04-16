// src/hooks/useStock.js

import { useState, useCallback } from 'react';
import axios from 'axios';

// Custom hook for stock-related functionality
const useStock = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [topStocks, setTopStocks] = useState([]);
  const [marketSummary, setMarketSummary] = useState(null);
  const [marketNews, setMarketNews] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // API URL - replace with your actual backend URL
  const API_URL = 'http://localhost:3000';

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch stock details
  const fetchStockDetails = useCallback(async (symbol) => {
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll return mock data
      // In a real app, you would make an API call
      // const response = await axios.get(`${API_URL}/api/stocks/${symbol}`);
      
      // Mock data
      const mockData = {
        symbol: symbol,
        name: `${symbol} Corporation`,
        price: 156.78,
        change: 2.45,
        percentChange: 1.59,
        exchange: 'NASDAQ',
        description: `${symbol} is a leading company in its industry, focusing on innovation and growth.`,
        lastUpdated: '15 April 2025, 10:30 AM EST',
        chartData: {
          '1D': Array.from({ length: 24 }, (_, i) => ({
            date: `${i}:00`,
            price: 150 + Math.random() * 15
          })),
          '1W': Array.from({ length: 7 }, (_, i) => ({
            date: `Day ${i+1}`,
            price: 145 + Math.random() * 20
          })),
          '1M': Array.from({ length: 30 }, (_, i) => ({
            date: `Day ${i+1}`,
            price: 140 + Math.random() * 25
          })),
          '3M': Array.from({ length: 12 }, (_, i) => ({
            date: `Week ${i+1}`,
            price: 135 + Math.random() * 30
          })),
          '1Y': Array.from({ length: 12 }, (_, i) => ({
            date: `Month ${i+1}`,
            price: 130 + Math.random() * 35
          })),
          'ALL': Array.from({ length: 10 }, (_, i) => ({
            date: `Year ${2015 + i}`,
            price: 100 + Math.random() * 60
          }))
        },
        performance: {
          day: 1.59,
          week: 3.45,
          month: -2.32,
          year: 15.67
        },
        stats: {
          marketCap: '2.45T',
          peRatio: '28.5',
          eps: '5.50',
          dividendYield: '0.58'
        },
        sector: 'Technology',
        industry: 'Consumer Electronics',
        ceo: 'John Smith',
        employees: '150,000+',
        founded: '1976',
        headquarters: 'Cupertino, CA',
        website: 'https://www.example.com',
        trading: {
          open: 154.33,
          previousClose: 154.33,
          dayLow: 153.12,
          dayHigh: 158.45,
          yearLow: 120.56,
          yearHigh: 180.23,
          volume: 35456789,
          avgVolume: 42567890
        },
        financials: {
          revenueQuarterly: Array.from({ length: 4 }, (_, i) => ({
            quarter: `Q${i+1} 2024`,
            value: 50000 + Math.random() * 20000
          })),
          epsQuarterly: Array.from({ length: 4 }, (_, i) => ({
            quarter: `Q${i+1} 2024`,
            value: 1.2 + Math.random() * 0.8
          })),
          revenueTTM: '365.82',
          revenueGrowth: 8.2,
          grossProfitTTM: '170.78',
          grossMargin: 46.7,
          netIncomeTTM: '94.32',
          profitMargin: 25.8,
          cash: '62.50',
          totalAssets: '352.76',
          totalDebt: '110.45',
          debtToEquity: 1.35,
          currentRatio: 1.4,
          bookValuePerShare: 4.25
        },
        news: Array.from({ length: 5 }, (_, i) => ({
          id: i+1,
          title: `${symbol} Announces New Product Line`,
          summary: `${symbol} today announced a new product line that is expected to significantly boost revenue.`,
          source: 'Financial Times',
          date: 'April 14, 2025',
          url: 'https://www.example.com/news'
        })),
        analysis: {
          recommendationRating: 4.2,
          recommendationText: 'Buy',
          recommendations: {
            buy: 75,
            hold: 20,
            sell: 5
          },
          priceTargets: {
            low: 145.00,
            average: 175.50,
            high: 210.00
          },
          analystComments: Array.from({ length: 3 }, (_, i) => ({
            analyst: `Analyst ${i+1}`,
            firm: `Investment Firm ${i+1}`,
            rating: i === 0 ? 'Buy' : i === 1 ? 'Hold' : 'Buy',
            comment: `We believe ${symbol} is well positioned for growth in the coming quarters.`,
            date: 'April 10, 2025'
          }))
        },
        similarStocks: Array.from({ length: 4 }, (_, i) => ({
          symbol: ['AAPL', 'MSFT', 'AMZN', 'GOOGL'][i],
          name: ['Apple Inc.', 'Microsoft Corp.', 'Amazon.com Inc.', 'Alphabet Inc.'][i],
          price: 150 + Math.random() * 50,
          percentChange: (Math.random() * 6) - 3
        }))
      };

      setLoading(false);
      return mockData;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch stock details');
      setLoading(false);
      throw error;
    }
  }, []);

  // Fetch portfolio
  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demo
      const mockPortfolio = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          quantity: 10,
          averagePrice: 150.25,
          currentPrice: 157.35
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corp.',
          quantity: 5,
          averagePrice: 280.50,
          currentPrice: 310.75
        },
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          quantity: 3,
          averagePrice: 135.75,
          currentPrice: 142.20
        }
      ];
      
      setPortfolio(mockPortfolio);
      setLoading(false);
      return mockPortfolio;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch portfolio');
      setLoading(false);
      throw error;
    }
  }, []);

  // Fetch watchlist
  const fetchWatchlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demo
      const mockWatchlist = [
        {
          symbol: 'AMZN',
          name: 'Amazon.com Inc.',
          price: 175.32,
          change: 2.45,
          percentChange: 1.42
        },
        {
          symbol: 'TSLA',
          name: 'Tesla Inc.',
          price: 235.87,
          change: -3.21,
          percentChange: -1.35
        },
        {
          symbol: 'NVDA',
          name: 'NVIDIA Corp.',
          price: 785.23,
          change: 15.67,
          percentChange: 2.04
        }
      ];
      
      setWatchlist(mockWatchlist);
      setLoading(false);
      return mockWatchlist;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch watchlist');
      setLoading(false);
      throw error;
    }
  }, []);

  // Fetch top stocks
  const fetchTopStocks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demo
      const mockTopStocks = [
        {
          id: 1,
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 157.35,
          change: 2.15,
          percentChange: 1.39
        },
        {
          id: 2,
          symbol: 'MSFT',
          name: 'Microsoft Corp.',
          price: 310.75,
          change: 4.25,
          percentChange: 1.39
        },
        {
          id: 3,
          symbol: 'AMZN',
          name: 'Amazon.com Inc.',
          price: 175.32,
          change: 2.45,
          percentChange: 1.42
        },
        {
          id: 4,
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 142.20,
          change: 1.75,
          percentChange: 1.25
        },
        {
          id: 5,
          symbol: 'NVDA',
          name: 'NVIDIA Corp.',
          price: 785.23,
          change: 15.67,
          percentChange: 2.04
        },
        {
          id: 6,
          symbol: 'TSLA',
          name: 'Tesla Inc.',
          price: 235.87,
          change: -3.21,
          percentChange: -1.35
        }
      ];
      
      setTopStocks(mockTopStocks);
      setLoading(false);
      return mockTopStocks;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch top stocks');
      setLoading(false);
      throw error;
    }
  }, []);

  // Fetch market summary
  const fetchMarketSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demo
      const mockMarketSummary = {
        indices: {
          SP500: { price: 5235.48, change: 15.23, percentChange: 0.29 },
          NASDAQ: { price: 16421.28, change: 85.42, percentChange: 0.52 },
          DOW: { price: 38976.08, change: -32.45, percentChange: -0.08 }
        },
        chartData: [
          { name: 'Mon', SP500: 5200, NASDAQ: 16300, DOW: 39000 },
          { name: 'Tue', SP500: 5180, NASDAQ: 16200, DOW: 38900 },
          { name: 'Wed', SP500: 5210, NASDAQ: 16350, DOW: 38950 },
          { name: 'Thu', SP500: 5220, NASDAQ: 16380, DOW: 38930 },
          { name: 'Fri', SP500: 5235, NASDAQ: 16420, DOW: 38975 }
        ],
        lastUpdated: 'April 15, 2025, 4:00 PM EST'
      };
      
      setMarketSummary(mockMarketSummary);
      setLoading(false);
      return mockMarketSummary;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch market summary');
      setLoading(false);
      throw error;
    }
  }, []);

  // Fetch market news
  const fetchMarketNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demo
      const mockMarketNews = [
        {
          id: 1,
          title: 'Fed Announces Interest Rate Decision',
          source: 'Financial Times',
          summary: 'The Federal Reserve announced today that it will maintain current interest rates.',
          url: 'https://www.example.com/news/1',
          publishedAt: 'April 15, 2025'
        },
        {
          id: 2,
          title: 'Tech Stocks Rally Amid Positive Earnings',
          source: 'CNBC',
          summary: 'Major technology companies posted better-than-expected quarterly results.',
          url: 'https://www.example.com/news/2',
          publishedAt: 'April 14, 2025'
        },
        {
          id: 3,
          title: 'Oil Prices Surge on Supply Concerns',
          source: 'Reuters',
          summary: 'Global oil prices jumped over 3% today as geopolitical tensions rise.',
          url: 'https://www.example.com/news/3',
          publishedAt: 'April 13, 2025'
        }
      ];
      
      setMarketNews(mockMarketNews);
      setLoading(false);
      return mockMarketNews;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch market news');
      setLoading(false);
      throw error;
    }
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async ({ limit = 10 } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for demo
      const mockTransactions = [
        {
          id: 1,
          type: 'buy',
          symbol: 'AAPL',
          quantity: 5,
          price: 155.32,
          date: 'April 15, 2025'
        },
        {
          id: 2,
          type: 'sell',
          symbol: 'MSFT',
          quantity: 2,
          price: 308.45,
          date: 'April 12, 2025'
        },
        {
          id: 3,
          type: 'buy',
          symbol: 'GOOGL',
          quantity: 3,
          price: 140.78,
          date: 'April 10, 2025'
        },
        {
          id: 4,
          type: 'buy',
          symbol: 'AMZN',
          quantity: 1,
          price: 172.34,
          date: 'April 5, 2025'
        },
        {
          id: 5,
          type: 'sell',
          symbol: 'NVDA',
          quantity: 4,
          price: 780.45,
          date: 'April 2, 2025'
        }
      ].slice(0, limit);
      
      setTransactions(mockTransactions);
      setLoading(false);
      return mockTransactions;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch transactions');
      setLoading(false);
      throw error;
    }
  }, []);

  // Add stock to watchlist
  const addToWatchlist = useCallback(async (symbol) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation
      const newStock = {
        symbol: symbol,
        name: `${symbol} Corporation`,
        price: 150 + Math.random() * 100,
        change: 2 + Math.random() * 3,
        percentChange: 1 + Math.random() * 2
      };
      
      setWatchlist(prev => [...prev, newStock]);
      setLoading(false);
      return newStock;
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add to watchlist');
      setLoading(false);
      throw error;
    }
  }, []);

  // Remove stock from watchlist
  const removeFromWatchlist = useCallback(async (symbol) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock implementation
      setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
      setLoading(false);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to remove from watchlist');
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    loading,
    error,
    portfolio,
    watchlist,
    topStocks,
    marketSummary,
    marketNews,
    transactions,
    fetchStockDetails,
    fetchPortfolio,
    fetchWatchlist,
    fetchTopStocks,
    fetchMarketSummary,
    fetchMarketNews,
    fetchTransactions,
    addToWatchlist,
    removeFromWatchlist,
    clearError
  };
};

export default useStock;