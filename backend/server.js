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


// 🔥 TRIAL CHECK MIDDLEWARE (GLOBAL)
app.use((req, res, next) => {
  // Only protect API routes (skip homepage)
  if (req.path.startsWith("/api")) {
    
    // You MUST send user info from frontend (later step)
    

    if (user && user.plan === "trial") {
      const now = new Date();
      const trialEnd = new Date(user.trialEnd);

      if (now > trialEnd) {
        return res.status(403).json({
          message: "Your 15-day free trial has expired. Please subscribe."
        });
      }
    }
  }

  next();
});


app.use("/api/workers", workerRoutes);
app.use("/api/payfast", payfastRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});