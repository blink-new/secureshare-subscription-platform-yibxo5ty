import React, { useState, useEffect, useRef, useCallback } from 'react';
import { blink } from '../../blink/client';
import { 
  Send, 
  Shield, 
  Lock, 
  Users, 
  MoreVertical,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  Search,
  Settings
} from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: number;
  type: 'text' | 'system' | 'encrypted';
  encrypted?: boolean;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'subscription' | 'support' | 'general';
  subscriptionId?: string;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away';
    trustScore: number;
  }>;
  encryptionLevel: 'standard' | 'enhanced' | 'premium';
  lastMessage?: ChatMessage;
}

export default function RealtimeChat() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(async () => {
    try {
      const userData = await blink.auth.me();
      setUser(userData);

      // Mock chat rooms
      const mockRooms: ChatRoom[] = [
        {
          id: 'room_netflix_001',
          name: 'Netflix Premium Share',
          type: 'subscription',
          subscriptionId: 'sub_001',
          participants: [
            { id: 'user_001', name: 'Alice Johnson', status: 'online', trustScore: 4.2 },
            { id: 'user_002', name: 'Bob Smith', status: 'online', trustScore: 3.8 },
            { id: 'user_003', name: 'Carol Davis', status: 'away', trustScore: 4.5 }
          ],
          encryptionLevel: 'enhanced'
        },
        {
          id: 'room_spotify_001',
          name: 'Spotify Family Group',
          type: 'subscription',
          subscriptionId: 'sub_002',
          participants: [
            { id: 'user_004', name: 'David Wilson', status: 'online', trustScore: 4.0 },
            { id: 'user_005', name: 'Emma Brown', status: 'offline', trustScore: 3.9 }
          ],
          encryptionLevel: 'premium'
        },
        {
          id: 'room_support_001',
          name: 'Support Chat',
          type: 'support',
          participants: [
            { id: 'support_001', name: 'SecureShare Support', status: 'online', trustScore: 5.0 }
          ],
          encryptionLevel: 'standard'
        }
      ];

      setRooms(mockRooms);
      setSelectedRoom(mockRooms[0]);
      loadMessages(mockRooms[0].id);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = async (roomId: string) => {
    // Mock messages
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg_001',
        userId: 'user_001',
        userName: 'Alice Johnson',
        message: 'Hey everyone! Just set up the Netflix account. Credentials are in the secure vault.',
        timestamp: Date.now() - 3600000,
        type: 'text',
        encrypted: true
      },
      {
        id: 'msg_002',
        userId: 'system',
        userName: 'System',
        message: 'Alice Johnson shared encrypted credentials with the group.',
        timestamp: Date.now() - 3500000,
        type: 'system'
      },
      {
        id: 'msg_003',
        userId: 'user_002',
        userName: 'Bob Smith',
        message: 'Thanks Alice! I can access it now. Everything works perfectly.',
        timestamp: Date.now() - 3000000,
        type: 'text',
        encrypted: true
      },
      {
        id: 'msg_004',
        userId: 'user_003',
        userName: 'Carol Davis',
        message: 'Great! Payment went through successfully. Thanks for organizing this!',
        timestamp: Date.now() - 2400000,
        type: 'text',
        encrypted: true
      }
    ];

    setMessages(mockMessages);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: user.id,
      userName: user.displayName || user.email,
      message: newMessage,
      timestamp: Date.now(),
      type: 'text',
      encrypted: selectedRoom.encryptionLevel !== 'standard'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    try {
      // In a real implementation, this would use blink.realtime
      await blink.realtime.publish(selectedRoom.id, 'chat', {
        message: newMessage,
        encrypted: selectedRoom.encryptionLevel !== 'standard'
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getEncryptionBadge = (level: string) => {
    const configs = {
      standard: { color: 'bg-gray-100 text-gray-800', icon: Shield, text: 'Standard' },
      enhanced: { color: 'bg-blue-100 text-blue-800', icon: Lock, text: 'Enhanced' },
      premium: { color: 'bg-purple-100 text-purple-800', icon: Lock, text: 'Premium E2E' }
    };
    const config = configs[level as keyof typeof configs] || configs.standard;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Sidebar - Chat Rooms */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Secure Chats</h2>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => {
                setSelectedRoom(room);
                loadMessages(room.id);
              }}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedRoom?.id === room.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate">{room.name}</h3>
                {getEncryptionBadge(room.encryptionLevel)}
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {room.participants.length} members
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500 capitalize">{room.type}</span>
              </div>

              {room.lastMessage && (
                <p className="text-sm text-gray-600 truncate">
                  {room.lastMessage.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedRoom.name}</h3>
                  <div className="flex items-center space-x-2">
                    {getEncryptionBadge(selectedRoom.encryptionLevel)}
                    <span className="text-sm text-gray-500">
                      {selectedRoom.participants.filter(p => p.status === 'online').length} online
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Video className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowRoomInfo(!showRoomInfo)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${message.userId === user?.id ? 'order-2' : 'order-1'}`}>
                  {message.type === 'system' ? (
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {message.message}
                      </span>
                    </div>
                  ) : (
                    <div>
                      {message.userId !== user?.id && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {message.userName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{message.userName}</span>
                          {message.encrypted && (
                            <Lock className="w-3 h-3 text-green-600" title="End-to-end encrypted" />
                          )}
                        </div>
                      )}
                      
                      <div className={`px-4 py-2 rounded-lg ${
                        message.userId === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        {message.encrypted && message.userId === user?.id && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Lock className="w-3 h-3 text-blue-200" />
                            <span className="text-xs text-blue-200">Encrypted</span>
                          </div>
                        )}
                      </div>
                      
                      <div className={`text-xs text-gray-500 mt-1 ${
                        message.userId === user?.id ? 'text-right' : 'text-left'
                      }`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Paperclip className="w-4 h-4" />
              </button>
              
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a secure message..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedRoom.encryptionLevel !== 'standard' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-4 h-4 text-green-600" title="Messages are encrypted" />
                  </div>
                )}
              </div>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Smile className="w-4 h-4" />
              </button>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>
                {selectedRoom.encryptionLevel === 'premium' ? 'Zero-knowledge encryption' : 
                 selectedRoom.encryptionLevel === 'enhanced' ? 'End-to-end encrypted' : 
                 'Standard security'}
              </span>
              <span>{selectedRoom.participants.filter(p => p.status === 'online').length} online</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-500">Choose a chat room to start messaging securely</p>
          </div>
        </div>
      )}

      {/* Room Info Sidebar */}
      {showRoomInfo && selectedRoom && (
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Room Info</h3>
            <button
              onClick={() => setShowRoomInfo(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Security</h4>
              {getEncryptionBadge(selectedRoom.encryptionLevel)}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Participants ({selectedRoom.participants.length})
              </h4>
              <div className="space-y-2">
                {selectedRoom.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Trust: {participant.trustScore}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 capitalize">{participant.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}