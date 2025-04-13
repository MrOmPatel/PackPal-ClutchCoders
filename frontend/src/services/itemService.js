import axios from "axios";

const API = "http://localhost:3000/api/items";

export const getItems = async () => {
  try {
    console.log("Fetching items from:", API); // Debug log
    const res = await axios.get(API);
    console.log("API Response:", res); // Debug log
    return res.data;
  } catch (err) {
    console.error("Error in getItems:", err.response || err);
    throw new Error(err.response?.data?.message || "Failed to fetch items");
  }
};

export const createItem = async (itemData) => {
  try {
    console.log("Creating item:", itemData);
    const res = await axios.post(API, itemData);
    console.log("Create item response:", res);
    return res.data;
  } catch (err) {
    console.error("Error in createItem:", err.response || err);
    throw new Error(err.response?.data?.message || "Failed to create item");
  }
};

export const updateItem = async (id, itemData) => {
  try {
    console.log("Updating item:", id, itemData);
    const res = await axios.put(`${API}/${id}`, itemData);
    console.log("Update item response:", res);
    return res.data;
  } catch (err) {
    console.error("Error in updateItem:", err.response || err);
    throw new Error(err.response?.data?.message || "Failed to update item");
  }
};