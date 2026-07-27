const { z } = require('zod');

const authService = require('../services/authService');

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(255),
  password: z.string().min(8).max(72),
});

const loginSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(1).max(72),
});

async function register(request, response) {
  const input = registerSchema.parse(request.body);
  const result = await authService.registerCustomer(input);
  response.status(201).json(result);
}

async function login(request, response) {
  const input = loginSchema.parse(request.body);
  const result = await authService.login(input);
  response.json(result);
}

module.exports = { login, register };
