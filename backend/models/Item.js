const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  assignedTo: { type: String, default: "" },
  packed: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);