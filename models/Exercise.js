const pool = require("../config/database");

const createExercisesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS exercises (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      description TEXT NOT NULL,
      duration INTEGER NOT NULL,
      date DATE NOT NULL DEFAULT CURRENT_DATE
    );
  `;
  await pool.query(query);
};

createExercisesTable();

module.exports = {};
