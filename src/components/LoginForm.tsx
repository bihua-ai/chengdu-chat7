import React, { useState } from 'react';
import { matrixService } from '../services/matrixService';
import { MATRIX_CONFIG } from '../config/matrix.config';
import bihuaLogo from '../assets/hj_full_logo.png';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [homeserver] = useState(MATRIX_CONFIG.defaultHomeServer);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await matrixService.login(homeserver, username, password);
      onLoginSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full px-4 max-w-[280px]">
        <div className="flex justify-center mb-8">
          <img
            src={bihuaLogo}
            alt="Logo"
            className="w-full max-w-[200px] h-auto"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              服务器
            </label>
            <input
              type="url"
              value={homeserver}
              disabled={true}
              className="w-full px-3 py-2 bg-gray-50 text-gray-600 border-b border-gray-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入用户名"
              className="w-full px-3 py-2 bg-white border-b border-gray-100 focus:outline-none text-sm"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              className="w-full px-3 py-2 bg-white border-b border-gray-100 focus:outline-none text-sm"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}