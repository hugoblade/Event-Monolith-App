import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { logger } from '@grotto/logysia';

// Import routes
import { authRoutes } from './routes/auth.routes';
import { eventRoutes } from './routes/event.routes';
import { rsvpRoutes } from './routes/rsvp.routes';

const app = new Elysia()
  // Global plugins
  .use(logger())
  .use(cors({
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }))
  .use(swagger({
    documentation: {
      info: {
        title: 'Events API Documentation',
        version: '1.0.0',
        description: 'Complete Event Management API with Real-time Features',
        contact: {
          name: 'API Support',
          email: 'support@events.com'
        }
      },
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Events', description: 'Event management endpoints' },
        { name: 'RSVP', description: 'Event registration endpoints' },
        { name: 'Users', description: 'User management endpoints' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    },
    path: '/docs',
    exclude: ['/docs', '/docs/json']
  }))
  .get('/', () => ({ 
    message: 'Events API Server', 
    version: '1.0.0',
    docs: '/docs'
  }))
  // Register routes
  .use(authRoutes)
  .use(eventRoutes)
  .use(rsvpRoutes)
  // Global error handling
  .onError(({ code, error, set }) => {
    console.error('Error:', error);
    
    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        message: 'Validation error',
        errors: error.all
      };
    }
    
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        success: false,
        message: 'Resource not found'
      };
    }
    
    set.status = 500;
    return {
      success: false,
      message: 'Internal server error'
    };
  })
  .listen(process.env.PORT || 3000);

console.log(`🦊 Events API running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 API Documentation available at http://localhost:3000/docs`);

// Add this to your main file for production
if (process.env.NODE_ENV === 'production') {
  console.log('🚀 Starting production server...');
}