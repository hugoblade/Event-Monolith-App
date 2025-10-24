import { EventEmitter } from 'eventemitter3';

// Example WebSocket wrapper with auto-reconnect simple logic
const WS_URL = process.env.WS_URL || 'ws://10.0.2.2:4000/ws';

class WSService extends EventEmitter {
  socket: WebSocket | null = null;
  reconnectInterval = 3000;
  connected = false;

  connect() {
    if (this.socket) return;
    this.socket = new WebSocket(WS_URL);

    this.socket.onopen = () => {
      this.connected = true;
      this.emit('open');
      console.log('WS connected');
    };

    this.socket.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        // Example: { channel: 'events', type: 'created', payload: {...} }
        this.emit(data.channel || 'message', data);
      } catch (e) {
        this.emit('message', evt.data);
      }
    };

    this.socket.onclose = () => {
      this.connected = false;
      this.socket = null;
      this.emit('close');
      console.log('WS closed — reconnecting in', this.reconnectInterval);
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.socket.onerror = (err) => {
      console.warn('WS error', err);
      this.emit('error', err);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(data: any) {
    if (this.socket && this.connected) {
      this.socket.send(JSON.stringify(data));
    }
  }
}

export default new WSService();