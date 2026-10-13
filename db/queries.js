const pool = require("./pool");

async function usernameExists(username) {
  const { rows } = await pool.query(
    `
    SELECT EXISTS (SELECT 1 FROM users WHERE username = $1)
    `,
    [username],
  );
  return rows[0].exists;
}

async function createUser(fname, lname, username, password) {
  const res = await pool.query(
    `INSERT INTO users (first_name, last_name, username, password_hash) VALUES ($1, $2, $3, $4)`,
    [fname, lname, username, password],
  );
  console.log(res, "RES.................");
  return res.rowCount;
}

async function getHash(username) {
  const { rows } = await pool.query(
    `
    SELECT password_hash FROM users WHERE username = $1`,
    [username],
  );
  return rows[0].password_hash || null;
}

async function setMembership(userId) {
  const { rowCount } = await pool.query(
    `
    UPDATE users
    SET member = TRUE,
    admin = FALSE
    WHERE id = $1
    `,
    [userId],
  );
  return rowCount;
}

async function setAdmin(userId) {
  const { rowCount } = await pool.query(
    `
    UPDATE users
    SET member = FALSE,
    admin = TRUE
    WHERE id = $1
    `,
    [userId],
  );
  return rowCount;
}

async function createNewMessage(userId, title, message) {
  await pool.query(
    `
    INSERT INTO messages (title, message, posted_by) VALUES($1, $2, $3);
    `,
    [title, message, userId],
  );
}

async function getMessages() {
  const { rows } = await pool.query(`
    SELECT messages.*, to_char(posted_on, 'YYYY-MM-DD"T"HH24:MI:SSOF') AS timestamp, first_name, last_name FROM messages 
    LEFT JOIN users ON messages.posted_by = users.id
    `);
  return rows;
}

async function deleteMessage(messageId) {
  const res = await pool.query(
    `
    DELETE FROM messages 
    WHERE id = $1
    `,
    [messageId],
  );
  return res.rowCount;
}

module.exports = {
  usernameExists,
  createUser,
  getHash,
  setMembership,
  setAdmin,
  createNewMessage,
  getMessages,
  deleteMessage,
};
