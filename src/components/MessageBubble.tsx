import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getAvatarUrl } from '../utils/matrix.utils';
import { MATRIX_CONFIG } from '../config/matrix.config';

interface MessageBubbleProps {
  content: string;
  sender: string;
  timestamp: number;
  isCurrentUser: boolean;
  avatar?: string;
  displayName?: string;
}

export function MessageBubble({
  content,
  sender,
  timestamp,
  isCurrentUser,
  avatar,
  displayName,
}: MessageBubbleProps) {
  const formattedTime = format(new Date(timestamp), 'HH:mm', { locale: zhCN });
  const avatarUrl = getAvatarUrl(sender, avatar, MATRIX_CONFIG.defaultHomeServer);

  return (
    <div className={`flex items-start gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <img
        src={avatarUrl}
        alt={displayName || sender}
        className="w-8 h-8 rounded-full flex-shrink-0"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sender)}`;
        }}
      />
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-gray-500 mb-1">
          {displayName || sender.split(':')[0].substring(1)} · {formattedTime}
        </span>
        <div
          className={`max-w-[75%] rounded-lg px-3 py-2 ${
            isCurrentUser
              ? 'bg-green-400 text-gray-900'
              : 'bg-white text-gray-900'
          }`}
        >
          <div className="break-words text-sm">{content}</div>
        </div>
      </div>
    </div>
  );
}