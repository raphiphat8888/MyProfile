const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { pool } = require('../config/db');
const { env } = require('../config/env');
const { ApiError } = require('../utils/ApiError');

function createToken(user) {
  return jwt.sign(
    {
      role: user.role,
      name: user.name,
    },
    env.JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
}

function toPublicUser(user) {
  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

async function registerCustomer({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const [existingRows] = await pool.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [
    normalizedEmail,
  ]);

  if (existingRows.length > 0) {
    throw new ApiError(409, 'Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, 'customer')`,
    [name.trim(), normalizedEmail, passwordHash],
  );

  const user = {
    id: result.insertId,
    name: name.trim(),
    email: normalizedEmail,
    role: 'customer',
  };

  return { token: createToken(user), user: toPublicUser(user) };
}

async function login({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash, role, is_active
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [normalizedEmail],
  );

  const user = rows[0];
  const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.is_active) {
    throw new ApiError(403, 'This account is inactive');
  }

  return { token: createToken(user), user: toPublicUser(user) };
}

module.exports = { login, registerCustomer };
