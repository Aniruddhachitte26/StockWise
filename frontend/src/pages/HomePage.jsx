// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import components that would be created separately
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StockCard from '../components/StockCard';

// This would normally be fetched from an API
const dummyMarketData = [
  { name: '9:30', SP500: 4200, NASDAQ: 14100, DOW: 34500 },
  { name: '10:30', SP500: 4220, NASDAQ: 14150, DOW: 34550 },
  { name: '11:30', SP500: 4180, NASDAQ: 14080, DOW: 34450 },
  { name: '12:30', SP500: 4210, NASDAQ: 14200, DOW: 34600 },
  { name: '13:30', SP500: 4250, NASDAQ: 14250, DOW: 34650 },
  { name: '14:30', SP500: 4230, NASDAQ: 14180, DOW: 34580 },
  { name: '15:30', SP500: 4260, NASDAQ: 14300, DOW: 34700 },
];

// This would normally be fetched from an API
const dummyTopStocks = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.34, percentChange: 1.32 },
  { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 4.25, percentChange: 1.13 },
  { id: 3, symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, change: -1.24, percentChange: -0.69 },
  { id: 4, symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: 0.87, percentChange: 0.61 },
  { id: 5, symbol: 'TSLA', name: 'Tesla Inc.', price: 251.12, change: -3.45, percentChange: -1.36 },
  { id: 6, symbol: 'META', name: 'Meta Platforms Inc.', price: 472.85, change: 6.32, percentChange: 1.35 },
];

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);
  const [topStocks, setTopStocks] = useState([]);
  const [marketNews, setMarketNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
        // In a real application, these would be actual API calls
        // await Promise.all([fetchMarketData(), fetchTopStocks(), fetchMarketNews()]);
        
        // Simulate loading time
        setTimeout(() => {
          setMarketData(dummyMarketData);
          setTopStocks(dummyTopStocks);
          setMarketNews([
            { id: 1, title: 'Fed Signals Interest Rate Cut in Coming Months', source: 'Financial Times' },
            { id: 2, title: 'Tech Stocks Rally as Inflation Cools', source: 'Wall Street Journal' },
            { id: 3, title: 'Retail Sales Beat Expectations in April', source: 'CNBC' },
          ]);
          setIsLoading(false);
        }, 1500);
      } catch (err) {
        setError('Failed to load market data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="homepage">
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <Container>
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
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={marketData}>
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
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Market Summary Section */}
      <Container className="py-5">
        <h2 className="text-center mb-4">Market Summary</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  S&P 500 
                  <span className="text-success">+0.75%</span>
                </Card.Title>
                <Card.Text className="fs-2 fw-bold">4,260.23</Card.Text>
                <div className="small text-muted">Last updated: Today 4:00 PM EDT</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  NASDAQ 
                  <span className="text-success">+1.02%</span>
                </Card.Title>
                <Card.Text className="fs-2 fw-bold">14,300.68</Card.Text>
                <div className="small text-muted">Last updated: Today 4:00 PM EDT</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  DOW JONES 
                  <span className="text-success">+0.58%</span>
                </Card.Title>
                <Card.Text className="fs-2 fw-bold">34,700.12</Card.Text>
                <div className="small text-muted">Last updated: Today 4:00 PM EDT</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Top Stocks Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Top Stocks</h2>
          <Row>
            {topStocks.map(stock => (
              <Col key={stock.id} lg={4} md={6} className="mb-4">
                <StockCard stock={stock} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/stocks">
              <Button variant="primary">View All Stocks</Button>
            </Link>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Why Choose StockWise?</h2>
        <Row className="g-4">
          <Col md={4}>
            <div className="text-center">
              <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '4rem', height: '4rem' }}>
                <i className="bi bi-graph-up" style={{ fontSize: '1.75rem' }}></i>
              </div>
              <h3>Real-Time Market Data</h3>
              <p>Access up-to-the-minute market information and stock prices to make informed trading decisions.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '4rem', height: '4rem' }}>
                <i className="bi bi-shield-lock" style={{ fontSize: '1.75rem' }}></i>
              </div>
              <h3>Secure Trading</h3>
              <p>Trade with confidence on our secure platform with advanced encryption and protection measures.</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="text-center">
              <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '4rem', height: '4rem' }}>
                <i className="bi bi-lightning" style={{ fontSize: '1.75rem' }}></i>
              </div>
              <h3>Fast Execution</h3>
              <p>Execute trades quickly and efficiently with our high-performance trading engine.</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Market News Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Latest Market News</h2>
          <Row>
            {marketNews.map(news => (
              <Col key={news.id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{news.title}</Card.Title>
                    <Card.Text className="text-muted">{news.source}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <Button variant="link" className="p-0">Read More</Button>
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
        </Container>
      </div>

      {/* CTA Section */}
      <div className="cta-section py-5 bg-dark text-white text-center">
        <Container>
          <h2 className="mb-4">Ready to Start Trading?</h2>
          <p className="lead mb-4">Join thousands of successful traders on StockWise today!</p>
          <Link to="/register">
            <Button variant="primary" size="lg">Create Your Free Account</Button>
          </Link>
        </Container>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;