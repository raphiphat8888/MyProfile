const { z } = require('zod');

const categoryService = require('../services/categoryService');

const categorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().max(255).optional().default(''),
});

async function listCategories(_request, response) {
  response.json(await categoryService.listCategories());
}

async function createCategory(request, response) {
  const input = categorySchema.parse(request.body);
  response.status(201).json(await categoryService.createCategory(input));
}

module.exports = { createCategory, listCategories };
