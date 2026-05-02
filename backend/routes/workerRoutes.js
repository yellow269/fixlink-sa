const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST - Register worker
router.post("/register", async (req, res) => {
  try {
    const { name, skill, location,  phone } = req.body;

    console.log("Incoming data:", name, skill, location);

    const result = await pool.query(
      "INSERT INTO workers (name, skill, location, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, skill, location, phone]
    );

    res.json({
      message: "Worker registered successfully",
      worker: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// GET - Fetch all workers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM workers ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;