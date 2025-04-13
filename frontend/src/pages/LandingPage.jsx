import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-4xl">🎒</span>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                  BagBuddy
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/signin"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/signin"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            🎒 BagBuddy
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Your Smart Packing Companion for Group Travel
          </p>
          <div className="flex justify-center">
            <Link
              to="/signin"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Why Choose BagBuddy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Group Collaboration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Work together with your travel companions to organize and track
                shared items.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Real-time Updates</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay in sync with instant updates on packing status and item
                assignments.
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-xl">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Smart Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track progress with detailed statistics and export your packing
                lists.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How BagBuddy Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">1️⃣</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create a List</h3>
              <p className="text-gray-600 dark:text-gray-300">Start with our smart templates</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">2️⃣</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assign Items</h3>
              <p className="text-gray-600 dark:text-gray-300">Distribute responsibilities</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">3️⃣</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">Monitor packing status</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">4️⃣</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Travel Ready</h3>
              <p className="text-gray-600 dark:text-gray-300">Export and share your list</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-500 dark:bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Simplify Your Group Travel?
          </h2>
          <Link
            to="/signin"
            className="bg-white text-blue-500 dark:bg-gray-100 dark:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 