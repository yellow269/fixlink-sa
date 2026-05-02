const payfastRoutes = require("./routes/payfastRoute");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const workerRoutes = require("./routes/workerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FixLink SA Backend Running");
});

app.use("/api/workers", workerRoutes);
app.use("/api/payfast", payfastRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});