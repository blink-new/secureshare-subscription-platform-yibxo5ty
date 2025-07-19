import React, { useState, useEffect } from 'react';
import { blink } from '../../blink/client';
import { 
  DollarSign, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Eye,
  FileText,
  Users,
  ArrowRight,
  RefreshCw,
  MessageSquare
} from 'lucide-react';

interface EscrowTransaction {
  id: string;
  subscription_id: string;
  subscription_name: string;
  payer_id: string;
  payer_name: string;
  receiver_id: string;
  receiver_name: string;
  amount: number;
  status: 'pending' | 'held' | 'released' | 'disputed' | 'refunded';
  created_at: string;
  release_date: string;
  dispute_reason?: string;
  escrow_fee: number;
}

interface DisputeCase {
  id: string;
  transaction_id: string;
  initiator_id: string;
  initiator_name: string;
  reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created_at: string;
  resolution?: string;
}

export default function EscrowSystem() {
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [disputes, setDisputes] = useState<DisputeCase[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<EscrowTransaction | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'disputes' | 'analytics'>('transactions');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'held' | 'disputed'>('all');

  useEffect(() => {
    loadEscrowData();
  }, []);

  const loadEscrowData = async () => {
    try {
      // Mock data for demonstration
      const mockTransactions: EscrowTransaction[] = [
        {
          id: 'tx_001',
          subscription_id: 'sub_001',
          subscription_name: 'Netflix Premium',
          payer_id: 'user_001',
          payer_name: 'Alice Johnson',
          receiver_id: 'user_002',
          receiver_name: 'Bob Smith',
          amount: 3.99,
          status: 'held',
          created_at: '2024-01-20T10:00:00Z',
          release_date: '2024-02-20T10:00:00Z',
          escrow_fee: 0.20
        },
        {
          id: 'tx_002',
          subscription_id: 'sub_002',
          subscription_name: 'Spotify Family',
          payer_id: 'user_003',
          payer_name: 'Carol Davis',
          receiver_id: 'user_002',
          receiver_name: 'Bob Smith',
          amount: 2.83,
          status: 'disputed',
          created_at: '2024-01-18T14:30:00Z',
          release_date: '2024-02-18T14:30:00Z',
          dispute_reason: 'Service access denied',
          escrow_fee: 0.14
        },
        {
          id: 'tx_003',
          subscription_id: 'sub_001',
          subscription_name: 'Netflix Premium',
          payer_id: 'user_004',
          payer_name: 'David Wilson',
          receiver_id: 'user_002',
          receiver_name: 'Bob Smith',
          amount: 3.99,
          status: 'released',
          created_at: '2024-01-15T09:15:00Z',
          release_date: '2024-02-15T09:15:00Z',
          escrow_fee: 0.20
        }
      ];

      const mockDisputes: DisputeCase[] = [
        {
          id: 'dispute_001',
          transaction_id: 'tx_002',
          initiator_id: 'user_003',
          initiator_name: 'Carol Davis',
          reason: 'Service Access',
          description: 'Unable to access Spotify account despite payment. Credentials provided do not work.',
          status: 'investigating',
          created_at: '2024-01-19T16:45:00Z'
        }
      ];

      setTransactions(mockTransactions);
      setDisputes(mockDisputes);
    } catch (error) {
      console.error('Failed to load escrow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'held': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'released': return 'text-green-600 bg-green-50 border-green-200';
      case 'disputed': return 'text-red-600 bg-red-50 border-red-200';
      case 'refunded': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'held': return Shield;
      case 'released': return CheckCircle;
      case 'disputed': return AlertTriangle;
      case 'refunded': return XCircle;
      default: return Clock;
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' || tx.status === filter
  );

  const totalHeld = transactions
    .filter(tx => tx.status === 'held')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalReleased = transactions
    .filter(tx => tx.status === 'released')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDisputed = transactions
    .filter(tx => tx.status === 'disputed')
    .reduce((sum, tx) => sum + tx.amount, 0);

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
        <h1 className="text-2xl font-semibold text-gray-900">Escrow Management</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            ${totalHeld.toFixed(2)} held in escrow
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Held in Escrow</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalHeld.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{transactions.filter(tx => tx.status === 'held').length} transactions</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Released</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalReleased.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{transactions.filter(tx => tx.status === 'released').length} transactions</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Disputed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">${totalDisputed.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">{disputes.length} active disputes</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Total Volume</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${(totalHeld + totalReleased + totalDisputed).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{transactions.length} total transactions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Transactions ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'disputes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Disputes ({disputes.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {['all', 'pending', 'held', 'disputed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === status
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const StatusIcon = getStatusIcon(transaction.status);
              return (
                <div key={transaction.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full border ${getStatusColor(transaction.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{transaction.subscription_name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>{transaction.payer_name}</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{transaction.receiver_name}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${transaction.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Fee: ${transaction.escrow_fee.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created: {new Date(transaction.created_at).toLocaleDateString()}</span>
                      <span>Release: {new Date(transaction.release_date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {transaction.status === 'disputed' && (
                        <button className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200">
                          <MessageSquare className="w-3 h-3" />
                          <span>View Dispute</span>
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedTransaction(transaction)}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute.id} className="bg-white border border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-red-50 border border-red-200 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Dispute #{dispute.id.slice(-6)}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{dispute.initiator_name}</span> • {dispute.reason}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{dispute.description}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dispute.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {dispute.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(dispute.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Investigate
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Contact Parties
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200">
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Escrow Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Success Rate</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Average Resolution Time</h4>
                <p className="text-2xl font-bold text-gray-900">2.3 days</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Transaction Details
                </h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`mt-1 inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="mt-1 text-sm text-gray-900">${selectedTransaction.amount.toFixed(2)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Escrow Fee</label>
                  <p className="mt-1 text-sm text-gray-900">${selectedTransaction.escrow_fee.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Transaction created - {new Date(selectedTransaction.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      Funds held in escrow - {new Date(selectedTransaction.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-400">
                      Scheduled release - {new Date(selectedTransaction.release_date).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Download Receipt
                </button>
                {selectedTransaction.status === 'held' && (
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    Release Funds
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}