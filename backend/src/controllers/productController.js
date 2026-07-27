const { z } = require('zod');

const productService = require('../services/productService');

const idSchema = z.coerce.number().int().positive();
const productSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().max(5000).optional().default(''),
  price: z.coerce.number().min(0).max(99999999.99).default(0),
  stock: z.coerce.number().int().min(0).max(1000000),
  category: z.string().trim().min(1).max(100),
  location_count: z.coerce.number().int().min(0).max(1000000).default(0),
  image_url: z.union([z.url().max(500), z.literal('')]).default(''),
});

const productUpdateSchema = productSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one product field is required' },
);

async function listProducts(_request, response) {
  response.json(await productService.listProducts());
}

async function getProduct(request, response) {
  const id = idSchema.parse(request.params.id);
  const row = await productService.getProductById(id);
  response.json(productService.toProduct(row));
}

async function createProduct(request, response) {
  const input = productSchema.parse(request.body);
  response.status(201).json(await productService.createProduct(input));
}

async function updateProduct(request, response) {
  const id = idSchema.parse(request.params.id);
  const input = productUpdateSchema.parse(request.body);
  response.json(await productService.updateProduct(id, input));
}

async function deleteProduct(request, response) {
  const id = idSchema.parse(request.params.id);
  await productService.deleteProduct(id);
  response.status(204).send();
}

module.exports = {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
};
