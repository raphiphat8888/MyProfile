-- Login accounts for Pokemon Takt Shop.
-- Admin login: admin@pokemon-takt.shop / Admin@1234
-- User login: user@pokemon-takt.shop / User@1234

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
