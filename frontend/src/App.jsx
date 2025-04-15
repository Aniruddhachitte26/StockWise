// In App.jsx
import React, { useState } from "react";
import WatchlistPreview from "./components/dashboard/WatchlistPreview";
import { Bell, Settings, Search, User } from "lucide-react";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-blue-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            {sidebarOpen && <span className="text-xl font-bold">FinDash</span>}
          </div>
          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
        </div>
        
        <nav className="mt-6">
          <ul>
            <li className="px-4 py-3 hover:bg-blue-700 cursor-pointer bg-blue-700">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {sidebarOpen && <span>Dashboard</span>}
              </div>
            </li>
            <li className="px-4 py-3 hover:bg-blue-700 cursor-pointer">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {sidebarOpen && <span>Portfolio</span>}
              </div>
            </li>
            <li className="px-4 py-3 hover:bg-blue-700 cursor-pointer">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {sidebarOpen && <span>Watchlist</span>}
              </div>
            </li>
            <li className="px-4 py-3 hover:bg-blue-700 cursor-pointer">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {sidebarOpen && <span>Transactions</span>}
              </div>
            </li>
            <li className="px-4 py-3 hover:bg-blue-700 cursor-pointer">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {sidebarOpen && <span>Analytics</span>}
              </div>
            </li>
            <li className="px-4 py-3 hover:bg-blue-700 cursor-pointer">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                {sidebarOpen && <span>Settings</span>}
              </div>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              JS
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">John Smith</p>
                <p className="text-xs text-blue-200">Premium Account</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search for stocks, news, or analysis..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="h-6 w-6 text-gray-500" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <User className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Welcome back, John. Here's your financial overview.</p>
          </div>

          {/* Account Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Portfolio Value</h3>
                  <p className="text-2xl font-bold text-gray-800">$147,893.25</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +2.45%
                </span>
              </div>
              <div className="h-16 bg-gray-50 rounded mb-2">
                {/* Placeholder for chart */}
                <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                  Portfolio Performance Chart
                </div>
              </div>
              <p className="text-xs text-gray-500">Last updated: April 15, 2025 at 09:45 AM</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Today's Gain/Loss</h3>
                  <p className="text-2xl font-bold text-green-600">+$832.67</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  +0.56%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">Day High</p>
                  <p className="text-sm font-medium text-gray-800">$148,215.32</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-500">Day Low</p>
                  <p className="text-sm font-medium text-gray-800">$147,018.59</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Available Cash</h3>
                  <p className="text-2xl font-bold text-gray-800">$12,458.32</p>
                </div>
                <button className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1.5 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Deposit
                </button>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Buying Power</span>
                <span className="text-gray-800 font-medium">$24,916.64</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Margin Available</span>
                <span className="text-gray-800 font-medium">$12,458.32</span>
              </div>
            </div>
          </div>

          {/* Watchlist Preview Component */}
          <WatchlistPreview />

          {/* Additional dashboard content would go here */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Latest News</h3>
              <ul className="divide-y divide-gray-100">
                <li className="py-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">Fed Announces Interest Rate Decision</p>
                  <p className="text-xs text-gray-500 mb-1">The Federal Reserve announced today that it will maintain current interest rates...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Bloomberg • 2 hours ago</span>
                    <button className="text-xs text-blue-600 hover:text-blue-800">Read More</button>
                  </div>
                </li>
                <li className="py-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">Tech Stocks Rally Amid Positive Earnings</p>
                  <p className="text-xs text-gray-500 mb-1">Major technology companies posted better-than-expected quarterly results...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Financial Times • 4 hours ago</span>
                    <button className="text-xs text-blue-600 hover:text-blue-800">Read More</button>
                  </div>
                </li>
                <li className="py-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">Oil Prices Surge on Supply Concerns</p>
                  <p className="text-xs text-gray-500 mb-1">Global oil prices jumped over 3% today as geopolitical tensions...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Reuters • 5 hours ago</span>
                    <button className="text-xs text-blue-600 hover:text-blue-800">Read More</button>
                  </div>
                </li>
              </ul>
              <button className="w-full mt-3 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                View All News
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Upcoming Events</h3>
              <ul className="divide-y divide-gray-100">
                <li className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-lg p-2 mr-3 text-center w-14">
                      <span className="block text-xs font-medium">APR</span>
                      <span className="block text-lg font-bold">18</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">TSLA Earnings Release</p>
                      <p className="text-xs text-gray-500">Tesla Inc. Q1 2025 Earnings Call</p>
                      <p className="text-xs text-gray-400 mt-1">5:30 PM EST</p>
                    </div>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-lg p-2 mr-3 text-center w-14">
                      <span className="block text-xs font-medium">APR</span>
                      <span className="block text-lg font-bold">20</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">AMZN Earnings Release</p>
                      <p className="text-xs text-gray-500">Amazon.com Inc. Q1 2025 Earnings Call</p>
                      <p className="text-xs text-gray-400 mt-1">4:00 PM EST</p>
                    </div>
                  </div>
                </li>
                <li className="py-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-lg p-2 mr-3 text-center w-14">
                      <span className="block text-xs font-medium">APR</span>
                      <span className="block text-lg font-bold">23</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">MSFT Dividend Payment</p>
                      <p className="text-xs text-gray-500">Microsoft Corp. Quarterly Dividend</p>
                      <p className="text-xs text-gray-400 mt-1">$0.75 per share</p>
                    </div>
                  </div>
                </li>
              </ul>
              <button className="w-full mt-3 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                View Calendar
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;