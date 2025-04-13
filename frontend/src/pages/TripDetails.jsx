import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockData } from "../data/mockData";

const TripDetails = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const data = mockData.getData();
    const numId = parseInt(id);
    let foundItem = null;
    
    if (type === "trips") foundItem = data.trips.find(item => item.id === numId);
    if (type === "events") foundItem = data.events.find(item => item.id === numId);
    if (type === "past") foundItem = data.pastActivities.find(item => item.id === numId);
    
    setItem(foundItem);
  }, [id, type]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      mockData.deleteItem(type, id);
      navigate("/dashboard");
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Item not found</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{item.title}</h1>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full
                ${
                  item.status === "Active"
                    ? "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900"
                    : item.status === "Planning"
                    ? "text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900"
                    : item.status === "Completed"
                    ? "text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-800"
                    : "text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900"
                }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Basic Information */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dates</p>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {new Date(item.startDate).toLocaleDateString()} -{" "}
                  {new Date(item.endDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                <p className="mt-1 text-gray-900 dark:text-white">{item.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Participants</p>
                <p className="mt-1 text-gray-900 dark:text-white">{item.participants} people</p>
              </div>
            </div>
          </div>

          {/* Packing Items */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Packing List
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {item.items.map((packingItem, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {packingItem.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {packingItem.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full
                            ${
                              packingItem.status === "Packed"
                                ? "text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900"
                                : packingItem.status === "Pending"
                                ? "text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900"
                                : "text-gray-800 bg-gray-100 dark:text-gray-200 dark:bg-gray-800"
                            }`}
                        >
                          {packingItem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => navigate(`/${type}/${id}/edit`)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDetails; 