const Item = require("../models/Item");

// @desc    Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items", error: err.message });
  }
};

// @desc    Create a new item
exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to create item", error: err.message });
  }
};

// @desc    Update an item
exports.updateItem = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Item not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update item", error: err.message });
  }
};