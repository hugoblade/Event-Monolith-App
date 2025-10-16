import { Elysia, t } from 'elysia';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post('/register', 
    ({ body }) => authController.register(body),
    {
      body: t.Object({
        name: t.String({ minLength: 2, maxLength: 50 }),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 })
      }),
      detail: {
        tags: ['Auth'],
        summary: 'Register a new user'
      }
    }
  )
  .post('/login',
    ({ body }) => authController.login(body),
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String()
      }),
      detail: {
        tags: ['Auth'],
        summary: 'Login user'
      }
    }
  )
  .use(authMiddleware)
  .get('/profile',
    ({ userId }) => authController.getProfile(userId),
    {
      beforeHandle: [({ userId, set }) => {
        if (!userId) {
          set.status = 401;
          return { success: false, message: 'Unauthorized' };
        }
      }],
      detail: {
        tags: ['Auth'],
        summary: 'Get user profile',
        security: [{ bearerAuth: [] }]
      }
    }
  );