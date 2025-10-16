import { Elysia } from 'elysia';
import { jwtUtils } from '../utils/jwt.utils';

export const authMiddleware = new Elysia()
  .derive({ as: 'scoped' }, async ({ headers, set }) => {
    const authHeader = headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return { userId: null, userRole: null };
    }

    const token = authHeader.slice(7);
    const payload = jwtUtils.verifyToken(token);

    if (!payload) {
      set.status = 401;
      throw new Error('Invalid or expired token');
    }

    return {
      userId: payload.userId,
      userRole: payload.role
    };
  });