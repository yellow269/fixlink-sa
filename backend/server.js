require("dotenv").config();

const express = require("express");
const cors = require("cors");

const workerRoutes = require("./routes/workerRoutes");
const payfastRoutes = require("./routes/payfastRoute");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("FixLink SA Backend Running");
});

// Routes
app.use("/api/workers", workerRoutes);
app.use("/api/payfast", payfastRoutes);

// ✅ Run locally (NOT on Vercel)
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

// ✅ Required for Vercel
module.exports = app;