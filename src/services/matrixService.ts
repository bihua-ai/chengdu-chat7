import { MatrixAuth } from './matrixAuth';
import { MatrixClient } from './matrixClient';
import type { Message, Room } from '../types/matrix';
import * as sdk from 'matrix-js-sdk';

class MatrixService {
  private client: MatrixClient | null = null;
  private messageCallbacks: Set<(message: Message) => void> = new Set();
  private messageHandler: ((message: Message) => void) | null = null;

  async login(homeserverUrl: string, username: string, password: string) {
    try {
      const credentials = await MatrixAuth.login(homeserverUrl, username, password);
      this.client = new MatrixClient(credentials);
      await this.client.start();
      return credentials;
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(errorMessage);
    }
  }

  getClient(): sdk.MatrixClient | null {
    return this.client?.getMatrixClient() || null;
  }

  getUserId(): string | null {
    return this.client?.getUserId() || null;
  }

  async sendMessage(roomId: string, content: string): Promise<void> {
    if (!this.client) throw new Error('Not logged in');
    return this.client.sendMessage(roomId, content);
  }

  async getHistoricalMessages(roomId: string, limit?: number): Promise<Message[]> {
    if (!this.client) throw new Error('Not logged in');
    return this.client.getHistoricalMessages(roomId, limit);
  }

  async getRooms(): Promise<Room[]> {
    if (!this.client) throw new Error('Not logged in');
    return this.client.getRooms();
  }

  subscribeToMessages(callback: (message: Message) => void): void {
    if (!this.client) throw new Error('Not logged in');
    
    if (this.messageHandler) {
      this.client.unsubscribeFromMessages(this.messageHandler);
    }

    this.messageHandler = (message: Message) => {
      this.messageCallbacks.forEach(cb => cb(message));
    };

    this.messageCallbacks.add(callback);
    this.client.subscribeToMessages(this.messageHandler);
  }

  unsubscribeFromMessages(callback: (message: Message) => void): void {
    this.messageCallbacks.delete(callback);
    
    if (this.messageCallbacks.size === 0 && this.messageHandler && this.client) {
      this.client.unsubscribeFromMessages(this.messageHandler);
      this.messageHandler = null;
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.stop();
      this.client = null;
      this.messageCallbacks.clear();
      this.messageHandler = null;
    }
  }
}

export const matrixService = new MatrixService();