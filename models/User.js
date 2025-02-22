const pool = require("../config/database");

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL
    );
  `;
  await pool.query(query);
};

createUsersTable();

module.exports = {};
