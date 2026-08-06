const fs = require('node:fs/promises');
const path = require('node:path');

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function firstExistingPath(paths) {
  for (const candidate of paths) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next deployment layout.
    }
  }

  throw new Error(`Cannot find products.json in: ${paths.join(', ')}`);
}

async function main() {
  const productsPath = await firstExistingPath([
    path.resolve(__dirname, '../products.json'),
    path.resolve(__dirname, '../../products.json'),
  ]);
  const raw = await fs.readFile(productsPath, 'utf8');
  const products = JSON.parse(raw);

  if (!Array.isArray(products)) {
    throw new Error('products.json must be an array');
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: 'Z',
    decimalNumbers: true,
  });

  const categories = [...new Set(products.map((product) => String(product.category).trim()))];
  const categoryIds = new Map();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const categoryName of categories) {
      const [existingRows] = await connection.execute(
        'SELECT id FROM categories WHERE name = ? LIMIT 1',
        [categoryName],
      );

      if (existingRows[0]) {
        categoryIds.set(categoryName, Number(existingRows[0].id));
        continue;
      }

      const [result] = await connection.execute(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        [categoryName, null],
      );
      categoryIds.set(categoryName, Number(result.insertId));
    }

    for (const product of products) {
      const id = Number(product.id);
      const categoryId = categoryIds.get(String(product.category).trim());

      if (!categoryId) {
        throw new Error(`Missing category for product ${product.name}`);
      }

      await connection.execute(
        `INSERT INTO products
          (id, category_id, name, description, price, stock, location_count, image_url, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           category_id = VALUES(category_id),
           name = VALUES(name),
           description = VALUES(description),
           price = VALUES(price),
           stock = VALUES(stock),
           location_count = VALUES(location_count),
           image_url = VALUES(image_url),
           is_active = VALUES(is_active)`,
        [
          id,
          categoryId,
          String(product.name),
          null,
          0,
          Number(product.stock),
          Number(product.location_count),
          String(product.image_url),
        ],
      );
    }

    await connection.commit();
    console.log(`Imported ${products.length} products and ${categories.length} categories.`);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
