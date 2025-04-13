import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockData } from "../data/mockData";
import { generatePackingListPDF } from "../utils/pdfGenerator";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("trips");
  const [exportingIds, setExportingIds] = useState(new Set());
  const [data, setData] = useState({ trips: [], events: [], pastActivities: [] });

  // Load data
  useEffect(() => {
    setData(mockData.getData());
  }, []);

  // Get the data for the active tab
  const getActiveData = () => {
    switch (activeTab) {
      case "trips":
        return data.trips;
      case "events":
        return data.events;
      case "past":
        return data.pastActivities;
      default:
        return [];
    }
  };

  const handleViewDetails = (id) => {
    const path = activeTab === "past" ? "past" : activeTab === "events" ? "events" : "trips";
    navigate(`/${path}/${id}`);
  };

  const handleEdit = (id) => {
    const path = activeTab === "past" ? "past" : activeTab === "events" ? "events" : "trips";
    navigate(`/${path}/${id}/edit`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const type = activeTab === "past" ? "past" : activeTab === "events" ? "events" : "trips";
      mockData.deleteItem(type, id);
      // Update the local state to reflect the deletion
      setData(mockData.getData());
    }
  };

  const handleExportPDF = (item) => {
    setExportingIds(prev => new Set([...prev, item.id]));
    try {
      const pdfDoc = generatePackingListPDF(item, `${item.title} - Packing List`);
      pdfDoc.save(`${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_packing_list.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setExportingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const activeData = getActiveData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
                to="/contact"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact Us
              </Link>
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </button>
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Settings
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Events & Trips</h1>
          <Link
            to="/create-trip"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Create New Event/Trip
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("trips")}
              className={`${
                activeTab === "trips"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upcoming Trips
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`${
                activeTab === "events"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`${
                activeTab === "past"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Past Activities
            </button>
          </nav>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeData.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full
                    ${item.status === "Active" ? "text-green-800 dark:text-green-200 bg-green-100 dark:bg-green-900" :
                      item.status === "Planning" ? "text-blue-800 dark:text-blue-200 bg-blue-100 dark:bg-blue-900" :
                      item.status === "Completed" ? "text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700" :
                      "text-yellow-800 dark:text-yellow-200 bg-yellow-100 dark:bg-yellow-900"
                    }`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                </p>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="mr-2">👥</span>
                    <span>{item.participants} participants</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span className="mr-2">📍</span>
                    <span>{item.location}</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleViewDetails(item.id)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleExportPDF(item)}
                      disabled={exportingIds.has(item.id)}
                      className={`text-sm font-medium ${
                        exportingIds.has(item.id)
                          ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                          : "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                      }`}
                    >
                      {exportingIds.has(item.id) ? "Exporting..." : "Export PDF"}
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                    >
                      <span className="sr-only">Edit</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                    >
                      <span className="sr-only">Delete</span>
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;