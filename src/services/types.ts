export interface MatrixCredentials {
  accessToken: string;
  userId: string;
  deviceId: string;
  homeServer: string;
}

export interface LoginResponse {
  access_token: string;
  user_id: string;
  device_id: string;
  home_server: string;
}