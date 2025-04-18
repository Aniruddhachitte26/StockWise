// src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Loader from '../components/common/Loader';
import Error from '../components/common/Error';
import StockCard from '../components/common/StockCard';

import useAuth from '../hooks/useAuth';
import useStock from '../hooks/useStock';

// Custom CSS to fix the spacing issues
const customStyles = {
    container: {
        maxWidth: '100%',
        padding: '0 15px',
    },
    fullWidthContainer: {
        width: '100%',
        maxWidth: '100%',
        paddingLeft: '15px',
        paddingRight: '15px',
        margin: '0 auto'
    },
    pageWrapper: {
        minHeight: 'calc(100vh - 200px)', // Adjust based on your navbar/footer height
    }
};

const DashboardPage = () => {
    const { user } = useSelector(state => state.auth);

    const {
        portfolio,
        watchlist,
        topStocks,
        transactions,
        loading,
        error,
        fetchPortfolio,
        fetchWatchlist,
        fetchTopStocks,
        fetchTransactions,
        clearError
    } = useStock();

    const [portfolioPerformance, setPortfolioPerformance] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchPortfolio(),
                    fetchWatchlist(),
                    fetchTopStocks(),
                    fetchTransactions({ limit: 5 })
                ]);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            }
        };

        fetchData();

        // Mock portfolio performance data
        // This would normally come from an API
        const mockPerformanceData = [
            { date: 'Jan', value: 10000 },
            { date: 'Feb', value: 10800 },
            { date: 'Mar', value: 10600 },
            { date: 'Apr', value: 11200 },
            { date: 'May', value: 12000 },
            { date: 'Jun', value: 11800 },
            { date: 'Jul', value: 12500 }
        ];

        setPortfolioPerformance(mockPerformanceData);

        return () => {
            clearError();
        };
    }, [fetchPortfolio, fetchWatchlist, fetchTopStocks, fetchTransactions, clearError]);

    const totalPortfolioValue = portfolio?.reduce((total, item) => {
        return total + (item.quantity * item.currentPrice);
    }, 0) || 0;

    const totalGainLoss = portfolio?.reduce((total, item) => {
        return total + (item.quantity * (item.currentPrice - item.averagePrice));
    }, 0) || 0;

    const gainLossPercentage = totalPortfolioValue > 0
        ? (totalGainLoss / (totalPortfolioValue - totalGainLoss)) * 100
        : 0;

    if (loading && (!portfolio || !watchlist)) {
        return (
            <>
                <Navbar />
                <div style={customStyles.pageWrapper}>
                    <Loader fullScreen />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div style={customStyles.fullWidthContainer}>
                {error && (
                    <Error message={error} dismissible onClose={clearError} />
                )}

                <div className="mb-4">
                    <h1 className="mb-0">Welcome, {user?.fullName || 'Trader'}</h1>
                    <p className="text-muted">Here's a summary of your investments</p>
                </div>

                {/* Portfolio Summary */}
                <Row className="mb-4">
                    <Col lg={4} md={6} className="mb-4 mb-lg-0">
                        <Card className="h-100 dashboard-panel">
                            <Card.Body>
                                <h5 className="dashboard-panel-title">Portfolio Value</h5>
                                <h2 className="mb-2">${totalPortfolioValue.toFixed(2)}</h2>
                                <div className={totalGainLoss >= 0 ? "text-success" : "text-danger"}>
                                    <span className="me-2">
                                        <i className={totalGainLoss >= 0 ? "bi bi-arrow-up" : "bi bi-arrow-down"}></i>
                                        ${Math.abs(totalGainLoss).toFixed(2)}
                                    </span>
                                    <span>
                                        ({totalGainLoss >= 0 ? "+" : ""}{gainLossPercentage.toFixed(2)}%)
                                    </span>
                                </div>
                                <div className="mt-4">
                                    <Link to="/portfolio" className="btn btn-primary">
                                        View Portfolio
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={8} md={6}>
                        <Card className="h-100 dashboard-panel">
                            <Card.Body>
                                <h5 className="dashboard-panel-title">Portfolio Performance</h5>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={portfolioPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => ["$" + value, "Value"]} />
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
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    {/* Watchlist */}
                    <Col lg={6} className="mb-4">
                        <Card className="dashboard-panel">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dashboard-panel-title mb-0">Watchlist</h5>
                                    <Link to="/watchlist" className="text-decoration-none">View All</Link>
                                </div>

                                {watchlist && watchlist.length > 0 ? (
                                    watchlist.slice(0, 3).map((stock) => (
                                        <Card key={stock.symbol} className="mb-3">
                                            <Card.Body className="p-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h6 className="mb-0">{stock.symbol}</h6>
                                                        <div className="text-muted small">{stock.name}</div>
                                                    </div>
                                                    <div className="text-end">
                                                        <div className="fw-bold">${stock.price.toFixed(2)}</div>
                                                        <div className={stock.percentChange >= 0 ? "text-success small" : "text-danger small"}>
                                                            {stock.percentChange >= 0 ? "+" : ""}{stock.percentChange.toFixed(2)}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="mb-3">Your watchlist is empty</p>
                                        <Link to="/stocks" className="btn btn-outline-primary">
                                            Browse Stocks
                                        </Link>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Recent Transactions */}
                    <Col lg={6} className="mb-4">
                        <Card className="dashboard-panel">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="dashboard-panel-title mb-0">Recent Transactions</h5>
                                    <Link to="/transactions" className="text-decoration-none">View All</Link>
                                </div>

                                {transactions && transactions.length > 0 ? (
                                    <Table responsive className="table-borderless">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Date</th>
                                                <th>Type</th>
                                                <th>Stock</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction) => (
                                                <tr key={transaction.id}>
                                                    <td>{transaction.date}</td>
                                                    <td>
                                                        <Badge bg={transaction.type === 'buy' ? 'success' : 'danger'}>
                                                            {transaction.type.toUpperCase()}
                                                        </Badge>
                                                    </td>
                                                    <td>{transaction.symbol}</td>
                                                    <td>{transaction.quantity}</td>
                                                    <td>${transaction.price.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-4">
                                        <p className="mb-3">No recent transactions</p>
                                        <Link to="/stocks" className="btn btn-outline-primary">
                                            Start Trading
                                        </Link>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Market Opportunities */}
                <Card className="mb-4 dashboard-panel">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="dashboard-panel-title mb-0">Market Opportunities</h5>
                            <Link to="/stocks" className="text-decoration-none">View All Stocks</Link>
                        </div>

                        <Row>
                            {topStocks && topStocks.length > 0 ? (
                                topStocks.slice(0, 3).map((stock) => (
                                    <Col key={stock.symbol} md={4} className="mb-3 mb-md-0">
                                        <StockCard stock={stock} />
                                    </Col>
                                ))
                            ) : (
                                <Col>
                                    <div className="text-center py-4">
                                        <Loader />
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </Card.Body>
                </Card>

                {/* Quick Actions */}
                <Row>
                    <Col md={6} lg={3} className="mb-4">
                        <Card className="text-center h-100 hover-effect">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                                <div className="feature-icon bg-primary mb-3">
                                    <i className="bi bi-cash-coin"></i>
                                </div>
                                <h5>Deposit Funds</h5>
                                <p className="small text-muted">Add money to your account</p>
                                <Button variant="outline-primary" className="mt-2">Deposit</Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={3} className="mb-4">
                        <Card className="text-center h-100 hover-effect">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                                <div className="feature-icon bg-success mb-3">
                                    <i className="bi bi-cart-plus"></i>
                                </div>
                                <h5>Buy Stocks</h5>
                                <p className="small text-muted">Invest in new stocks</p>
                                <Link to="/stocks" className="btn btn-outline-success mt-2">Browse</Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={3} className="mb-4">
                        <Card className="text-center h-100 hover-effect">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                                <div className="feature-icon bg-info mb-3">
                                    <i className="bi bi-graph-up-arrow"></i>
                                </div>
                                <h5>Market Analysis</h5>
                                <p className="small text-muted">View market insights</p>
                                <Link to="/news" className="btn btn-outline-info mt-2">Analyze</Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={6} lg={3} className="mb-4">
                        <Card className="text-center h-100 hover-effect">
                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                                <div className="feature-icon bg-secondary mb-3">
                                    <i className="bi bi-gear"></i>
                                </div>
                                <h5>Account Settings</h5>
                                <p className="small text-muted">Manage your profile</p>
                                <Link to="/profile" className="btn btn-outline-secondary mt-2">Settings</Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Footer />
        </>
    );
};

export default DashboardPage;