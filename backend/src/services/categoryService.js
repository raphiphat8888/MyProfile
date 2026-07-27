const { pool } = require('../config/db');

async function listCategories() {
  const [rows] = await pool.query(
    `SELECT
       c.id,
       c.name,
       c.description,
       COUNT(p.id) AS product_count,
       COALESCE(SUM(CASE WHEN p.is_active = 1 THEN p.stock ELSE 0 END), 0) AS stock_total,
       COALESCE(SUM(CASE WHEN p.is_active = 1 THEN p.location_count ELSE 0 END), 0) AS location_total
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id
     GROUP BY c.id, c.name, c.description
     ORDER BY c.name ASC`,
  );

  return rows.map((row) => ({
    id: String(row.id),
    name: row.name,
    description: row.description,
    product_count: Number(row.product_count),
    stock_total: Number(row.stock_total),
    location_total: Number(row.location_total),
  }));
}

async function createCategory({ name, description }) {
  const [result] = await pool.execute(
    'INSERT INTO categories (name, description) VALUES (?, ?)',
    [name.trim(), description || null],
  );

  return {
    id: String(result.insertId),
    name: name.trim(),
    description: description || null,
    product_count: 0,
    stock_total: 0,
    location_total: 0,
  };
}

module.exports = { createCategory, listCategories };
