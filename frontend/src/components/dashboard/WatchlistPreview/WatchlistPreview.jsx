import React, { useState, useEffect } from "react";

import "./WatchlistPreview.css";
import AppNavbar from "../../common/Navbar";
import { useNavigate } from 'react-router-dom';

const WatchlistPreview = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(0);
  const navigate = useNavigate();


  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  const handleBuyStock = (symbol) => {
    navigate(`/stock-analysis/${symbol}?symbol=${symbol}`);
  };

  const formatPercentChange = (percent) => {
    return percent > 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const showToast = (message, type = 'success') => {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    const toastElement = document.createElement('div');
    toastElement.className = `toast-${type} show`;
    toastElement.innerHTML = `
      <div class="toast-icon"><i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}"></i></div>
      <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.classList.add('toast-fade-out');
      setTimeout(() => {
        toastContainer.removeChild(toastElement);
      }, 300);
    }, 3000);
  };

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const storedUser = localStorage.getItem("currentUser");
        const currentUser = storedUser ? JSON.parse(storedUser) : null;
        const response = await fetch(
          `http://localhost:3000/stocks/watchlist/${currentUser.id}`
        );
        const data = await response.json();

        setWatchlist(data.stockData || []);
      } catch (error) {
        console.error("Failed to fetch watchlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  const handleTransaction = (stock, type) => {
    setSelectedStock(stock);
    if (type === "BUY") {
      setShowBuyModal(true);
    } else {
      setSellPrice(stock.data.c); // Initialize with current price
      setShowSellModal(true);
    }
  };

  const handleConfirmBuy = async () => {
    try {
      setLoading(true);
      // Logic to handle buy transaction
      const storedUser = localStorage.getItem("currentUser");
      const currentUser = storedUser ? JSON.parse(storedUser) : null;

      const response = await fetch("http://localhost:3000/stocks/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          symbol: selectedStock.symbol,
          quantity: quantity,
          price: selectedStock.data.c,
          type: "BUY",
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Close modal and reset state
        setShowBuyModal(false);
        setSelectedStock(null);
        setQuantity(1);
        
        // Show success toast
        showToast(`Successfully purchased ${quantity} shares of ${selectedStock.symbol}`, 'success');
      } else {
        // Show error toast
        const errorData = await response.json();
        showToast(`Transaction failed: ${errorData.message || "Please try again."}`, 'error');
      }
    } catch (error) {
      console.error("Error processing buy transaction:", error);
      showToast("An error occurred. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSell = async () => {
    try {
      setLoading(true);
      // Logic to handle sell transaction
      const storedUser = localStorage.getItem("currentUser");
      const currentUser = storedUser ? JSON.parse(storedUser) : null;
      
      const response = await fetch("http://localhost:3000/stocks/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          symbol: selectedStock.symbol,
          quantity: quantity,
          price: sellPrice,
          type: "SELL",
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setShowSellModal(false);
        setSelectedStock(null);
        setQuantity(1);
        setSellPrice(0);
        
        showToast(`Successfully sold ${quantity} shares of ${selectedStock.symbol}`, 'success');
      } else {
        const errorData = await response.json();
        showToast(`Transaction failed: ${errorData.message || "Please try again."}`, 'error');
      }
    } catch (error) {
      console.error("Error processing sell transaction:", error);
      showToast("An error occurred. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };


  if (loading) return (
    <div className="loading-container">
      <div className="spinner-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      <p className="mt-3 font-inter">Loading your watchlist...</p>
    </div>
  );

  return (
    <>
      <AppNavbar />
      <div
        className="container-fluid p-3"
        style={{ backgroundColor: "var(--neutral-bg-light)" }}
      >
        <h1 className="text-start mb-4 font-poppins fw-bold text-primary-custom ps-5">
          Your Watchlist
        </h1>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-11">
            {watchlist.length > 0 ? (
              watchlist.map((stock, index) => {
                const isPositive = stock && stock.data && stock.data.d > 0;

                return (
                  <div className="custom-card card mb-3 hover-lift" key={stock.symbol}>
                    <div
                      className={`stock-item ${
                        index === watchlist.length - 1 ? "" : "mb-2"
                      }`}
                    >
                      <div className="row align-items-center">
                        <div className="col-12 col-md-2 mb-3 mb-md-0">
                          <div className="d-flex flex-column align-items-center">
                            <h2 className="fs-2 fw-bold mb-0 font-poppins text-primary-custom">
                              {stock.symbol}
                            </h2>
                            <span
                              className={`price-pill d-inline-flex align-items-center mt-2 ${
                                isPositive ? "positive-change" : "negative-change"
                              }`}
                            >
                              <i
                                className={`bi ${
                                  isPositive
                                    ? "bi-arrow-up-right"
                                    : "bi-arrow-down-right"
                                } me-1`}
                              ></i>
                              {formatPercentChange(stock.data.dp)}
                            </span>
                          </div>
                        </div>

                        <div className="col-6 col-md-1 mb-3 mb-md-0 text-center">
                          <div>
                            <p className="text-secondary-custom mb-1 font-inter">
                              <i className="bi bi-clock me-1"></i>
                              {formatDate(stock.data.t)}
                            </p>
                          </div>
                        </div>

                        <div className="col-6 col-md-2 mb-3 mb-md-0 text-center">
                          <p className="text-secondary-custom text-uppercase small fw-bold mb-1 font-inter">
                            Current
                          </p>
                          <p className="fs-4 fw-bold font-inter mb-0 d-flex align-items-center justify-content-center">
                            <i className="bi bi-currency-dollar"></i>
                            {formatPrice(stock.data.c)}
                          </p>
                        </div>

                        <div className="col-4 col-md-1 mb-3 mb-md-0 text-center">
                          <p className="text-secondary-custom text-uppercase small fw-bold mb-1 font-inter">
                            Previous
                          </p>
                          <p className="mb-0 font-inter text-primary-custom">
                            ${formatPrice(stock.data.pc)}
                          </p>
                        </div>

                        <div className="col-4 col-md-1 text-center">
                          <p className="text-secondary-custom text-uppercase small fw-bold mb-1 font-inter">
                            Open
                          </p>
                          <p className="mb-0 fw-bold font-inter text-primary-custom">
                            ${formatPrice(stock.data.o)}
                          </p>
                        </div>
                        <div className="col-4 col-md-1 text-center">
                          <p className="text-secondary-custom text-uppercase small fw-bold mb-1 font-inter">
                            High
                          </p>
                          <p className="mb-0 fw-bold font-inter text-success-custom">
                            ${formatPrice(stock.data.h)}
                          </p>
                        </div>
                        <div className="col-4 col-md-1 text-center">
                          <p className="text-secondary-custom text-uppercase small fw-bold mb-1 font-inter">
                            Low
                          </p>
                          <p className="mb-0 fw-bold font-inter text-danger-custom">
                            ${formatPrice(stock.data.l)}
                          </p>
                        </div>
                        <div className="col-12 col-md-3 mt-2 mt-md-0">
                          <div className="d-flex flex-column gap-2 action-buttons">
                            <button className="custom-btn-primary btn py-2 fw-medium font-inter w-100 rounded-pill" onClick={() => handleBuyStock(stock.symbol)}>
                              <i className="bi bi-eye me-1"></i> View Details
                            </button>
                            <div className="d-flex gap-2">
                              <button className="buy-btn btn py-2 fw-medium font-inter flex-grow-1 rounded-pill" onClick={() => handleTransaction(stock, "BUY")}>
                                <i className="bi bi-cart-plus me-1"></i> Buy
                              </button>
                              {/* <button className="sell-btn btn py-2 fw-medium font-inter flex-grow-1 rounded-pill" onClick={() => handleTransaction(stock, "SELL")}>
                                <i className="bi bi-cart-dash me-1"></i> Sell
                              </button> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="custom-card empty-state">
                <div className="text-center p-4">
                  <i className="bi bi-bookmark-star fs-1 text-secondary-custom mb-3"></i>
                  <h3 className="font-poppins fs-5">Your watchlist is empty</h3>
                  <p className="font-inter text-secondary-custom mb-4">Add stocks to your watchlist to track their performance</p>
                  <button className="btn custom-btn-primary px-4 py-2 font-inter rounded-pill" onClick={() => navigate("/stocks")}>
                    <i className="bi bi-search me-2"></i>
                    Browse Stocks
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <div className={`modal fade ${showBuyModal ? 'show' : ''}`} style={{ display: showBuyModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div className="modal-header bg-primary-custom text-white">
              <h5 className="modal-title font-poppins fw-bold">
                <i className="bi bi-cart-plus me-2"></i>
                Buy {selectedStock?.symbol}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowBuyModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="stock-price-indicator mb-4">
                <div className="current-price text-center">
                  <span className="label font-inter text-secondary-custom">Current Price</span>
                  <span className="price font-poppins fw-bold fs-2 text-primary-custom d-block">
                    ${selectedStock?.data.c.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="quantity" className="form-label font-inter mb-2">Quantity</label>
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn minus" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button 
                    className="quantity-btn plus" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                
                <div className="quantity-shortcuts mt-2">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setQuantity(5)}>5</button>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setQuantity(10)}>10</button>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setQuantity(25)}>25</button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setQuantity(50)}>50</button>
                </div>
              </div>
              
              <div className="order-summary p-3 bg-light rounded-3 mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="font-inter">Subtotal:</span>
                  <span className="font-inter">
                    ${selectedStock ? (selectedStock.data.c * quantity).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="font-inter">Trading Fee:</span>
                  <span className="font-inter">$0.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="font-inter fw-bold">Total Cost:</span>
                  <span className="font-poppins fw-bold fs-5 text-primary-custom">
                    ${selectedStock ? (selectedStock.data.c * quantity).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary font-inter rounded-pill" onClick={() => setShowBuyModal(false)}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary font-inter px-4 py-2 rounded-pill" 
                onClick={handleConfirmBuy}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Confirm Purchase
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sell Modal */}
      <div className={`modal fade ${showSellModal ? 'show' : ''}`} style={{ display: showSellModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div className="modal-header bg-danger-custom text-white">
              <h5 className="modal-title font-poppins fw-bold">
                <i className="bi bi-cart-dash me-2"></i>
                Sell {selectedStock?.symbol}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowSellModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="stock-info-card mb-4 p-3 bg-light rounded-3">
                <div className="row">
                  <div className="col-6 border-end">
                    <div className="text-center">
                      <span className="font-inter text-secondary-custom d-block mb-1">Current Price</span>
                      <span className="font-poppins fw-bold fs-4 text-primary-custom">
                        ${selectedStock?.data.c.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <span className="font-inter text-secondary-custom d-block mb-1">Previous Close</span>
                      <span className="font-poppins fw-bold fs-4 text-primary-custom">
                        ${selectedStock?.data.pc.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="sellPrice" className="form-label font-inter mb-2">Sell Price</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="sellPrice" 
                    value={sellPrice} 
                    onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0.01"
                  />
                </div>
                <div className="price-shortcuts mt-2">
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => setSellPrice(selectedStock ? selectedStock.data.c * 0.95 : 0)}
                  >
                    -5%
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => setSellPrice(selectedStock ? selectedStock.data.c : 0)}
                  >
                    Market
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setSellPrice(selectedStock ? selectedStock.data.c * 1.05 : 0)}
                  >
                    +5%
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="sellQuantity" className="form-label font-inter mb-2">Quantity</label>
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn minus" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input 
                    type="number" 
                    className="form-control text-center" 
                    id="sellQuantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button 
                    className="quantity-btn plus" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                
                <div className="quantity-shortcuts mt-2">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setQuantity(5)}>5</button>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setQuantity(10)}>10</button>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setQuantity(25)}>25</button>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setQuantity(50)}>50</button>
                </div>
              </div>
              
              <div className="order-summary p-3 bg-light rounded-3 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="font-inter">Sell Price × Quantity:</span>
                  <span className="font-inter">
                    ${(sellPrice * quantity).toFixed(2)}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="font-inter">Trading Fee:</span>
                  <span className="font-inter">$0.00</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="font-inter fw-bold">Total Revenue:</span>
                  <span className="font-poppins fw-bold fs-5 text-success-custom">
                    ${(sellPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              
              {selectedStock && sellPrice < selectedStock.data.c * 0.95 && (
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Your sell price is significantly below current market value.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary font-inter rounded-pill" onClick={() => setShowSellModal(false)}>
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger font-inter px-4 py-2 rounded-pill" 
                onClick={handleConfirmSell}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Confirm Sale
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {(showBuyModal || showSellModal) && (
        <div className="modal-backdrop fade show" style={{ 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(5px)'
        }}></div>
      )}
      <div id="toast-container" className="position-fixed bottom-0 end-0 p-3"></div>
    </>
  );
};

export default WatchlistPreview;