import React, { useState, useEffect } from "react";

import "./WatchlistPreview.css";
import AppNavbar from "../../common/Navbar";

const WatchlistPreview = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(0);

  const formatPrice = (price) => {
    return price.toFixed(2);
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
        // Success handling
        alert(`Successfully purchased ${quantity} shares of ${selectedStock.symbol}`);
        setShowBuyModal(false);
        setSelectedStock(null);
        setQuantity(1);
      } else {
        // Error handling
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing buy transaction:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleConfirmSell = async () => {
    try {
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
        // Success handling
        alert(`Successfully sold ${quantity} shares of ${selectedStock.symbol}`);
        setShowSellModal(false);
        setSelectedStock(null);
        setQuantity(1);
        setSellPrice(0);
      } else {
        // Error handling
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing sell transaction:", error);
      alert("An error occurred. Please try again.");
    }
  };


  if (loading) return <p>Loading watchlist...</p>;

  return (
    <>
      <AppNavbar />
      <div
        className="container-fluid p-3"
        style={{ backgroundColor: "var(--neutral-bg-light)" }}
      >
        <h1 className="text-start mb-4 font-poppins fw-bold text-primary-custom ps-3">
          Your Watchlist
        </h1>

        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-11">
            {watchlist.map((stock, index) => {
              const isPositive = stock.data.d > 0;

              return (
                <div className="custom-card card mb-3" key={stock.symbol}>
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
                          <button className="custom-btn-primary btn py-2 fw-medium font-inter w-100">
                            <i className="bi bi-eye me-1"></i> View Details
                          </button>
                          <div className="d-flex gap-2">
                            <button className="buy-btn btn py-2 fw-medium font-inter flex-grow-1" onClick={() => handleTransaction(stock, "BUY")}>
                              <i className="bi bi-cart-plus me-1"></i> Buy
                            </button>
                            <button className="sell-btn btn py-2 fw-medium font-inter flex-grow-1" onClick={() => handleTransaction(stock, "SELL")}>
                              <i className="bi bi-cart-dash me-1"></i> Sell
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <div className={`modal fade ${showBuyModal ? 'show' : ''}`} style={{ display: showBuyModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div className="modal-header bg-primary-custom text-white">
              <h5 className="modal-title font-poppins fw-bold">
                <i className="bi bi-cart-plus me-2"></i>
                Buy {selectedStock?.symbol}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowBuyModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="font-inter text-secondary-custom">Current Price:</span>
                <span className="font-poppins fw-bold fs-4 text-primary-custom">
                  ${selectedStock?.data.c.toFixed(2)}
                </span>
              </div>
              
              <div className="mb-4">
                <label htmlFor="quantity" className="form-label font-inter mb-2">Quantity</label>
                <div className="input-group">
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
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
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-4">
                <span className="font-inter">Total Cost:</span>
                <span className="font-poppins fw-bold fs-5 text-primary-custom">
                  ${selectedStock ? (selectedStock.data.c * quantity).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary font-inter" onClick={() => setShowBuyModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary font-inter px-4 py-2" onClick={handleConfirmBuy}>
                <i className="bi bi-check2-circle me-2"></i>Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sell Modal */}
      <div className={`modal fade ${showSellModal ? 'show' : ''}`} style={{ display: showSellModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div className="modal-header bg-danger-custom text-white">
              <h5 className="modal-title font-poppins fw-bold">
                <i className="bi bi-cart-dash me-2"></i>
                Sell {selectedStock?.symbol}
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={() => setShowSellModal(false)}></button>
            </div>
            <div className="modal-body p-4">
              <div className="row mb-4">
                <div className="col-6">
                  <span className="font-inter text-secondary-custom d-block mb-1">Current Price:</span>
                  <span className="font-poppins fw-bold fs-5 text-primary-custom">
                    ${selectedStock?.data.c.toFixed(2)}
                  </span>
                </div>
                <div className="col-6">
                  <span className="font-inter text-secondary-custom d-block mb-1">Previous Close:</span>
                  <span className="font-poppins fw-bold fs-5 text-primary-custom">
                    ${selectedStock?.data.pc.toFixed(2)}
                  </span>
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
              </div>
              
              <div className="mb-4">
                <label htmlFor="sellQuantity" className="form-label font-inter mb-2">Quantity</label>
                <div className="input-group">
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button" 
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
                    className="btn btn-outline-secondary" 
                    type="button" 
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3 mb-3">
                <span className="font-inter">Total Revenue:</span>
                <span className="font-poppins fw-bold fs-5 text-success-custom">
                  ${(sellPrice * quantity).toFixed(2)}
                </span>
              </div>
              
              {selectedStock && sellPrice < selectedStock.data.c * 0.95 && (
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Your sell price is significantly below current market value.
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary font-inter" onClick={() => setShowSellModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger font-inter px-4 py-2" onClick={handleConfirmSell}>
                <i className="bi bi-check2-circle me-2"></i>Confirm Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop */}
      {(showBuyModal || showSellModal) && (
        <div className="modal-backdrop fade show" style={{ 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          backdropFilter: 'blur(5px)'
        }}></div>
      )}
    </>
  );
};

export default WatchlistPreview;