import type { MatrixConfig } from '../types/matrix';

export const MATRIX_CONFIG: MatrixConfig = {
  defaultHomeServer: 'https://messenger.b1.shuwantech.com',
  fallbackServer: 'https://messenger.b1.shuwantech.com',
  defaultRoomId: '!IrwcvKRWDxTHuwwtMi:messenger.b1.shuwantech.com',
  initialSyncLimit: 20,
  loginType: 'm.login.password',
  messageType: 'm.room.message',
  maxMessageLength: 4096,
  timelineSupport: true,
  errors: {
    NOT_INITIALIZED: 'Client not initialized',
    LOGIN_FAILED: 'Login failed: Invalid credentials or server unavailable',
    MESSAGE_SEND_FAILED: 'Failed to send message. Please try again.',
    INVALID_ROOM_ID: 'Invalid room ID format',
    ROOM_JOIN_FAILED: 'Failed to join room',
  },
};