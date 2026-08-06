-- Import this after schema.sql to move data/profile.json into MySQL.

START TRANSACTION;

INSERT INTO app_profiles
  (
    id,
    schema_version,
    app_name,
    name,
    role,
    intro,
    education,
    summary,
    location,
    initials,
    currency,
    low_stock_threshold,
    home_product_limit
  )
VALUES
  (
    1,
    1,
    'Pokémon Takt Shop',
    'Pokémon Takt Shop',
    'Trading Card Store',
    'Buy singles, booster packs, starter decks, and collector cards with clean photos, fair prices, and friendly service.',
    'Pokemon card seller and collector',
    'Pokémon Takt Shop helps players and collectors browse authentic cards, check stock, and contact the shop before ordering.',
    'Thailand',
    'RC',
    'THB',
    5,
    4
  )
ON DUPLICATE KEY UPDATE
  schema_version = VALUES(schema_version),
  app_name = VALUES(app_name),
  name = VALUES(name),
  role = VALUES(role),
  intro = VALUES(intro),
  education = VALUES(education),
  summary = VALUES(summary),
  location = VALUES(location),
  initials = VALUES(initials),
  currency = VALUES(currency),
  low_stock_threshold = VALUES(low_stock_threshold),
  home_product_limit = VALUES(home_product_limit);

INSERT INTO profile_links
  (profile_id, link_key, label, value, href)
VALUES
  (1, 'email', 'Order Email', 'raphiphat.s@ku.th', 'mailto:raphiphat.s@ku.th'),
  (1, 'github', 'Card Catalog', 'github.com/raphiphat8888', 'https://github.com/raphiphat8888'),
  (1, 'facebook', 'Facebook Shop', 'facebook.com/raphiphat8888', 'https://facebook.com/raphiphat8888'),
  (1, 'phone', 'Phone / Line', 'Add order phone', 'tel:+66000000000')
ON DUPLICATE KEY UPDATE
  label = VALUES(label),
  value = VALUES(value),
  href = VALUES(href);

DELETE FROM profile_skill_items
WHERE skill_group_id IN (
  SELECT id FROM profile_skill_groups WHERE profile_id = 1
);

DELETE FROM profile_skill_groups
WHERE profile_id = 1;

INSERT INTO profile_skill_groups
  (id, profile_id, sort_order, title, description)
VALUES
  (1, 1, 1, 'Single Cards', 'Individual cards for collectors and deck builders.'),
  (2, 1, 2, 'Sealed Products', 'Fresh packs and boxes for opening or keeping sealed.'),
  (3, 1, 3, 'Card Condition', 'Clear condition labels before every order.'),
  (4, 1, 4, 'Shop Service', 'Friendly support for choosing cards and confirming stock.');

INSERT INTO profile_skill_items
  (skill_group_id, sort_order, name)
VALUES
  (1, 1, 'Pikachu'),
  (1, 2, 'Charizard'),
  (1, 3, 'Trainer'),
  (1, 4, 'Energy'),
  (1, 5, 'Holo'),
  (2, 1, 'Booster Pack'),
  (2, 2, 'Deck Box'),
  (2, 3, 'Promo Pack'),
  (2, 4, 'Gift Set'),
  (3, 1, 'Near Mint'),
  (3, 2, 'Light Play'),
  (3, 3, 'Sleeved'),
  (3, 4, 'Top Loader'),
  (4, 1, 'Stock Check'),
  (4, 2, 'Card Photos'),
  (4, 3, 'Order Chat'),
  (4, 4, 'Delivery');

COMMIT;
