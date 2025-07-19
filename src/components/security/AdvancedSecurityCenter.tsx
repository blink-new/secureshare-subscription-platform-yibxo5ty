import React, { useState, useEffect } from 'react';
import { blink } from '../../blink/client';
import { 
  Shield, 
  Lock, 
  Key, 
  Smartphone, 
  Eye, 
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Bell,
  Globe,
  Fingerprint,
  Zap,
  Activity,
  Clock,
  Users,
  FileText
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'encryption_key_rotation' | 'suspicious_activity' | 'device_added';
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  device?: string;
  resolved: boolean;
}

interface EncryptionKey {
  id: string;
  name: string;
  type: 'master' | 'subscription' | 'communication';
  algorithm: string;
  created_at: string;
  last_rotated: string;
  status: 'active' | 'expired' | 'compromised';
  strength: number;
}

interface TrustedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  os: string;
  browser?: string;
  last_used: string;
  location: string;
  trusted: boolean;
  fingerprint: string;
}

export default function AdvancedSecurityCenter() {
  const [activeTab, setActiveTab] = useState<'overview' | 'encryption' | 'devices' | 'activity' | 'settings'>('overview');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [encryptionKeys, setEncryptionKeys] = useState<EncryptionKey[]>([]);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showMasterKey, setShowMasterKey] = useState(false);
  const [securityScore, setSecurityScore] = useState(85);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      // Mock security events
      const mockEvents: SecurityEvent[] = [
        {
          id: 'evt_001',
          type: 'login',
          description: 'Successful login from new device',
          timestamp: '2024-01-20T10:30:00Z',
          severity: 'medium',
          location: 'San Francisco, CA',
          device: 'iPhone 15 Pro',
          resolved: true
        },
        {
          id: 'evt_002',
          type: 'encryption_key_rotation',
          description: 'Master encryption key rotated automatically',
          timestamp: '2024-01-19T02:00:00Z',
          severity: 'low',
          resolved: true
        },
        {
          id: 'evt_003',
          type: 'suspicious_activity',
          description: 'Multiple failed login attempts detected',
          timestamp: '2024-01-18T15:45:00Z',
          severity: 'high',
          location: 'Unknown location',
          resolved: false
        }
      ];

      const mockKeys: EncryptionKey[] = [
        {
          id: 'key_001',
          name: 'Master Key',
          type: 'master',
          algorithm: 'AES-256-GCM',
          created_at: '2024-01-01T00:00:00Z',
          last_rotated: '2024-01-19T02:00:00Z',
          status: 'active',
          strength: 256
        },
        {
          id: 'key_002',
          name: 'Netflix Subscription Key',
          type: 'subscription',
          algorithm: 'ChaCha20-Poly1305',
          created_at: '2024-01-15T10:00:00Z',
          last_rotated: '2024-01-15T10:00:00Z',
          status: 'active',
          strength: 256
        },
        {
          id: 'key_003',
          name: 'Communication Key',
          type: 'communication',
          algorithm: 'X25519-XSalsa20-Poly1305',
          created_at: '2024-01-10T14:30:00Z',
          last_rotated: '2024-01-17T08:15:00Z',
          status: 'active',
          strength: 255
        }
      ];

      const mockDevices: TrustedDevice[] = [
        {
          id: 'dev_001',
          name: 'iPhone 15 Pro',
          type: 'mobile',
          os: 'iOS 17.2',
          last_used: '2024-01-20T10:30:00Z',
          location: 'San Francisco, CA',
          trusted: true,
          fingerprint: 'a1b2c3d4e5f6'
        },
        {
          id: 'dev_002',
          name: 'MacBook Pro',
          type: 'desktop',
          os: 'macOS 14.2',
          browser: 'Safari 17.2',
          last_used: '2024-01-19T16:45:00Z',
          location: 'San Francisco, CA',
          trusted: true,
          fingerprint: 'f6e5d4c3b2a1'
        },
        {
          id: 'dev_003',
          name: 'Unknown Device',
          type: 'desktop',
          os: 'Windows 11',
          browser: 'Chrome 120',
          last_used: '2024-01-18T15:45:00Z',
          location: 'Unknown location',
          trusted: false,
          fingerprint: '123456789abc'
        }
      ];

      setSecurityEvents(mockEvents);
      setEncryptionKeys(mockKeys);
      setTrustedDevices(mockDevices);
      setTwoFactorEnabled(true);
      setBiometricEnabled(true);
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return XCircle;
      case 'high': return AlertTriangle;
      case 'medium': return Eye;
      case 'low': return CheckCircle;
      default: return Activity;
    }
  };

  const getKeyStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'expired': return 'text-yellow-600 bg-yellow-50';
      case 'compromised': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const rotateKey = async (keyId: string) => {
    // Mock key rotation
    setEncryptionKeys(prev => prev.map(key => 
      key.id === keyId 
        ? { ...key, last_rotated: new Date().toISOString() }
        : key
    ));
  };

  const revokeDevice = async (deviceId: string) => {
    setTrustedDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, trusted: false }
        : device
    ));
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
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
        <h1 className="text-2xl font-semibold text-gray-900">Security Center</h1>
        <div className="flex items-center space-x-4">
          <div className={`text-sm font-medium ${getSecurityScoreColor(securityScore)}`}>
            Security Score: {securityScore}/100
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <RefreshCw className="w-4 h-4" />
            <span>Scan</span>
          </button>
        </div>
      </div>

      {/* Security Score Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Security Overview</h2>
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getSecurityScoreColor(securityScore)}`}>
              {securityScore}
            </div>
            <p className="text-sm text-gray-500">Overall Score</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {encryptionKeys.filter(k => k.status === 'active').length}
            </div>
            <p className="text-sm text-gray-500">Active Keys</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {trustedDevices.filter(d => d.trusted).length}
            </div>
            <p className="text-sm text-gray-500">Trusted Devices</p>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {securityEvents.filter(e => !e.resolved && e.severity !== 'low').length}
            </div>
            <p className="text-sm text-gray-500">Active Alerts</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'encryption', label: 'Encryption', icon: Lock },
            { id: 'devices', label: 'Devices', icon: Smartphone },
            { id: 'activity', label: 'Activity', icon: Clock },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
            <div className="space-y-3">
              {securityEvents.slice(0, 5).map((event) => {
                const SeverityIcon = getSeverityIcon(event.severity);
                return (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className={`p-1 rounded-full ${getSeverityColor(event.severity)}`}>
                      <SeverityIcon className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                        {event.location && (
                          <>
                            <span>•</span>
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Recommendations</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Enabled and working properly</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Biometric Authentication</p>
                  <p className="text-xs text-gray-500">Fingerprint and Face ID enabled</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Key Rotation</p>
                  <p className="text-xs text-gray-500">Some keys haven't been rotated in 30+ days</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Untrusted Device</p>
                  <p className="text-xs text-gray-500">Unknown device attempted access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Encryption Tab */}
      {activeTab === 'encryption' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Encryption Keys</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Generate New Key
              </button>
            </div>
            
            <div className="space-y-4">
              {encryptionKeys.map((key) => (
                <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Key className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{key.name}</h4>
                        <p className="text-sm text-gray-500">{key.algorithm} • {key.strength}-bit</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKeyStatusColor(key.status)}`}>
                      {key.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-medium">Created:</span> {new Date(key.created_at).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Rotated:</span> {new Date(key.last_rotated).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => rotateKey(key.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                    >
                      Rotate Key
                    </button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                      Export Public Key
                    </button>
                    {key.type === 'master' && (
                      <button
                        onClick={() => setShowMasterKey(!showMasterKey)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm flex items-center space-x-1"
                      >
                        {showMasterKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showMasterKey ? 'Hide' : 'Show'} Key</span>
                      </button>
                    )}
                  </div>
                  
                  {showMasterKey && key.type === 'master' && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Master Key (Base64):</p>
                      <p className="font-mono text-xs text-gray-900 break-all">
                        dGhpcyBpcyBhIG1vY2sgbWFzdGVyIGtleSBmb3IgZGVtb25zdHJhdGlvbiBwdXJwb3Nlcw==
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Devices Tab */}
      {activeTab === 'devices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trusted Devices</h3>
            
            <div className="space-y-4">
              {trustedDevices.map((device) => (
                <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${device.trusted ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Smartphone className={`w-5 h-5 ${device.trusted ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{device.name}</h4>
                        <p className="text-sm text-gray-500">
                          {device.os} {device.browser && `• ${device.browser}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          Last used: {new Date(device.last_used).toLocaleString()} • {device.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        device.trusted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {device.trusted ? 'Trusted' : 'Untrusted'}
                      </span>
                      
                      {!device.trusted && (
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm">
                          Trust Device
                        </button>
                      )}
                      
                      <button
                        onClick={() => revokeDevice(device.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                      >
                        Revoke
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-500">
                    <span className="font-medium">Fingerprint:</span> {device.fingerprint}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Activity Log</h3>
            
            <div className="space-y-4">
              {securityEvents.map((event) => {
                const SeverityIcon = getSeverityIcon(event.severity);
                return (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full border ${getSeverityColor(event.severity)}`}>
                        <SeverityIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{event.description}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                            {event.severity}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Time:</span> {new Date(event.timestamp).toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {event.type.replace('_', ' ')}
                          </div>
                          {event.location && (
                            <div>
                              <span className="font-medium">Location:</span> {event.location}
                            </div>
                          )}
                          {event.device && (
                            <div>
                              <span className="font-medium">Device:</span> {event.device}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!event.resolved && (
                            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm">
                              Investigate
                            </button>
                          )}
                          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <button
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Fingerprint className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Biometric Authentication</h4>
                    <p className="text-sm text-gray-500">Use fingerprint or face recognition</p>
                  </div>
                </div>
                <button
                  onClick={() => setBiometricEnabled(!biometricEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    biometricEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      biometricEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Automatic Key Rotation
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="30">Every 30 days</option>
                  <option value="60">Every 60 days</option>
                  <option value="90">Every 90 days</option>
                  <option value="never">Never (Manual only)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="security-alerts" className="rounded" defaultChecked />
                <label htmlFor="security-alerts" className="text-sm text-gray-700">
                  Send security alerts via email
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="login-notifications" className="rounded" defaultChecked />
                <label htmlFor="login-notifications" className="text-sm text-gray-700">
                  Notify me of new device logins
                </label>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}