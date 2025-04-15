// src/components/dashboard/PortfolioSummary.jsx

import React from 'react';
import { Card, Row, Col, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useStock from '../../hooks/useStock';
import Loader from '../common/Loader';

const PortfolioSummary = ({ period = '1m' }) => {
  const { portfolio, loading } = useStock();
  
  // Calculate portfolio value and performance
  const calculatePortfolioStats = () => {
    if (!portfolio || portfolio.length === 0) {
      return {
        totalValue: 0,
        totalGainLoss: 0,
        gainLossPercentage: 0,
        topGainers: [],
        topLosers: []
      };
    }
    
    const totalValue = portfolio.reduce((total, item) => {
      return total + (item.quantity * item.currentPrice);
    }, 0);
    
    const totalGainLoss = portfolio.reduce((total, item) => {
      return total + (item.quantity * (item.currentPrice - item.averagePrice));
    }, 0);
    
    const gainLossPercentage = totalValue > 0 
      ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 
      : 0;
    
    // Sort stocks by performance
    const sortedStocks = [...portfolio].sort((a, b) => {
      const aPerformance = (a.currentPrice - a.averagePrice) / a.averagePrice;
      const bPerformance = (b.currentPrice - b.averagePrice) / b.averagePrice;
      return bPerformance - aPerformance;
    });
    
    const topGainers = sortedStocks.filter(stock => 
      stock.currentPrice > stock.averagePrice
    ).slice(0, 3);
    
    const topLosers = sortedStocks.filter(stock => 
      stock.currentPrice < stock.averagePrice
    ).sort((a, b) => {
      const aPerformance = (a.currentPrice - a.averagePrice) / a.averagePrice;
      const bPerformance = (b.currentPrice - b.averagePrice) / b.averagePrice;
      return aPerformance - bPerformance;
    }).slice(0, 3);
    
    return {
      totalValue,
      totalGainLoss,
      gainLossPercentage,
      topGainers,
      topLosers
    };
  };
  
  const { 
    totalValue, 
    totalGainLoss, 
    gainLossPercentage,
    topGainers,
    topLosers
  } = calculatePortfolioStats();
  
  // Mock performance data for chart
  // In a real app, this would come from an API
  const performanceData = [
    { date: 'Mon', value: totalValue - 500 },
    { date: 'Tue', value: totalValue - 200 },
    { date: 'Wed', value: totalValue - 100 },
    { date: 'Thu', value: totalValue - 300 },
    { date: 'Fri', value: totalValue }
  ];
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <Card className="dashboard-panel h-100">
      <Card.Body>
        <h5 className="dashboard-panel-title">Portfolio Summary</h5>
        
        <Row>
          <Col md={5} className="mb-4 mb-md-0">
            <div className="mb-3">
              <div className="text-muted mb-1">Total Value</div>
              <h2 className="mb-2">${totalValue.toFixed(2)}</h2>
              <div className={totalGainLoss >= 0 ? "text-success" : "text-danger"}>
                <span className="me-2">
                  <i className={totalGainLoss >= 0 ? "bi bi-arrow-up" : "bi bi-arrow-down"}></i>
                  ${Math.abs(totalGainLoss).toFixed(2)}
                </span>
                <span>
                  ({totalGainLoss >= 0 ? "+" : ""}{gainLossPercentage.toFixed(2)}%)
                </span>
              </div>
            </div>
            
            {portfolio && portfolio.length > 0 ? (
              <div className="mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <div className="text-muted">Top Performers</div>
                  <div className="text-muted">Return</div>
                </div>
                
                {topGainers.map(stock => (
                  <div key={stock.symbol} className="d-flex justify-content-between mb-2">
                    <Link to={`/stocks/${stock.symbol}`} className="text-decoration-none">
                      {stock.symbol}
                    </Link>
                    <span className="text-success">
                      +{(((stock.currentPrice - stock.averagePrice) / stock.averagePrice) * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
                
                {topGainers.length === 0 && (
                  <div className="text-muted small">No gainers in your portfolio</div>
                )}
                
                <div className="d-flex justify-content-between mb-2 mt-3">
                  <div className="text-muted">Underperformers</div>
                  <div className="text-muted">Return</div>
                </div>
                
                {topLosers.map(stock => (
                  <div key={stock.symbol} className="d-flex justify-content-between mb-2">
                    <Link to={`/stocks/${stock.symbol}`} className="text-decoration-none">
                      {stock.symbol}
                    </Link>
                    <span className="text-danger">
                      {(((stock.currentPrice - stock.averagePrice) / stock.averagePrice) * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
                
                {topLosers.length === 0 && (
                  <div className="text-muted small">No losers in your portfolio</div>
                )}
              </div>
            ) : (
              <div className="text-center py-3">
                <p className="mb-3">Your portfolio is empty</p>
                <Link to="/stocks" className="btn btn-sm btn-primary">
                  Browse Stocks
                </Link>
              </div>
            )}
          </Col>
          
          <Col md={7}>
            <div className="mb-3">
              <div className="text-muted mb-1">This Week's Performance</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis domain={['dataMin - 1000', 'dataMax + 500']} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value) => ["$" + value.toFixed(2), "Portfolio Value"]} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0d6efd"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {portfolio && portfolio.length > 0 && (
              <div>
                <div className="text-muted mb-2">Portfolio Allocation</div>
                <Table responsive size="sm" className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Stock</th>
                      <th>Shares</th>
                      <th>Avg Price</th>
                      <th>Current</th>
                      <th>Gain/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.slice(0, 5).map(stock => (
                      <tr key={stock.symbol}>
                        <td>
                          <Link to={`/stocks/${stock.symbol}`} className="text-decoration-none">
                            {stock.symbol}
                          </Link>
                        </td>
                        <td>{stock.quantity}</td>
                        <td>${stock.averagePrice.toFixed(2)}</td>
                        <td>${stock.currentPrice.toFixed(2)}</td>
                        <td className={stock.currentPrice >= stock.averagePrice ? "text-success" : "text-danger"}>
                          {stock.currentPrice >= stock.averagePrice ? "+" : ""}
                          {(((stock.currentPrice - stock.averagePrice) / stock.averagePrice) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
                {portfolio.length > 5 && (
                  <div className="text-end mt-2">
                    <Link to="/portfolio" className="text-decoration-none small">
                      View all ({portfolio.length}) <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PortfolioSummary;