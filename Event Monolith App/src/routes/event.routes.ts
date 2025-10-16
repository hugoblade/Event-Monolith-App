import { Elysia, t } from 'elysia';
import { eventController } from '../controllers/event.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

export const eventRoutes = new Elysia({ prefix: '/events' })
  .use(authMiddleware)
  
  // Get all events
  .get('/', 
    ({ query }) => eventController.getEvents(query),
    {
      query: t.Object({
        page: t.Optional(t.Numeric({ minimum: 1 })),
        limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100 })),
        search: t.Optional(t.String()),
        category: t.Optional(t.String())
      }),
      detail: {
        tags: ['Events'],
        summary: 'Get all events with pagination and filtering',
        responses: {
          200: { description: 'Events retrieved successfully' }
        }
      }
    }
  )
  
  // Get single event
  .get('/:id',
    ({ params: { id } }) => eventController.getEvent(id),
    {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        tags: ['Events'],
        summary: 'Get event by ID',
        responses: {
          200: { description: 'Event retrieved successfully' },
          404: { description: 'Event not found' }
        }
      }
    }
  )
  
  // Create event (Organizers and Admins only)
  .post('/',
    ({ body, userId }) => eventController.createEvent({ ...body, organizerId: userId }),
    {
      beforeHandle: [roleMiddleware(['ORGANIZER', 'ADMIN'])],
      body: t.Object({
        title: t.String({ minLength: 3, maxLength: 100 }),
        description: t.String({ minLength: 10, maxLength: 1000 }),
        date: t.String({ format: 'date-time' }),
        location: t.String({ minLength: 3, maxLength: 200 }),
        maxAttendees: t.Optional(t.Numeric({ minimum: 1 })),
        imageUrl: t.Optional(t.String({ format: 'uri' }))
      }),
      detail: {
        tags: ['Events'],
        summary: 'Create a new event',
        security: [{ bearerAuth: [] }],
        responses: {
          201: { description: 'Event created successfully' },
          400: { description: 'Validation error' },
          403: { description: 'Insufficient permissions' }
        }
      }
    }
  )
  
  // Update event
  .put('/:id',
    ({ params: { id }, body, userId }) => eventController.updateEvent(id, body, userId),
    {
      beforeHandle: [roleMiddleware(['ORGANIZER', 'ADMIN'])],
      params: t.Object({
        id: t.String()
      }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 3, maxLength: 100 })),
        description: t.Optional(t.String({ minLength: 10, maxLength: 1000 })),
        date: t.Optional(t.String({ format: 'date-time' })),
        location: t.Optional(t.String({ minLength: 3, maxLength: 200 })),
        maxAttendees: t.Optional(t.Numeric({ minimum: 1 }))
      }),
      detail: {
        tags: ['Events'],
        summary: 'Update an event',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Event updated successfully' },
          403: { description: 'Not authorized to update this event' },
          404: { description: 'Event not found' }
        }
      }
    }
  )
  
  // Delete event
  .delete('/:id',
    ({ params: { id }, userId }) => eventController.deleteEvent(id, userId),
    {
      beforeHandle: [roleMiddleware(['ORGANIZER', 'ADMIN'])],
      params: t.Object({
        id: t.String()
      }),
      detail: {
        tags: ['Events'],
        summary: 'Delete an event',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Event deleted successfully' },
          403: { description: 'Not authorized to delete this event' },
          404: { description: 'Event not found' }
        }
      }
    }
  )
  
  // Get user's events
  .get('/me/created',
    ({ userId }) => eventController.getUserEvents(userId),
    {
      detail: {
        tags: ['Events'],
        summary: 'Get events created by the current user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Events retrieved successfully' }
        }
      }
    }
  );