const { ZodError } = require('zod');

const { ApiError } = require('../utils/ApiError');
const { logger } = require('../utils/logger');

function notFoundMiddleware(request, _response, next) {
  next(new ApiError(404, `Route not found: ${request.method} ${request.originalUrl}`));
}

function errorMiddleware(error, _request, response, _next) {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: 'Validation failed',
      details: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof ApiError) {
    response.status(error.statusCode).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }

  if (error?.code === 'ER_DUP_ENTRY') {
    response.status(409).json({ error: 'A record with this value already exists' });
    return;
  }

  logger.error('Unhandled request error', error);
  response.status(500).json({ error: 'Internal server error' });
}

module.exports = { errorMiddleware, notFoundMiddleware };
