import React from 'react';
import { Room } from '../types/matrix';
import { MessageSquare } from 'lucide-react';

interface RoomListProps {
  rooms: Room[];
  selectedRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
}

export function RoomList({ rooms, selectedRoomId, onRoomSelect }: RoomListProps) {
  return (
    <div className="w-64 bg-gray-50 border-r overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-700">Rooms</h2>
      </div>
      <div className="space-y-1">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${
              selectedRoomId === room.id ? 'bg-gray-200' : ''
            }`}
          >
            <MessageSquare className="w-5 h-5 mr-2 text-gray-500" />
            <span className="truncate">{room.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}