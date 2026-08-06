const profileService = require('../services/profileService');

async function getProfile(_request, response) {
  response.json(await profileService.getPrimaryProfile());
}

module.exports = { getProfile };
