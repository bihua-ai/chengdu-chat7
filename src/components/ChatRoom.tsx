import React, { useState, useRef, useEffect } from 'react';
import { useMatrixSync } from '../hooks/useMatrixSync';
import { matrixService } from '../services/matrixService';
import { Send, LogOut } from 'lucide-react';
import bihuaLogo from '../assets/hj_full_logo.png';
import { MessageBubble } from './MessageBubble';
import { VoiceRecorder } from './VoiceRecorder';

interface ChatRoomProps {
  roomId: string;
}

export function ChatRoom({ roomId }: ChatRoomProps) {
  const { messages, isLoading, error: syncError } = useMatrixSync(roomId);
  const [newMessage, setNewMessage] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [isVoiceMessageSending, setIsVoiceMessageSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(100);
  const resizeRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const lastYRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    lastYRef.current = e.clientY;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const delta = lastYRef.current - e.clientY;
    setTextareaHeight((prev) => Math.min(Math.max(prev + delta, 100), 400));
    lastYRef.current = e.clientY;
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    setSendError(null);
    try {
      await matrixService.sendMessage(roomId, newMessage);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      setSendError('Failed to send message. Please try again.');
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceMessage = async (blob: Blob) => {
    setIsVoiceMessageSending(true);
    setSendError(null);

    try {
      const client = matrixService.getClient();
      if (!client) throw new Error('Client not initialized');

      // Upload the audio file
      const response = await client.uploadContent(blob, {
        type: 'audio/webm;codecs=opus',
        name: `voice-${Date.now()}.webm`
      });

      // Send the message with the uploaded content
      await client.sendMessage(roomId, {
        msgtype: 'm.audio',
        body: 'Voice message',
        url: response.content_uri,
        info: {
          mimetype: 'audio/webm;codecs=opus',
          size: blob.size
        }
      });

      scrollToBottom();
    } catch (error) {
      console.error('Failed to send voice message:', error);
      setSendError('无法发送语音消息，请重试。');
    } finally {
      setIsVoiceMessageSending(false);
    }
  };

  const handleLogout = () => {
    matrixService.disconnect();
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F5] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center flex-1 justify-center">
          <img 
            src={bihuaLogo} 
            alt="Logo" 
            className="h-8 w-auto object-contain"
          />
        </div>
        <button
          onClick={handleLogout}
          className="absolute right-2 flex items-center text-gray-600 hover:text-gray-800 p-2"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content}
            sender={message.sender}
            timestamp={message.timestamp}
            isCurrentUser={message.sender === matrixService.getUserId()}
            avatar={message.avatar}
            displayName={message.displayName}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {(syncError || sendError) && (
        <div className="px-3 py-2 bg-red-50 border-t border-red-200">
          <p className="text-xs text-red-600">{syncError || sendError}</p>
        </div>
      )}

      <div
        ref={resizeRef}
        className="h-1 bg-gray-200 cursor-ns-resize hover:bg-gray-300 transition-colors hidden sm:block"
        onMouseDown={handleMouseDown}
      />

      <form onSubmit={handleSend} className="bg-white border-t">
        <div className="p-2 flex space-x-2">
          <div className="flex-1 flex flex-col space-y-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ height: `${textareaHeight}px` }}
              className="flex-1 resize-none outline-none focus:outline-none p-2 bg-white text-sm"
              placeholder="输入消息... (Ctrl + Enter 发送)"
            />
            <div className="flex items-center justify-between">
              <VoiceRecorder 
                onRecordingComplete={handleVoiceMessage}
                disabled={isVoiceMessageSending} 
              />
              <button
                type="submit"
                className="inline-flex items-center px-2 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium bg-[#E9E9E9] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Send className="w-4 h-4 text-green-600" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}