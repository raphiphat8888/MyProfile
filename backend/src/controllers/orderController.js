const { z } = require('zod');

const orderService = require('../services/orderService');

const orderSchema = z.object({
  shipping_address: z.string().trim().max(2000).optional().default(''),
  items: z
    .array(
      z.object({
        product_id: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().positive().max(1000),
      }),
    )
    .min(1)
    .max(100)
    .refine(
      (items) => new Set(items.map((item) => item.product_id)).size === items.length,
      { message: 'Each product may appear only once in an order' },
    ),
});

async function createOrder(request, response) {
  const input = orderSchema.parse(request.body);
  response.status(201).json(await orderService.createOrder(request.user.id, input));
}

async function listOrders(request, response) {
  response.json(await orderService.listOrders(request.user));
}

module.exports = { createOrder, listOrders };
