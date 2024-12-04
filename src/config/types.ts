export interface MatrixConfig {
  // Server Configuration
  defaultHomeServer: string;
  fallbackServer: string;
  
  // Room Configuration
  defaultRoomId: string;
  initialSyncLimit: number;
  
  // Authentication Configuration
  loginType: string;
  defaultCredentials: {
    username: string;
    password: string;
  };
  
  // Message Configuration
  messageType: string;
  maxMessageLength: number;
  
  // Client Configuration
  timelineSupport: boolean;
  
  // Error Messages
  errors: {
    NOT_INITIALIZED: string;
    LOGIN_FAILED: string;
    ROOM_JOIN_FAILED: string;
    MESSAGE_SEND_FAILED: string;
    INVALID_ROOM_ID: string;
  };
}