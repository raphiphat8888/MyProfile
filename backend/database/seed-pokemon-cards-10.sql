cd C:\Users\takt\Desktop\MyProfile

scp -P 2222 backend/src/routes/productRoutes.js `
  std6730202386@119.59.102.161:/app/src/routes/productRoutes.js

scp -P 2222 backend/src/controllers/productController.js `
  std6730202386@119.59.102.161:/app/src/controllers/productController.js

scp -P 2222 backend/src/services/productService.js `
  std6730202386@119.59.102.161:/app/src/services/productService.js-- Adds 10 real Pokemon TCG cards without removing existing products.
-- Prices are TCGplayer market prices in USD from pokemonTcg.io.

START TRANSACTION;

INSERT INTO categories (name, description)
VALUES ('Single Card', 'Individual cards for collectors and players')
ON DUPLICATE KEY UPDATE description = VALUES(description);

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Aggron - HS-Triumphant #1',
  'Pokemon TCG card hgss4-1; TCGplayer market price in USD.',
  9.80, 1, 1, 'https://images.pokemontcg.io/hgss4/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Aggron - HS-Triumphant #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Weedle - Primal Clash #1',
  'Pokemon TCG card xy5-1; TCGplayer market price in USD.',
  0.20, 1, 1, 'https://images.pokemontcg.io/xy5/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Weedle - Primal Clash #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Ampharos - Platinum #1',
  'Pokemon TCG card pl1-1; TCGplayer market price in USD.',
  32.84, 1, 1, 'https://images.pokemontcg.io/pl1/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ampharos - Platinum #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Ampharos - Secret Wonders #1',
  'Pokemon TCG card dp3-1; TCGplayer market price in USD.',
  42.56, 1, 1, 'https://images.pokemontcg.io/dp3/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ampharos - Secret Wonders #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Bulbasaur - Detective Pikachu #1',
  'Pokemon TCG card det1-1; TCGplayer market price in USD.',
  1.21, 1, 1, 'https://images.pokemontcg.io/det1/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bulbasaur - Detective Pikachu #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Dratini - Dragon Vault #1',
  'Pokemon TCG card dv1-1; TCGplayer market price in USD.',
  4.35, 1, 1, 'https://images.pokemontcg.io/dv1/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dratini - Dragon Vault #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Caterpie - McDonalds Collection 2019 #1',
  'Pokemon TCG card mcd19-1; TCGplayer market price in USD.',
  14.70, 1, 1, 'https://images.pokemontcg.io/mcd19/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Caterpie - McDonalds Collection 2019 #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Absol G - Supreme Victors #1',
  'Pokemon TCG card pl3-1; TCGplayer market price in USD.',
  35.95, 1, 1, 'https://images.pokemontcg.io/pl3/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Absol G - Supreme Victors #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Aerodactyl - Legend Maker #1',
  'Pokemon TCG card ex12-1; TCGplayer market price in USD.',
  79.60, 1, 1, 'https://images.pokemontcg.io/ex12/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Aerodactyl - Legend Maker #1');

INSERT INTO products
  (category_id, name, description, price, stock, location_count, image_url, is_active)
SELECT
  (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
  'Absol - Dragon #1',
  'Pokemon TCG card ex3-1; TCGplayer market price in USD.',
  164.66, 1, 1, 'https://images.pokemontcg.io/ex3/1_hires.png', 1
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Absol - Dragon #1');

COMMIT;
