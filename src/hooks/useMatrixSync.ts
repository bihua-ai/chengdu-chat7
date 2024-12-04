import { useState, useEffect } from 'react';
import { matrixService } from '../services/matrixService';
import type { Message } from '../types/matrix';

export function useMatrixSync(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfiles, setUserProfiles] = useState<Record<string, { avatar_url?: string; displayname?: string }>>({});

  const fetchUserProfile = async (userId: string) => {
    try {
      const client = matrixService.getClient();
      if (!client) return;
      
      const profile = await client.getProfileInfo(userId);
      if (profile) {
        setUserProfiles(prev => ({
          ...prev,
          [userId]: profile
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch profile for ${userId}:`, err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadHistoricalMessages = async () => {
      try {
        const historicalMessages = await matrixService.getHistoricalMessages(roomId);
        if (mounted) {
          const messagesWithProfiles = historicalMessages.reverse();
          setMessages(messagesWithProfiles);

          // Fetch profiles for all unique senders
          const uniqueSenders = new Set(messagesWithProfiles.map(msg => msg.sender));
          uniqueSenders.forEach(sender => {
            if (!userProfiles[sender]) {
              fetchUserProfile(sender);
            }
          });
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load message history');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const handleNewMessage = async (message: Message) => {
      if (message.roomId === roomId) {
        setMessages(prev => [...prev, message]);
        if (!userProfiles[message.sender]) {
          await fetchUserProfile(message.sender);
        }
      }
    };

    loadHistoricalMessages();
    
    try {
      matrixService.subscribeToMessages(handleNewMessage);
    } catch (err) {
      if (mounted) {
        setError(err instanceof Error ? err.message : 'Failed to sync messages');
      }
    }

    return () => {
      mounted = false;
      matrixService.unsubscribeFromMessages(handleNewMessage);
    };
  }, [roomId]);

  // Update messages with profile information when userProfiles changes
  useEffect(() => {
    setMessages(prevMessages => 
      prevMessages.map(msg => ({
        ...msg,
        avatar: userProfiles[msg.sender]?.avatar_url,
        displayName: userProfiles[msg.sender]?.displayname
      }))
    );
  }, [userProfiles]);

  return { messages, isLoading, error };
}