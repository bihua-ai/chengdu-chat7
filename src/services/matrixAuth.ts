import * as sdk from 'matrix-js-sdk';
import { MATRIX_CONFIG } from '../config/matrix.config';
import type { MatrixCredentials } from '../types/matrix';

export class MatrixAuth {
  static formatUserId(username: string, homeserver: string): string {
    if (username.includes(':')) return username;
    const hostname = new URL(homeserver).hostname;
    return `@${username}:${hostname}`;
  }

  static async login(homeserver: string, username: string, password: string): Promise<MatrixCredentials> {
    try {
      const tempClient = sdk.createClient({ baseUrl: homeserver });
      const userId = this.formatUserId(username, homeserver);

      const response = await tempClient.login(
        MATRIX_CONFIG.loginType,
        { user: userId, password }
      );

      return {
        accessToken: response.access_token,
        userId: response.user_id,
        deviceId: response.device_id,
        homeServer: homeserver,
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(MATRIX_CONFIG.errors.LOGIN_FAILED);
    }
  }
}