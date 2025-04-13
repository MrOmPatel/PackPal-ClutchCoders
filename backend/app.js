const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/items", itemRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;