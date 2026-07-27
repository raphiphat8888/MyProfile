const { pool } = require('../config/db');
const { ApiError } = require('../utils/ApiError');

async function createOrder(userId, { items, shipping_address }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    const productIds = [...new Set(items.map((item) => item.product_id))];
    const placeholders = productIds.map(() => '?').join(', ');
    const [products] = await connection.execute(
      `SELECT id, name, price, stock
       FROM products
       WHERE id IN (${placeholders}) AND is_active = 1
       FOR UPDATE`,
      productIds,
    );
    const productsById = new Map(products.map((product) => [Number(product.id), product]));

    if (productsById.size !== productIds.length) {
      throw new ApiError(400, 'One or more products do not exist');
    }

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const product = productsById.get(item.product_id);

      if (item.quantity > Number(product.stock)) {
        throw new ApiError(409, `Not enough stock for ${product.name}`);
      }

      const unitPrice = Number(product.price);
      const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
      totalAmount += lineTotal;

      return { ...item, lineTotal, unitPrice };
    });

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, status, total_amount, shipping_address)
       VALUES (?, 'pending', ?, ?)`,
      [userId, totalAmount.toFixed(2), shipping_address || null],
    );

    for (const item of orderItems) {
      await connection.execute(
        `INSERT INTO order_items
          (order_id, product_id, quantity, unit_price, line_total)
         VALUES (?, ?, ?, ?, ?)`,
        [orderResult.insertId, item.product_id, item.quantity, item.unitPrice, item.lineTotal],
      );
      await connection.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [
        item.quantity,
        item.product_id,
      ]);
    }

    await connection.commit();
    return {
      id: String(orderResult.insertId),
      status: 'pending',
      total_amount: Number(totalAmount.toFixed(2)),
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function listOrders(user) {
  const params = [];
  let where = '';

  if (user.role !== 'admin') {
    where = 'WHERE o.user_id = ?';
    params.push(user.id);
  }

  const [rows] = await pool.execute(
    `SELECT
       o.id,
       o.user_id,
       u.name AS customer_name,
       u.email AS customer_email,
       o.status,
       o.total_amount,
       o.shipping_address,
       o.created_at,
       o.updated_at
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     ${where}
     ORDER BY o.created_at DESC`,
    params,
  );

  return rows.map((row) => ({
    ...row,
    id: String(row.id),
    user_id: String(row.user_id),
    total_amount: Number(row.total_amount),
  }));
}

module.exports = { createOrder, listOrders };
