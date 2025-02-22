const express = require("express");
const pool = require("../config/database");
const router = express.Router();

// Create a new user
router.post("/users", async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = await pool.query(
      "INSERT INTO users (username) VALUES ($1) RETURNING *",
      [username]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
