-- Import this after schema.sql to move the current products.json catalog into MySQL.
-- Price is set to 0.00 because the JSON source does not contain pricing.

START TRANSACTION;

INSERT INTO categories (id, name, description)
VALUES
  (1, 'Single Card', 'Individual cards for collectors and players'),
  (2, 'Bundle', 'Card bundles and grouped products'),
  (3, 'Sealed Pack', 'Booster packs and sealed products'),
  (4, 'Deck', 'Starter decks and boxed sets'),
  (6, 'Ultra Secret Rare', 'Ultra rare custom showcase cards')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO products
  (id, category_id, name, description, price, stock, location_count, image_url, is_active)
VALUES
  (1, 1, 'Pikachu Collector Card', NULL, 0.00, 8, 3, 'https://images.pokemontcg.io/basep/1_hires.png', 1),
  (2, 2, 'Charizard Fire Bundle', NULL, 0.00, 2, 1, 'https://images.pokemontcg.io/base4/4_hires.png', 1),
  (3, 3, 'Booster Pack Set', NULL, 0.00, 24, 4, 'https://images.pokemontcg.io/swshp/SWSH050_hires.png', 1),
  (4, 4, 'Starter Deck Box', NULL, 0.00, 5, 2, 'https://images.pokemontcg.io/base1/2_hires.png', 1),
  (5, 1, 'Mewtwo EX Holo', NULL, 0.00, 3, 2, 'https://images.pokemontcg.io/base1/10_hires.png', 1),
  (7, 1, 'Venusaur Base Set', NULL, 0.00, 6, 3, 'https://images.pokemontcg.io/base1/15_hires.png', 1),
  (8, 1, 'Gengar Prime', NULL, 0.00, 2, 1, 'https://images.pokemontcg.io/hgss4/94_hires.png', 1),
  (9, 1, 'Lugia Legend Top', NULL, 0.00, 1, 1, 'https://images.pokemontcg.io/hgss4/97_hires.png', 1),
  (10, 2, 'Scarlet & Violet Bundle', NULL, 0.00, 18, 4, 'https://images.pokemontcg.io/sv1/6_hires.png', 1),
  (11, 1, 'Umbreon VMAX Alt Art', NULL, 0.00, 1, 1, 'https://images.pokemontcg.io/swsh7/215_hires.png', 1),
  (12, 3, 'Evolving Skies Booster Box', NULL, 0.00, 7, 3, 'https://images.pokemontcg.io/swsh7/1_hires.png', 1),
  (13, 1, 'Rayquaza VMAX', NULL, 0.00, 3, 2, 'https://images.pokemontcg.io/swsh7/111_hires.png', 1),
  (14, 1, 'Charizard VSTAR', NULL, 0.00, 2, 1, 'https://images.pokemontcg.io/swsh9/174_hires.png', 1),
  (15, 3, 'Paldea Evolved Booster', NULL, 0.00, 30, 5, 'https://images.pokemontcg.io/sv2/1_hires.png', 1),
  (16, 1, 'Espeon VMAX Alt Art', NULL, 0.00, 2, 1, 'https://images.pokemontcg.io/swsh7/214_hires.png', 1),
  (17, 1, 'Pikachu VMAX Rainbow', NULL, 0.00, 4, 2, 'https://images.pokemontcg.io/swsh4/188_hires.png', 1),
  (18, 4, 'Trainer Collection Box', NULL, 0.00, 10, 3, 'https://images.pokemontcg.io/sv1/199_hires.png', 1),
  (19, 1, 'Mew VMAX', NULL, 0.00, 5, 2, 'https://images.pokemontcg.io/swsh12pt5/114_hires.png', 1),
  (20, 2, '151 Ultra Premium Collection', NULL, 0.00, 3, 2, 'https://images.pokemontcg.io/sv3pt5/205_hires.png', 1),
  (21, 1, 'Alakazam Base Set Holo', NULL, 0.00, 3, 2, 'https://images.pokemontcg.io/base1/1_hires.png', 1),
  (22, 1, 'Clefairy Base Set Holo', NULL, 0.00, 9, 3, 'https://images.pokemontcg.io/base1/5_hires.png', 1),
  (23, 1, 'Gyarados Base Set Holo', NULL, 0.00, 4, 2, 'https://images.pokemontcg.io/base1/6_hires.png', 1),
  (24, 1, 'Hitmonchan Base Set Holo', NULL, 0.00, 7, 3, 'https://images.pokemontcg.io/base1/7_hires.png', 1),
  (25, 1, 'Machamp Base Set Holo', NULL, 0.00, 11, 4, 'https://images.pokemontcg.io/base1/8_hires.png', 1),
  (26, 1, 'Magneton Base Set Holo', NULL, 0.00, 6, 2, 'https://images.pokemontcg.io/base1/9_hires.png', 1),
  (27, 1, 'Nidoking Base Set Holo', NULL, 0.00, 5, 2, 'https://images.pokemontcg.io/base1/11_hires.png', 1),
  (28, 1, 'Ninetales Base Set Holo', NULL, 0.00, 4, 2, 'https://images.pokemontcg.io/base1/12_hires.png', 1),
  (29, 1, 'Poliwrath Base Set Holo', NULL, 0.00, 8, 3, 'https://images.pokemontcg.io/base1/13_hires.png', 1),
  (30, 1, 'Raichu Base Set Holo', NULL, 0.00, 5, 2, 'https://images.pokemontcg.io/base1/14_hires.png', 1),
  (31, 1, 'Zapdos Base Set Holo', NULL, 0.00, 2, 1, 'https://images.pokemontcg.io/base1/16_hires.png', 1),
  (32, 1, 'Articuno Base Set Holo', NULL, 0.00, 2, 1, 'https://images.pokemontcg.io/base1/17_hires.png', 1),
  (33, 1, 'Moltres Base Set Holo', NULL, 0.00, 3, 2, 'https://images.pokemontcg.io/base1/18_hires.png', 1),
  (35, 1, 'Gold Star Espeon', NULL, 0.00, 1, 1, 'https://images.pokemontcg.io/ex7/101_hires.png', 1),
  (36, 1, 'Gold Star Umbreon', NULL, 0.00, 1, 1, 'https://images.pokemontcg.io/ex7/17_hires.png', 1),
  (37, 1, 'Gold Star Charizard', NULL, 0.00, 1, 1, 'https://images.pokemontcg.io/ecard1/147_hires.png', 1),
  (38, 1, 'Shining Gyarados Neo', NULL, 0.00, 2, 1, 'https://images.pokemontcg.io/neo2/65_hires.png', 1),
  (40, 3, 'Celebrations Booster Pack', NULL, 0.00, 20, 5, 'https://images.pokemontcg.io/cel25/25_hires.png', 1),
  (43, 1, 'Arceus VSTAR', NULL, 0.00, 5, 2, 'https://images.pokemontcg.io/swsh9/123_hires.png', 1),
  (44, 3, 'Brilliant Stars Booster Box', NULL, 0.00, 8, 3, 'https://images.pokemontcg.io/swsh9/186_hires.png', 1),
  (45, 1, 'Mewtwo V-UNION', NULL, 0.00, 3, 2, 'https://images.pokemontcg.io/swsh7/185_hires.png', 1),
  (46, 1, 'Sylveon VMAX', NULL, 0.00, 4, 2, 'https://images.pokemontcg.io/swsh6/92_hires.png', 1),
  (47, 3, 'Fusion Strike Booster Box', NULL, 0.00, 9, 3, 'https://images.pokemontcg.io/swsh8/264_hires.png', 1),
  (48, 1, 'Darkrai VSTAR', NULL, 0.00, 3, 2, 'https://tcgplayer-cdn.tcgplayer.com/product/478077_in_1000x1000.jpg', 1),
  (49, 1, 'Ice Rider Calyrex VMAX', NULL, 0.00, 3, 2, 'https://images.pokemontcg.io/swsh6/47_hires.png', 1)
ON DUPLICATE KEY UPDATE
  category_id = VALUES(category_id),
  name = VALUES(name),
  description = VALUES(description),
  price = VALUES(price),
  stock = VALUES(stock),
  location_count = VALUES(location_count),
  image_url = VALUES(image_url),
  is_active = VALUES(is_active);

COMMIT;
