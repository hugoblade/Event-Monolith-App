import { prisma } from '../prisma/client';
import { WebSocketService } from '../services/websocket.service';

export const eventController = {
  async getEvents(query: { page?: number; limit?: number; search?: string; category?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      date: { gte: new Date() } // Only future events
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          organizer: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { rsvps: true }
          }
        },
        orderBy: { date: 'asc' },
        skip,
        take: limit
      }),
      prisma.event.count({ where })
    ]);

    return {
      success: true,
      data: {
        events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };
  },

  async getEvent(id: string) {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, email: true }
        },
        rsvps: {
          include: {
            user: {
              select: { id: true, name: true, email: true }
            }
          }
        },
        _count: {
          select: { rsvps: true }
        }
      }
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return {
      success: true,
      data: event
    };
  },

  async createEvent(eventData: any) {
    const event = await prisma.event.create({
      data: eventData,
      include: {
        organizer: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Notify via WebSocket
    WebSocketService.broadcastToEvent('new_event', event);

    return {
      success: true,
      message: 'Event created successfully',
      data: event
    };
  },

  async updateEvent(id: string, updateData: any, userId: string) {
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      throw new Error('Event not found');
    }

    if (existingEvent.organizerId !== userId) {
      throw new Error('Not authorized to update this event');
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        organizer: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Notify via WebSocket
    WebSocketService.broadcastToEvent(id, {
      type: 'event_updated',
      event
    });

    return {
      success: true,
      message: 'Event updated successfully',
      data: event
    };
  },

  async deleteEvent(id: string, userId: string) {
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      throw new Error('Event not found');
    }

    if (existingEvent.organizerId !== userId) {
      throw new Error('Not authorized to delete this event');
    }

    await prisma.event.delete({
      where: { id }
    });

    // Notify via WebSocket
    WebSocketService.broadcastToEvent(id, {
      type: 'event_deleted',
      eventId: id
    });

    return {
      success: true,
      message: 'Event deleted successfully'
    };
  },

  async getUserEvents(userId: string) {
    const events = await prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        _count: {
          select: { rsvps: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    return {
      success: true,
      data: events
    };
  }
};