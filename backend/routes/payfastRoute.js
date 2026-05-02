const express = require("express");
const crypto = require("crypto");
const pool = require("../db");
const router = express.Router();

// Replace these with your real PayFast merchant details
const merchant_id = process.env.PAYFAST_MERCHANT_ID || "10000100";
const merchant_key = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a";
const passphrase = process.env.PAYFAST_PASSPHRASE || "";

// Build PayFast checkout URL
router.get("/checkout", async (req, res) => {
  try {
    const paymentData = {
      merchant_id,
      merchant_key,
      return_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancelled",
      notify_url: "http://localhost:5000/api/payfast/notify",
      name_first: "FixLink",
      name_last: "Worker",
      email_address: "worker@example.com",
      m_payment_id: `fixlink_${Date.now()}`,
      amount: "299.00",
      item_name: "Featured Worker Upgrade",
      item_description: "Monthly featured worker subscription",
    };

    let queryString = Object.keys(paymentData)
      .map(
        (key) =>
          `${key}=${encodeURIComponent(paymentData[key])}`
      )
      .join("&");

    if (passphrase) {
      queryString += `&passphrase=${encodeURIComponent(passphrase)}`;
    }

    const payfastUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}`;

    return res.redirect(payfastUrl);
  } catch (error) {
    console.error("PayFast checkout error:", error);
    return res.status(500).json({
      message: "Failed to start PayFast checkout",
    });
  }
});

// PayFast server notification endpoint
router.post(
  "/notify",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      console.log("PayFast Notify:", req.body);

      // Temporary test worker ID
      const workerId = 1;

      await pool.query(
        `
        UPDATE workers
        SET featured = true,
            verified = true
        WHERE id = $1
        `,
        [workerId]
      );

      console.log("Worker upgraded to Featured + Verified");

      return res.status(200).send("OK");
    } catch (error) {
      console.error("PayFast notify error:", error);
      return res.status(500).send("Error");
    }
  }
);
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const worker = await pool.query(
      "SELECT * FROM workers WHERE email = $1",
      [email]
    );

    if (worker.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    const user = worker.rows[0];

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    return res.json({
      success: true,
      message: "Login successful",
      worker: user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router;
