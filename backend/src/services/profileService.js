const fallbackProfile = require('../../../data/profile.json');
const { pool } = require('../config/db');

const PROFILE_ID = 1;
const LINK_KEYS = ['email', 'github', 'facebook', 'phone'];

function toProfile(profile, links, skillGroups) {
  return {
    schemaVersion: Number(profile.schema_version),
    appName: profile.app_name,
    name: profile.name,
    role: profile.role,
    intro: profile.intro,
    education: profile.education,
    summary: profile.summary,
    location: profile.location,
    initials: profile.initials,
    email: links.email,
    github: links.github,
    facebook: links.facebook,
    phone: links.phone,
    settings: {
      currency: profile.currency,
      lowStockThreshold: Number(profile.low_stock_threshold),
      homeProductLimit: Number(profile.home_product_limit),
    },
    skills: skillGroups,
  };
}

async function getPrimaryProfile() {
  const [[profile]] = await pool.execute(
    `SELECT
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
     FROM app_profiles
     WHERE id = ?
     LIMIT 1`,
    [PROFILE_ID],
  );

  if (!profile) {
    return fallbackProfile;
  }

  const [linkRows] = await pool.execute(
    `SELECT link_key, label, value, href
     FROM profile_links
     WHERE profile_id = ?`,
    [profile.id],
  );
  const links = LINK_KEYS.reduce((result, key) => {
    result[key] = fallbackProfile[key];
    return result;
  }, {});

  for (const row of linkRows) {
    if (LINK_KEYS.includes(row.link_key)) {
      links[row.link_key] = {
        label: row.label,
        value: row.value,
        href: row.href,
      };
    }
  }

  const [groupRows] = await pool.execute(
    `SELECT id, title, description
     FROM profile_skill_groups
     WHERE profile_id = ?
     ORDER BY sort_order ASC, id ASC`,
    [profile.id],
  );

  if (groupRows.length === 0) {
    return toProfile(profile, links, fallbackProfile.skills);
  }

  const groupIds = groupRows.map((group) => group.id);
  const placeholders = groupIds.map(() => '?').join(', ');
  const [skillRows] = await pool.execute(
    `SELECT skill_group_id, name
     FROM profile_skill_items
     WHERE skill_group_id IN (${placeholders})
     ORDER BY sort_order ASC, id ASC`,
    groupIds,
  );
  const skillsByGroupId = new Map();

  for (const skill of skillRows) {
    const groupSkills = skillsByGroupId.get(skill.skill_group_id) ?? [];
    groupSkills.push(skill.name);
    skillsByGroupId.set(skill.skill_group_id, groupSkills);
  }

  const skillGroups = groupRows.map((group) => ({
    title: group.title,
    description: group.description,
    skills: skillsByGroupId.get(group.id) ?? [],
  }));

  return toProfile(profile, links, skillGroups);
}

module.exports = { getPrimaryProfile, toProfile };
