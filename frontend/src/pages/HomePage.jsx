// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import StockCard from '../components/common/StockCard';
import Loader from '../components/common/Loader';
import Error from '../components/common/Error';
import StockTicker from '../components/common/StockTicker';

import useStock from '../hooks/useStock';

// Custom styles for full-width layout
const styles = {
  fullWidth: {
    width: '100%',
    maxWidth: '100%',
    padding: '0 15px',
    margin: '0 auto'
  },
  fullWidthSection: {
    width: '100%',
    padding: '3rem 0'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #0d6efd 0%, #0056b3 100%)',
    padding: '5rem 0',
    position: 'relative',
    overflow: 'hidden',
    width: '100%'
  },
  tickerSection: {
    width: '100%',
    overflowX: 'hidden',
    backgroundColor: '#212529',
    color: 'white'
  }
};

const HomePage = () => {
  const { 
    marketSummary, 
    topStocks, 
    marketNews, 
    loading, 
    error,
    fetchMarketSummary,
    fetchTopStocks,
    fetchMarketNews,
    clearError
  } = useStock();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchMarketSummary(),
          fetchTopStocks(),
          fetchMarketNews()
        ]);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      clearError();
    };
  }, [fetchMarketSummary, fetchTopStocks, fetchMarketNews, clearError]);

  if (loading && (!marketSummary || !topStocks || !marketNews)) {
    return <Loader fullScreen />;
  }

  return (
    <div className="homepage">
      <Navbar />
      
      {/* Stock Ticker */}
      <StockTicker />
      
      {error && (
        <div style={styles.fullWidth}>
          <Error message={error} dismissible onClose={clearError} />
        </div>
      )}
      
      {/* Hero Section */}
      <div style={styles.heroSection} className="text-white">
        <div style={styles.fullWidth}>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <h1 className="display-4 fw-bold">Welcome to StockWise Trading</h1>
              <p className="lead">Your trusted platform for smart stock trading and investment management</p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link to="/register">
                  <Button variant="light" size="lg" className="me-md-2">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-light" size="lg">Log In</Button>
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <div className="p-3 bg-white rounded shadow">
                {marketSummary && marketSummary.chartData ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={marketSummary.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="SP500" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="NASDAQ" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="DOW" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
                    <Loader size="sm" />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Market Summary Section */}
      <div style={{...styles.fullWidthSection, background: "#f8f9fa"}}>
        <div style={styles.fullWidth}>
          <h2 className="text-center mb-4">Market Summary</h2>
          {marketSummary ? (
            <Row>
              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      S&P 500 
                      <span className={marketSummary.indices.SP500.change >= 0 ? "text-success" : "text-danger"}>
                        {marketSummary.indices.SP500.change >= 0 ? "+" : ""}{marketSummary.indices.SP500.percentChange.toFixed(2)}%
                      </span>
                    </Card.Title>
                    <Card.Text className="fs-2 fw-bold">{marketSummary.indices.SP500.price.toFixed(2)}</Card.Text>
                    <div className="small text-muted">Last updated: {marketSummary.lastUpdated}</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      NASDAQ 
                      <span className={marketSummary.indices.NASDAQ.change >= 0 ? "text-success" : "text-danger"}>
                        {marketSummary.indices.NASDAQ.change >= 0 ? "+" : ""}{marketSummary.indices.NASDAQ.percentChange.toFixed(2)}%
                      </span>
                    </Card.Title>
                    <Card.Text className="fs-2 fw-bold">{marketSummary.indices.NASDAQ.price.toFixed(2)}</Card.Text>
                    <div className="small text-muted">Last updated: {marketSummary.lastUpdated}</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title className="d-flex justify-content-between align-items-center">
                      DOW JONES 
                      <span className={marketSummary.indices.DOW.change >= 0 ? "text-success" : "text-danger"}>
                        {marketSummary.indices.DOW.change >= 0 ? "+" : ""}{marketSummary.indices.DOW.percentChange.toFixed(2)}%
                      </span>
                    </Card.Title>
                    <Card.Text className="fs-2 fw-bold">{marketSummary.indices.DOW.price.toFixed(2)}</Card.Text>
                    <div className="small text-muted">Last updated: {marketSummary.lastUpdated}</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <div className="text-center py-5">
                  <Loader />
                </div>
              </Col>
            </Row>
          )}
        </div>
      </div>

{/* Top Stocks Section */}
<div style={styles.fullWidthSection}>
  <div style={styles.fullWidth}>
    <h2 className="text-center mb-4">Top Stocks</h2>
    {loading && !topStocks.length ? (
      <div className="text-center py-5">
        <Loader />
        <p className="mt-3">Loading top stocks data...</p>
      </div>
    ) : error && !topStocks.length ? (
      <Alert variant="warning" className="mb-4">
        {error}
      </Alert>
    ) : topStocks && topStocks.length > 0 ? (
      <>
        <Row>
          {topStocks.map(stock => (
            <Col key={stock.symbol} lg={4} md={6} className="mb-4">
              <StockCard stock={stock} />
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Link to="/stocks">
            <Button variant="primary">View All Stocks</Button>
          </Link>
        </div>
      </>
    ) : (
      <div className="text-center py-5">
        <p>No stock data available.</p>
      </div>
    )}
  </div>
</div>

      {/* Features Section */}
      <div style={{...styles.fullWidthSection, background: "#f8f9fa"}}>
        <div style={styles.fullWidth}>
          <h2 className="text-center mb-5">Why Choose StockWise?</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                  <i className="bi bi-graph-up" style={{ fontSize: '1.75rem' }}></i>
                </div>
                <h3>Real-Time Market Data</h3>
                <p>Access up-to-the-minute market information and stock prices to make informed trading decisions.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                  <i className="bi bi-shield-lock" style={{ fontSize: '1.75rem' }}></i>
                </div>
                <h3>Secure Trading</h3>
                <p>Trade with confidence on our secure platform with advanced encryption and protection measures.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center">
                <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3">
                  <i className="bi bi-lightning" style={{ fontSize: '1.75rem' }}></i>
                </div>
                <h3>Fast Execution</h3>
                <p>Execute trades quickly and efficiently with our high-performance trading engine.</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Market News Section */}
      <div style={styles.fullWidthSection}>
        <div style={styles.fullWidth}>
          <h2 className="text-center mb-4">Latest Market News</h2>
          {marketNews && marketNews.length > 0 ? (
            <>
              <Row>
                {marketNews.slice(0, 3).map(news => (
                  <Col key={news.id} md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title>{news.title}</Card.Title>
                        <Card.Text className="text-muted">{news.source}</Card.Text>
                        <Card.Text className="small">{news.summary}</Card.Text>
                      </Card.Body>
                      <Card.Footer className="bg-white">
                        <a href={news.url} target="_blank" rel="noopener noreferrer" className="btn btn-link p-0">
                          Read More
                        </a>
                        <span className="float-end text-muted small">{news.publishedAt}</span>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="text-center mt-4">
                <Link to="/news">
                  <Button variant="primary">View All News</Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <Loader />
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{...styles.fullWidthSection, background: "#212529"}} className="text-white text-center">
        <div style={styles.fullWidth}>
          <h2 className="mb-4">Ready to Start Trading?</h2>
          <p className="lead mb-4">Join thousands of successful traders on StockWise today!</p>
          <Link to="/register">
            <Button variant="primary" size="lg">Create Your Free Account</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;