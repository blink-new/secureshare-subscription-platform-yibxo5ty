import React, { useState, useEffect } from 'react';
import { blink } from '../../blink/client';
import { 
  Edit3, 
  Users, 
  DollarSign, 
  Shield, 
  Eye, 
  EyeOff, 
  Trash2, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from 'lucide-react';

interface MyShare {
  id: string;
  service_name: string;
  category: string;
  monthly_cost: number;
  total_spots: number;
  available_spots: number;
  encryption_level: string;
  trust_score_required: number;
  status: string;
  created_at: string;
  subscribers_count: number;
  total_earnings: number;
}

interface Subscriber {
  id: string;
  user_id: string;
  user_name: string;
  trust_score: number;
  status: string;
  joined_at: string;
  monthly_payment: number;
}

export default function MySharesManagement() {
  const [shares, setShares] = useState<MyShare[]>([]);
  const [selectedShare, setSelectedShare] = useState<MyShare | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [showCredentials, setShowCredentials] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'settings'>('overview');

  useEffect(() => {
    loadMyShares();
  }, []);

  const loadMyShares = async () => {
    try {
      const user = await blink.auth.me();
      const sharesData = await blink.db.subscriptions.list({
        where: { user_id: user.id },
        orderBy: { created_at: 'desc' }
      });

      // Mock data for demonstration
      const mockShares: MyShare[] = [
        {
          id: '1',
          service_name: 'Netflix Premium',
          category: 'streaming',
          monthly_cost: 15.99,
          total_spots: 4,
          available_spots: 1,
          encryption_level: 'enhanced',
          trust_score_required: 3.5,
          status: 'active',
          created_at: '2024-01-15',
          subscribers_count: 3,
          total_earnings: 35.97
        },
        {
          id: '2',
          service_name: 'Spotify Family',
          category: 'music',
          monthly_cost: 16.99,
          total_spots: 6,
          available_spots: 2,
          encryption_level: 'premium',
          trust_score_required: 4.0,
          status: 'active',
          created_at: '2024-01-10',
          subscribers_count: 4,
          total_earnings: 45.31
        }
      ];

      setShares(mockShares);
    } catch (error) {
      console.error('Failed to load shares:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscribers = async (shareId: string) => {
    // Mock subscribers data
    const mockSubscribers: Subscriber[] = [
      {
        id: '1',
        user_id: 'user1',
        user_name: 'Alice Johnson',
        trust_score: 4.2,
        status: 'active',
        joined_at: '2024-01-16',
        monthly_payment: 3.99
      },
      {
        id: '2',
        user_id: 'user2',
        user_name: 'Bob Smith',
        trust_score: 3.8,
        status: 'active',
        joined_at: '2024-01-18',
        monthly_payment: 3.99
      },
      {
        id: '3',
        user_id: 'user3',
        user_name: 'Carol Davis',
        trust_score: 4.5,
        status: 'pending_payment',
        joined_at: '2024-01-20',
        monthly_payment: 3.99
      }
    ];
    setSubscribers(mockSubscribers);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'paused': return 'text-gray-600 bg-gray-50';
      case 'pending_payment': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getEncryptionBadge = (level: string) => {
    const configs = {
      standard: { color: 'bg-blue-100 text-blue-800', icon: Shield },
      enhanced: { color: 'bg-purple-100 text-purple-800', icon: Shield },
      premium: { color: 'bg-gold-100 text-gold-800', icon: Shield }
    };
    const config = configs[level as keyof typeof configs] || configs.standard;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const toggleCredentials = (shareId: string) => {
    setShowCredentials(prev => ({
      ...prev,
      [shareId]: !prev[shareId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">My Shares</h1>
        <div className="text-sm text-gray-500">
          {shares.length} active shares • ${shares.reduce((sum, share) => sum + share.total_earnings, 0).toFixed(2)} total earnings
        </div>
      </div>

      {/* Shares Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {shares.map((share) => (
          <div key={share.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{share.service_name}</h3>
                <p className="text-sm text-gray-500 capitalize">{share.category}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getEncryptionBadge(share.encryption_level)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(share.status)}`}>
                  {share.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {share.subscribers_count}/{share.total_spots} spots
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  ${share.total_earnings.toFixed(2)} earned
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {share.trust_score_required}+ trust required
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {share.available_spots} available
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedShare(share);
                  loadSubscribers(share.id);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Manage Share
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleCredentials(share.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="View credentials"
                >
                  {showCredentials[share.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600" title="Edit share">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600" title="Delete share">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showCredentials[share.id] && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Encrypted Credentials</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Username:</span>
                    <span className="ml-2 font-mono">user@example.com</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Password:</span>
                    <span className="ml-2 font-mono">••••••••••</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Share Management Modal */}
      {selectedShare && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Manage: {selectedShare.service_name}
                </h2>
                <button
                  onClick={() => setSelectedShare(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="flex space-x-6 mt-4">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 border-b-2 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('subscribers')}
                  className={`pb-2 border-b-2 ${activeTab === 'subscribers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                >
                  Subscribers ({subscribers.length})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`pb-2 border-b-2 ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                >
                  Settings
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Active Subscribers</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900 mt-1">{selectedShare.subscribers_count}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Monthly Earnings</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900 mt-1">${selectedShare.total_earnings.toFixed(2)}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Security Level</span>
                      </div>
                      <p className="text-lg font-bold text-purple-900 mt-1 capitalize">{selectedShare.encryption_level}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'subscribers' && (
                <div className="space-y-4">
                  {subscribers.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {subscriber.user_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{subscriber.user_name}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Star className="w-3 h-3" />
                            <span>{subscriber.trust_score}</span>
                            <span>•</span>
                            <span>Joined {new Date(subscriber.joined_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900">
                          ${subscriber.monthly_payment}/month
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscriber.status)}`}>
                          {subscriber.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-yellow-900">Share Settings</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Changing these settings may affect current subscribers.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Spots
                      </label>
                      <input
                        type="number"
                        value={selectedShare.available_spots}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Trust Score
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={selectedShare.trust_score_required}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-4">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save Changes
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Pause Share
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}