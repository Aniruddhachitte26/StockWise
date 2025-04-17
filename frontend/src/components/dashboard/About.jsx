import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from "../common/Navbar"

const About = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      {/* <header className="bg-primary text-white py-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h4 mb-0">StockWise</h1>
            <div className="d-flex gap-3">
              <a href="/" className="text-white text-decoration-none">Dashboard</a>
              <a href="/portfolio" className="text-white text-decoration-none">Portfolio</a>
              <a href="/market-news" className="text-white text-decoration-none">Market News</a>
              <a href="/listing" className="text-white text-decoration-none">Listings</a>
              <a href="/about" className="text-white text-decoration-none fw-bold">About</a>
            </div>
            <div>
              <span className="me-2">Welcome, User</span>
              <button className="btn btn-sm btn-outline-light">Logout</button>
            </div>
          </div>
        </div>
      </header> */}
      <AppNavbar />
      <main className="flex-grow-1 bg-light">
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <div className="bg-white shadow-sm rounded p-4 mb-4">
                <h2 className="text-primary mb-4">About StockWise</h2>
                
                <section className="mb-5">
                  <h3 className="h5 mb-3">Our Mission</h3>
                  <p>
                    At StockWise, we're dedicated to democratizing financial information and helping investors make informed decisions. 
                    Our platform combines real-time market data, intuitive portfolio management tools, and AI-powered insights 
                    to provide a comprehensive financial management experience for investors of all levels.
                  </p>
                </section>

                <section className="mb-5">
                  <h3 className="h5 mb-3">Our Story</h3>
                  <div className="row align-items-center mb-4">
                    <div className="col-md-8">
                      <p>
                        Founded in 2022, StockWise began with a simple observation: financial data was abundant but 
                        not accessible to everyday investors. Our founders, a team of financial analysts and software engineers, 
                        set out to create a platform that would bridge this gap by transforming complex market data into 
                        actionable insights.
                      </p>
                      <p>
                        Since then, we've grown to serve over 100,000 users worldwide, from individual retail investors 
                        to professional money managers. Our commitment to innovation and user-centered design has made 
                        StockWise a trusted name in financial technology.
                      </p>
                    </div>
                    <div className="col-md-4">
                      <img 
                        src="assets/team.jpg" 
                        alt="StockWise team" 
                        className="img-fluid rounded shadow-sm" 
                      />
                    </div>
                  </div>
                </section>

                <section className="mb-5">
                  <h3 className="h5 mb-3">Our Approach</h3>
                  <div className="row row-cols-1 row-cols-md-3 g-4 mb-4">
                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="text-primary mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M0 0h1v15h15v1H0V0Zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07Z"/>
                            </svg>
                          </div>
                          <h4 className="h6 card-title">Data-Driven Insights</h4>
                          <p className="card-text">We process millions of data points daily to provide you with actionable market intelligence and personalized recommendations.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="text-primary mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-shield-check" viewBox="0 0 16 16">
                              <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                              <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                          </div>
                          <h4 className="h6 card-title">Security First</h4>
                          <p className="card-text">Your data and financial information are protected with enterprise-grade security and encryption.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="text-primary mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-lightning" viewBox="0 0 16 16">
                              <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641l2.5-8.5z"/>
                            </svg>
                          </div>
                          <h4 className="h6 card-title">Continuous Innovation</h4>
                          <p className="card-text">We're constantly evolving our platform with new features and improvements based on user feedback and market trends.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="mb-5">
                  <h3 className="h5 mb-3">Leadership Team</h3>
                  <div className="row row-cols-1 row-cols-md-3 g-4">
                    <div className="col">
                      <div className="card border-0 shadow-sm">
                        <img src="assets/Sarah.jpg" className="card-img-top" alt="CEO" />
                        <div className="card-body">
                          <h5 className="card-title">Sarah Johnson</h5>
                          <p className="card-text text-muted">Chief Executive Officer</p>
                          <p className="card-text small">Former investment banker with 15+ years of experience in financial markets and fintech innovation.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card border-0 shadow-sm">
                        <img src="assets/Michael.jpg" className="card-img-top" alt="CTO" />
                        <div className="card-body">
                          <h5 className="card-title">Michael Chen</h5>
                          <p className="card-text text-muted">Chief Technology Officer</p>
                          <p className="card-text small">Tech veteran who previously led engineering teams at several successful financial technology startups.</p>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card border-0 shadow-sm">
                        <img src="assets/Alex.webp" className="card-img-top" alt="CFO" />
                        <div className="card-body">
                          <h5 className="card-title">Alex Rodriguez</h5>
                          <p className="card-text text-muted">Chief Financial Officer</p>
                          <p className="card-text small">Seasoned financial strategist with expertise in scaling fintech businesses and optimizing capital allocation.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="h5 mb-3">Contact Us</h3>
                  <div className="row display-flex justify-content-center">
                    <div className="col-md-6">
                      <form>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">Name</label>
                          <input type="text" className="form-control" id="name" placeholder="Your Name" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input type="email" className="form-control" id="email" placeholder="your.email@example.com" />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label">Message</label>
                          <textarea className="form-control" id="message" rows="4" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Send Message</button>
                      </form>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>StockWise Financial Platform</h5>
              <p className="small">Your trusted source for market insights and financial tracking.</p>
            </div>
            <div className="col-md-3">
              <h6>Quick Links</h6>
              <ul className="list-unstyled small">
                <li><a href="/" className="text-white text-decoration-none">Dashboard</a></li>
                <li><a href="/portfolio" className="text-white text-decoration-none">Portfolio</a></li>
                <li><a href="/market-news" className="text-white text-decoration-none">Market News</a></li>
                <li><a href="/listing" className="text-white text-decoration-none">Listings</a></li>
                <li><a href="/about" className="text-white text-decoration-none">About</a></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h6>Contact</h6>
              <p className="small">
                Email: support@stockwise.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <hr className="my-2" />
          <div className="text-center">
            <small>&copy; 2025 StockWise. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;