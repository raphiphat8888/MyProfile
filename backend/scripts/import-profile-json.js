const fs = require('node:fs/promises');
const path = require('node:path');

const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const LINK_KEYS = ['email', 'github', 'facebook', 'phone'];
const PROFILE_ID = 1;

async function firstExistingPath(paths) {
  for (const candidate of paths) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try the next deployment layout.
    }
  }

  throw new Error(`Cannot find data/profile.json in: ${paths.join(', ')}`);
}

function createPool() {
  return mysql.createPool({
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
}

function assertProfile(profile) {
  const missing = [
    'schemaVersion',
    'appName',
    'name',
    'role',
    'intro',
    'education',
    'summary',
    'location',
    'initials',
    'settings',
    'skills',
  ].filter((key) => profile[key] === undefined);

  if (missing.length > 0) {
    throw new Error(`data/profile.json is missing: ${missing.join(', ')}`);
  }

  for (const key of LINK_KEYS) {
    if (!profile[key]?.label || !profile[key]?.value || !profile[key]?.href) {
      throw new Error(`data/profile.json link "${key}" must have label, value, and href`);
    }
  }

  if (!Array.isArray(profile.skills)) {
    throw new Error('data/profile.json skills must be an array');
  }
}

async function main() {
  const profilePath = await firstExistingPath([
    path.resolve(__dirname, '../data/profile.json'),
    path.resolve(__dirname, '../../data/profile.json'),
  ]);
  const raw = await fs.readFile(profilePath, 'utf8');
  const profile = JSON.parse(raw);
  assertProfile(profile);

  const pool = createPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `INSERT INTO app_profiles
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
         home_product_limit = VALUES(home_product_limit)`,
      [
        PROFILE_ID,
        Number(profile.schemaVersion),
        profile.appName,
        profile.name,
        profile.role,
        profile.intro,
        profile.education,
        profile.summary,
        profile.location,
        profile.initials,
        profile.settings.currency,
        Number(profile.settings.lowStockThreshold),
        Number(profile.settings.homeProductLimit),
      ],
    );

    for (const key of LINK_KEYS) {
      const link = profile[key];
      await connection.execute(
        `INSERT INTO profile_links
          (profile_id, link_key, label, value, href)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           label = VALUES(label),
           value = VALUES(value),
           href = VALUES(href)`,
        [PROFILE_ID, key, link.label, link.value, link.href],
      );
    }

    const [oldGroups] = await connection.execute(
      'SELECT id FROM profile_skill_groups WHERE profile_id = ?',
      [PROFILE_ID],
    );
    const oldGroupIds = oldGroups.map((group) => group.id);
    if (oldGroupIds.length > 0) {
      const placeholders = oldGroupIds.map(() => '?').join(', ');
      await connection.execute(
        `DELETE FROM profile_skill_items WHERE skill_group_id IN (${placeholders})`,
        oldGroupIds,
      );
    }
    await connection.execute('DELETE FROM profile_skill_groups WHERE profile_id = ?', [PROFILE_ID]);

    for (const [groupIndex, group] of profile.skills.entries()) {
      const [groupResult] = await connection.execute(
        `INSERT INTO profile_skill_groups
          (profile_id, sort_order, title, description)
         VALUES (?, ?, ?, ?)`,
        [PROFILE_ID, groupIndex + 1, group.title, group.description],
      );

      for (const [skillIndex, skill] of group.skills.entries()) {
        await connection.execute(
          `INSERT INTO profile_skill_items
            (skill_group_id, sort_order, name)
           VALUES (?, ?, ?)`,
          [groupResult.insertId, skillIndex + 1, skill],
        );
      }
    }

    await connection.commit();
    console.log(`Imported profile "${profile.appName}" with ${profile.skills.length} skill groups.`);
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
