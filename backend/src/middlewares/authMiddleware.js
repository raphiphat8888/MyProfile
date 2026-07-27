const jwt = require('jsonwebtoken');

const { env } = require('../config/env');
const { ApiError } = require('../utils/ApiError');

function authMiddleware(request, _response, next) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    next(new ApiError(401, 'Bearer token is required'));
    return;
  }

  try {
    const token = authorization.slice('Bearer '.length);
    const payload = jwt.verify(token, env.JWT_SECRET);

    if (
      typeof payload !== 'object' ||
      typeof payload.sub !== 'string' ||
      (payload.role !== 'admin' && payload.role !== 'customer')
    ) {
      throw new Error('Invalid token payload');
    }

    request.user = {
      id: Number(payload.sub),
      role: payload.role,
    };
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

function requireRole(...roles) {
  return function roleMiddleware(request, _response, next) {
    if (!request.user || !roles.includes(request.user.role)) {
      next(new ApiError(403, 'You do not have permission to perform this action'));
      return;
    }

    next();
  };
}

module.exports = { authMiddleware, requireRole };
