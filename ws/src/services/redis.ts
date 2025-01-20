import { createClient } from 'redis';
import { WebSocket } from 'ws';
import { OUTGOING_MESSAGE } from '../messages';

class RedisService {
  private publisher;
  private subscriber;
  private clients: Map<WebSocket, string[]> = new Map();

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    this.publisher = createClient({ url: redisUrl });
    this.subscriber = this.publisher.duplicate();
    
    this.initialize();
  }

  private async initialize() {
    await this.publisher.connect();
    await this.subscriber.connect();

    console.log('Redis connected successfully');
  }

  async publish(channel: string, message: OUTGOING_MESSAGE) {
    await this.publisher.publish(channel, JSON.stringify(message));
  }

  async subscribe(channel: string, ws: WebSocket) {
    const existingChannels = this.clients.get(ws) || [];
    if (!existingChannels.includes(channel)) {
      await this.subscriber.subscribe(channel, (message) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
      this.clients.set(ws, [...existingChannels, channel]);
    }
  }

  async unsubscribe(ws: WebSocket) {
    const channels = this.clients.get(ws);
    if (channels) {
      for (const channel of channels) {
        await this.subscriber.unsubscribe(channel);
      }
      this.clients.delete(ws);
    }
  }

  async disconnect() {
    await this.publisher.disconnect();
    await this.subscriber.disconnect();
  }
}

export const redisService = new RedisService(); 