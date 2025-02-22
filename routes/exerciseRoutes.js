const express = require("express");
const pool = require("../config/database");
const router = express.Router();

// Add exercise to user
router.post("/users/:id/exercises", async (req, res) => {
  const { id } = req.params;
  const { description, duration, date } = req.body;

  try {
    const newExercise = await pool.query(
      "INSERT INTO exercises (user_id, description, duration, date) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, description, duration, date || new Date().toISOString().split("T")[0]]
    );

    const user = await pool.query("SELECT username FROM users WHERE id = $1", [id]);

    res.json({
      _id: id,
      username: user.rows[0].username,
      description: newExercise.rows[0].description,
      duration: newExercise.rows[0].duration,
      date: newExercise.rows[0].date.toDateString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user logs
router.get("/users/:id/logs", async (req, res) => {
  const { id } = req.params;
  const { from, to, limit } = req.query;

  try {
    let query = "SELECT * FROM exercises WHERE user_id = $1";
    let params = [id];

    if (from && to) {
      query += " AND date BETWEEN $2 AND $3";
      params.push(from, to);
    }

    if (limit) {
      query += " LIMIT $4";
      params.push(limit);
    }

    const logs = await pool.query(query, params);
    const user = await pool.query("SELECT username FROM users WHERE id = $1", [id]);

    res.json({
      _id: id,
      username: user.rows[0].username,
      count: logs.rows.length,
      log: logs.rows.map(log => ({
        description: log.description,
        duration: log.duration,
        date: log.date.toDateString(),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
