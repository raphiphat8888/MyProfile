INSERT INTO categories (name)
VALUES
  ('Single Card'),
  ('Bundle'),
  ('Sealed Pack'),
  ('Deck')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO products
  (id, category_id, name, price, stock, location_count, image_url, is_active)
VALUES
  (
    1,
    (SELECT id FROM categories WHERE name = 'Single Card' LIMIT 1),
    'Pikachu Collector Card',
    0.00,
    8,
    3,
    'https://images.pokemontcg.io/basep/1_hires.png',
    1
  ),
  (
    2,
    (SELECT id FROM categories WHERE name = 'Bundle' LIMIT 1),
    'Charizard Fire Bundle',
    0.00,
    2,
    1,
    'https://images.pokemontcg.io/base4/4_hires.png',
    1
  ),
  (
    3,
    (SELECT id FROM categories WHERE name = 'Sealed Pack' LIMIT 1),
    'Booster Pack Set',
    0.00,
    24,
    4,
    'https://images.pokemontcg.io/swshp/SWSH050_hires.png',
    1
  ),
  (
    4,
    (SELECT id FROM categories WHERE name = 'Deck' LIMIT 1),
    'Starter Deck Box',
    0.00,
    5,
    2,
    'https://images.pokemontcg.io/base1/2_hires.png',
    1
  )
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  name = VALUES(name),
  stock = VALUES(stock),
  location_count = VALUES(location_count),
  image_url = VALUES(image_url),
  is_active = VALUES(is_active);
