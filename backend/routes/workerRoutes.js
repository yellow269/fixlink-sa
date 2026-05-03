const express = require("express");
const router = express.Router();
const pool = require("../db");

// 🔥 TRIAL CHECK FUNCTION
const isTrialActive = (trialEnd) => {
  if (!trialEnd) return true;

  const now = new Date();
  return now <= new Date(trialEnd);
};


// ✅ POST - Register worker (WITH TRIAL)
router.post("/register", async (req, res) => {
  try {
    const { name, skill, location, phone } = req.body;

    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(now.getDate() + 15);

    const result = await pool.query(
      `INSERT INTO workers 
      (name, skill, location, phone, plan, trial_start, trial_end) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [name, skill, location, phone, "trial", now, trialEnd]
    );

    res.json({
      message: "Worker registered with 15-day free trial",
      worker: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


// ✅ GET - Fetch all workers (WITH TRIAL CHECK)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM workers ORDER BY id DESC"
    );

    const workers = result.rows;

    // 🔥 Check trial for each worker
    const activeWorkers = workers.filter(worker => {
      if (worker.plan === "trial") {
        return isTrialActive(worker.trial_end);
      }
      return true; // premium users always allowed
    });

    // ❌ If ALL expired
    if (activeWorkers.length === 0) {
      return res.status(403).json({
        message: "All trials expired. Please subscribe."
      });
    }

    res.json(activeWorkers);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;