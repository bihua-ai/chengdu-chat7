export function formatUserId(username: string, homeserver: string): string {
  if (username.startsWith('@') && username.includes(':')) return username;
  const hostname = new URL(homeserver).hostname;
  return `@${username}:${hostname}`;
}

export function formatRoomAlias(roomId: string): string {
  return roomId.startsWith('#') ? roomId : `#${roomId}`;
}

export function extractDomain(serverUrl: string): string {
  try {
    return new URL(serverUrl).hostname;
  } catch (error) {
    throw new Error('Invalid server URL');
  }
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateUsername(userId: string): string {
  return userId.split(':')[0].substring(1);
}

export function getMatrixMediaUrl(url: string | undefined, homeserver: string): string {
  if (!url) return '';
  
  // If it's already a full URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a MXC URI, convert it to an HTTP URL
  if (url.startsWith('mxc://')) {
    const mxcParts = url.substring(6).split('/');
    if (mxcParts.length === 2) {
      return `${homeserver}/_matrix/media/r0/download/${mxcParts[0]}/${mxcParts[1]}`;
    }
  }

  return url;
}

export function getAvatarUrl(sender: string, avatarUrl?: string, homeserver?: string): string {
  if (avatarUrl && homeserver) {
    const mediaUrl = getMatrixMediaUrl(avatarUrl, homeserver);
    if (mediaUrl) return mediaUrl;
  }
  
  // Fallback to generated avatar
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sender)}`;
}