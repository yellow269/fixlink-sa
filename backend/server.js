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


// 🔥 REMOVE BROKEN TRIAL MIDDLEWARE FOR NOW
// (We already handle trial inside workerRoutes)

app.use("/api/workers", workerRoutes);
app.use("/api/payfast", payfastRoutes);


// ❗ VERCEL REQUIRES THIS (NOT app.listen)
module.exports = app;