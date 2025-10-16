import { Server } from 'bun';

export class WebSocketService {
  private static clients = new Map<string, WebSocket>();

  static initialize(server: Server) {
    server.upgrade = (req) => {
      const url = new URL(req.url);
      if (url.pathname === '/ws') {
        const token = url.searchParams.get('token');
        
        // Validate token here
        if (!this.validateToken(token)) {
          return new Response('Unauthorized', { status: 401 });
        }

        return {
          data: { userId: this.getUserIdFromToken(token) }
        };
      }
    };

    Bun.serve({
      fetch(req, server) {
        server.upgrade(req);
        return new Response('Upgrade failed', { status: 500 });
      },
      websocket: {
        open(ws) {
          const userId = ws.data.userId;
          WebSocketService.clients.set(userId, ws);
          console.log(`Client connected: ${userId}`);
        },
        message(ws, message) {
          // Handle incoming messages
          console.log('Received:', message);
        },
        close(ws) {
          const userId = ws.data.userId;
          WebSocketService.clients.delete(userId);
          console.log(`Client disconnected: ${userId}`);
        }
      }
    });
  }

  static broadcastToEvent(eventId: string, message: any) {
    const eventMessage = JSON.stringify({
      type: 'event_update',
      eventId,
      data: message,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach((client) => {
      client.send(eventMessage);
    });
  }

  private static validateToken(token: string | null): boolean {
    // Implement token validation
    return !!token;
  }

  private static getUserIdFromToken(token: string | null): string {
    // Extract user ID from token
    return 'user-id';
  }
}import { Server } from 'bun';

export class WebSocketService {
  private static clients = new Map<string, WebSocket>();

  static initialize(server: Server) {
    server.upgrade = (req) => {
      const url = new URL(req.url);
      if (url.pathname === '/ws') {
        const token = url.searchParams.get('token');
        
        // Validate token here
        if (!this.validateToken(token)) {
          return new Response('Unauthorized', { status: 401 });
        }

        return {
          data: { userId: this.getUserIdFromToken(token) }
        };
      }
    };

    Bun.serve({
      fetch(req, server) {
        server.upgrade(req);
        return new Response('Upgrade failed', { status: 500 });
      },
      websocket: {
        open(ws) {
          const userId = ws.data.userId;
          WebSocketService.clients.set(userId, ws);
          console.log(`Client connected: ${userId}`);
        },
        message(ws, message) {
          // Handle incoming messages
          console.log('Received:', message);
        },
        close(ws) {
          const userId = ws.data.userId;
          WebSocketService.clients.delete(userId);
          console.log(`Client disconnected: ${userId}`);
        }
      }
    });
  }

  static broadcastToEvent(eventId: string, message: any) {
    const eventMessage = JSON.stringify({
      type: 'event_update',
      eventId,
      data: message,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach((client) => {
      client.send(eventMessage);
    });
  }

  private static validateToken(token: string | null): boolean {
    // Implement token validation
    return !!token;
  }

  private static getUserIdFromToken(token: string | null): string {
    // Extract user ID from token
    return 'user-id';
  }
}