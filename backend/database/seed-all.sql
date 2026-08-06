-- Optional demo accounts and order history.
-- Admin login: admin@pokemon-takt.shop / Admin@1234
-- User login: user@pokemon-takt.shop / User@1234
-- Import schema.sql, seed-products-from-json.sql, and seed-profile-from-json.sql first
-- when you want the current JSON catalog/profile in MySQL.

START TRANSACTION;

INSERT INTO categories (id, name, description)
VALUES
  (1, 'Single Card', 'Individual cards for collectors and players'),
  (2, 'Bundle', 'Card bundles and grouped products'),
  (3, 'Sealed Pack', 'Booster packs and sealed products'),
  (4, 'Deck', 'Starter decks and boxed sets'),
  (5, 'Promo', 'Promo cards and special releases'),
  (6, 'Ultra Secret Rare', 'Ultra rare custom showcase cards')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO users (id, name, email, password_hash, role, is_active)
VALUES
  (
    1,
    'Takt Admin',
    'admin@pokemon-takt.shop',
    '$2b$12$ZyGKRzzZ6dJFLEUFiIRpRucL2EWH.Q6Z7eSiiapbmUmJ9VTgiZb9K',
    'admin',
    1
  ),
  (
    2,
    'Takt Trainer',
    'user@pokemon-takt.shop',
    '$2b$12$sMvym623/dHCObhvp.j7..k/m4qrHWiULqRR39G3eOsvGTJJpi1EO',
    'customer',
    1
  )
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  email = VALUES(email),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  is_active = VALUES(is_active);

INSERT INTO orders
  (id, user_id, status, total_amount, shipping_address)
VALUES
  (
    1,
    2,
    'pending',
    180.00,
    'Bangkok, Thailand'
  ),
  (
    2,
    1,
    'processing',
    61.00,
    'Warehouse pickup'
  )
ON DUPLICATE KEY UPDATE
  user_id = VALUES(user_id),
  status = VALUES(status),
  total_amount = VALUES(total_amount),
  shipping_address = VALUES(shipping_address);

INSERT INTO order_items
  (id, order_id, product_id, quantity, unit_price, line_total)
VALUES
  (1, 1, 2, 1, 145.00, 145.00),
  (2, 1, 3, 1, 12.00, 12.00),
  (3, 1, 5, 1, 6.00, 6.00),
  (4, 2, 4, 1, 49.00, 49.00),
  (5, 2, 1, 1, 28.00, 28.00)
ON DUPLICATE KEY UPDATE
  order_id = VALUES(order_id),
  product_id = VALUES(product_id),
  quantity = VALUES(quantity),
  unit_price = VALUES(unit_price),
  line_total = VALUES(line_total);

COMMIT;
