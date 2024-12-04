import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { ChatRoom } from './components/ChatRoom';
import { Layout } from './components/Layout';
import { matrixService } from './services/matrixService';
import { MATRIX_CONFIG } from './services/matrixConfig';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setError(null);
    }
  }, [isLoggedIn]);

  return (
    <Layout>
      {!isLoggedIn ? (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <div className="h-full">
          <ChatRoom roomId={MATRIX_CONFIG.defaultRoomId} />
          {error && (
            <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default App;