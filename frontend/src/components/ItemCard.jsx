import React, { useState } from "react";
import { updateItem } from "../services/itemService";

const ItemCard = ({ item, userRole, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState({ ...item });

  const handleStatusChange = async (field, value) => {
    try {
      const updatedItem = await updateItem(item._id, { [field]: value });
      onUpdate(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleEdit = () => {
    if (userRole === "Owner" || userRole === "Admin") {
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      const updatedItem = await updateItem(item._id, editedItem);
      onUpdate(updatedItem);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={editedItem.name}
            onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
            className="w-full px-2 py-1 border rounded"
          />
          <input
            type="text"
            value={editedItem.category}
            onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value })}
            className="w-full px-2 py-1 border rounded"
          />
          <input
            type="text"
            value={editedItem.assignedTo}
            onChange={(e) => setEditedItem({ ...editedItem, assignedTo: e.target.value })}
            className="w-full px-2 py-1 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-600">Category: {item.category}</div>
              <div className="text-sm">Assigned to: {item.assignedTo || "Unassigned"}</div>
            </div>
            {(userRole === "Owner" || userRole === "Admin") && (
              <button
                onClick={handleEdit}
                className="text-gray-500 hover:text-gray-700"
              >
                ✏️
              </button>
            )}
          </div>
          
          <div className="mt-3 flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm mr-2">Packed:</span>
              <button
                onClick={() => handleStatusChange("packed", !item.packed)}
                className={`px-2 py-1 rounded text-sm ${
                  item.packed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
                disabled={userRole === "Viewer"}
              >
                {item.packed ? "✅" : "❌"}
              </button>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">Delivered:</span>
              <button
                onClick={() => handleStatusChange("delivered", !item.delivered)}
                className={`px-2 py-1 rounded text-sm ${
                  item.delivered ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
                disabled={userRole === "Viewer"}
              >
                {item.delivered ? "📦" : "—"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemCard;