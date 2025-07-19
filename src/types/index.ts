export interface User {
  id: string
  email: string
  displayName?: string
  avatar?: string
  reputationScore: number
  verificationLevel: 'unverified' | 'basic' | 'enhanced' | 'premium'
  joinedAt: string
  totalShares: number
  totalSubscriptions: number
}

export interface Subscription {
  id: string
  title: string
  service: string
  description: string
  totalCost: number
  costPerSlot: number
  totalSlots: number
  availableSlots: number
  duration: string
  category: string
  sharerUserId: string
  sharerReputation: number
  sharerVerification: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  trustScore: number
  encryptionLevel: 'standard' | 'enhanced' | 'military'
}

export interface SubscriptionShare {
  id: string
  subscriptionId: string
  subscriberUserId: string
  status: 'pending' | 'active' | 'expired' | 'disputed'
  paymentStatus: 'pending' | 'escrowed' | 'released' | 'refunded'
  joinedAt: string
  expiresAt: string
  monthlyFee: number
}

export interface EscrowTransaction {
  id: string
  subscriptionId: string
  subscriberUserId: string
  amount: number
  status: 'pending' | 'held' | 'released' | 'disputed' | 'refunded'
  createdAt: string
  releaseDate?: string
  disputeReason?: string
}

export interface TrustMetrics {
  onTimePayments: number
  successfulShares: number
  disputeResolution: number
  communityFeedback: number
  verificationLevel: number
  accountAge: number
}