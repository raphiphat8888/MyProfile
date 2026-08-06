const { pool } = require('../config/db');
const { env } = require('../config/env');
const { ApiError } = require('../utils/ApiError');

const productSelect = `
  SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.stock,
    p.location_count,
    p.image_url,
    p.is_active,
    p.created_at,
    p.updated_at,
    c.id AS category_id,
    c.name AS category
  FROM products p
  LEFT JOIN categories c ON c.id = p.category_id
`;

function toProduct(row) {
  const stock = Number(row.stock);
  const locationCount = Number(row.location_count);

  return {
    id: String(row.id),
    name: row.name,
    price: Number(row.price),
    stock,
    stock_text: `${stock} in stock`,
    category: row.category || 'Uncategorized',
    location_count: locationCount,
    location_text: `${locationCount} ${locationCount === 1 ? 'store' : 'stores'}`,
    badge_status: stock <= env.LOW_STOCK_THRESHOLD ? 'Low in stock' : 'Active',
    image_url: row.image_url || '',
  };
}

async function listProducts() {
  const [rows] = await pool.query(
    `${productSelect}
     WHERE p.is_active = 1
     ORDER BY p.updated_at DESC, p.id DESC`,
  );

  return rows.map(toProduct);
}

async function getProductById(id, connection = pool) {
  const [rows] = await connection.execute(
    `${productSelect}
     WHERE p.id = ? AND p.is_active = 1
     LIMIT 1`,
    [id],
  );

  if (!rows[0]) {
    throw new ApiError(404, 'Product not found');
  }

  return rows[0];
}

async function findOrCreateCategory(connection, categoryName) {
  const normalizedName = categoryName.trim();
  const [rows] = await connection.execute(
    'SELECT id FROM categories WHERE name = ? LIMIT 1',
    [normalizedName],
  );

  if (rows[0]) {
    return rows[0].id;
  }

  const [result] = await connection.execute('INSERT INTO categories (name) VALUES (?)', [
    normalizedName,
  ]);
  return result.insertId;
}

async function createProduct(input) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const categoryId = await findOrCreateCategory(connection, input.category);
    const [result] = await connection.execute(
      `INSERT INTO products
        (category_id, name, description, price, stock, location_count, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId,
        input.name.trim(),
        input.description || null,
        input.price,
        input.stock,
        input.location_count,
        input.image_url || null,
      ],
    );
    const row = await getProductById(result.insertId, connection);
    await connection.commit();
    return toProduct(row);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function updateProduct(id, input) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const current = await getProductById(id, connection);
    const categoryId = input.category
      ? await findOrCreateCategory(connection, input.category)
      : current.category_id;

    await connection.execute(
      `UPDATE products
       SET category_id = ?,
           name = ?,
           description = ?,
           price = ?,
           stock = ?,
           location_count = ?,
           image_url = ?
       WHERE id = ?`,
      [
        categoryId,
        input.name ?? current.name,
        input.description ?? current.description,
        input.price ?? Number(current.price),
        input.stock ?? Number(current.stock),
        input.location_count ?? Number(current.location_count),
        input.image_url ?? current.image_url,
        id,
      ],
    );

    const updated = await getProductById(id, connection);
    await connection.commit();
    return toProduct(updated);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function deleteProduct(id) {
  await getProductById(id);
  await pool.execute('UPDATE products SET is_active = 0 WHERE id = ?', [id]);
}

module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  toProduct,
  updateProduct,
};
