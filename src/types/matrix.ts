export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  roomId: string;
  avatar?: string;
  displayName?: string;
}

export interface Room {
  id: string;
  name: string;
  lastMessage?: Message;
}

export interface MatrixCredentials {
  accessToken: string;
  userId: string;
  deviceId: string;
  homeServer: string;
}

export interface MatrixConfig {
  defaultHomeServer: string;
  fallbackServer: string;
  defaultRoomId: string;
  initialSyncLimit: number;
  loginType: string;
  messageType: string;
  maxMessageLength: number;
  timelineSupport: boolean;
  errors: {
    NOT_INITIALIZED: string;
    LOGIN_FAILED: string;
    ROOM_JOIN_FAILED: string;
    MESSAGE_SEND_FAILED: string;
    INVALID_ROOM_ID: string;
  };
}