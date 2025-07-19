import React, { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Shield,
  Star,
  Users,
  DollarSign,
  Calendar,
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  UserCheck,
  CreditCard,
  MessageSquare
} from 'lucide-react'
import { Subscription } from '@/types'
import { blink } from '@/blink/client'

interface SubscriptionDetailsModalProps {
  subscriptionId: string | null
  isOpen: boolean
  onClose: () => void
  onJoin?: (id: string) => void
}

export function SubscriptionDetailsModal({ 
  subscriptionId, 
  isOpen, 
  onClose, 
  onJoin 
}: SubscriptionDetailsModalProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [credentials, setCredentials] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await blink.auth.me()
        setUser(userData)
      } catch (error) {
        console.error('Error getting user:', error)
      }
    }
    getUser()
  }, [])

  useEffect(() => {
    if (subscriptionId && isOpen) {
      fetchSubscriptionDetails()
    }
  }, [subscriptionId, isOpen, fetchSubscriptionDetails])

  const fetchSubscriptionDetails = useCallback(async () => {
    if (!subscriptionId) return
    
    setLoading(true)
    try {
      // Fetch subscription details
      const subData = await blink.db.subscriptions.list({
        where: { id: subscriptionId }
      })
      
      if (subData.length > 0) {
        const sub = subData[0]
        const transformedSub: Subscription = {
          id: sub.id,
          title: sub.title || sub.service_name,
          service: sub.service || sub.service_name,
          description: sub.description || '',
          totalCost: sub.total_cost || sub.monthly_cost,
          costPerSlot: sub.cost_per_slot || (sub.monthly_cost / sub.total_spots),
          totalSlots: sub.total_slots,
          availableSlots: sub.available_slots,
          duration: sub.duration || 'Monthly',
          category: sub.category,
          sharerUserId: sub.sharer_user_id,
          sharerReputation: sub.sharer_reputation || 85,
          sharerVerification: sub.sharer_verification || 'basic',
          isActive: Number(sub.is_active) > 0,
          createdAt: sub.created_at,
          updatedAt: sub.updated_at,
          trustScore: sub.trust_score || 85,
          encryptionLevel: sub.encryption_level || 'standard'
        }
        setSubscription(transformedSub)

        // Fetch credentials if user is the sharer
        if (user && sub.sharer_user_id === user.id) {
          try {
            const credData = await blink.db.subscription_credentials.list({
              where: { subscription_id: subscriptionId }
            })
            if (credData.length > 0) {
              setCredentials(credData[0])
            }
          } catch (error) {
            console.error('Error fetching credentials:', error)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching subscription details:', error)
    } finally {
      setLoading(false)
    }
  }, [subscriptionId, user])

  const handleJoinShare = () => {
    if (subscription && onJoin) {
      onJoin(subscription.id)
    }
  }

  if (!subscription && !loading) {
    return null
  }

  const spotsUsed = subscription ? subscription.totalSlots - subscription.availableSlots : 0
  const fillPercentage = subscription ? (spotsUsed / subscription.totalSlots) * 100 : 0

  const getTrustBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getVerificationIcon = (level: string) => {
    switch (level) {
      case 'premium':
        return <Shield className="h-4 w-4 text-blue-600" />
      case 'enhanced':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'basic':
        return <Lock className="h-4 w-4 text-gray-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getEncryptionBadge = (level: string) => {
    switch (level) {
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Premium Security</Badge>
      case 'enhanced':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Enhanced Security</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Standard Security</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {loading ? 'Loading...' : subscription?.title}
            {subscription && (
              <Badge variant="outline" className="text-xs">
                {subscription.service}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {loading ? 'Fetching subscription details...' : 'Detailed information about this subscription share'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : subscription ? (
          <div className="space-y-6">
            {/* Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Your Cost</p>
                      <p className="text-xl font-bold text-green-600">${subscription.costPerSlot}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Available Spots</p>
                      <p className="text-xl font-bold text-blue-600">{subscription.availableSlots}</p>
                      <p className="text-xs text-gray-500">of {subscription.totalSlots} total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Trust Score</p>
                      <p className="text-xl font-bold text-yellow-600">{subscription.trustScore}%</p>
                      <p className="text-xs text-gray-500">Highly trusted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About This Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{subscription.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{subscription.category}</Badge>
                  <Badge variant="outline">{subscription.duration}</Badge>
                  {getEncryptionBadge(subscription.encryptionLevel)}
                </div>
              </CardContent>
            </Card>

            {/* Spots Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Spot Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Spots taken: {spotsUsed}</span>
                    <span>Available: {subscription.availableSlots}</span>
                  </div>
                  <Progress value={fillPercentage} className="h-3" />
                  <p className="text-sm text-gray-600">
                    {subscription.availableSlots > 0 
                      ? `${subscription.availableSlots} spot${subscription.availableSlots > 1 ? 's' : ''} still available`
                      : 'This share is currently full'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Sharer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Sharer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {subscription.sharerUserId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">Verified Sharer</span>
                      {getVerificationIcon(subscription.sharerVerification)}
                      <Badge className={getTrustBadgeColor(subscription.sharerReputation)}>
                        {subscription.sharerReputation}% trusted
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Member since {new Date(subscription.createdAt).getFullYear()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>Verified identity</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Lock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">End-to-End Encryption</p>
                      <p className="text-sm text-gray-600">Credentials protected with military-grade encryption</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Escrow Protection</p>
                      <p className="text-sm text-gray-600">Payments held securely until access confirmed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Eye className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Identity Verification</p>
                      <p className="text-sm text-gray-600">All members verified before access</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <MessageSquare className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">Dispute Resolution</p>
                      <p className="text-sm text-gray-600">24/7 support for any issues</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credentials (only for sharer) */}
            {user && subscription.sharerUserId === user.id && credentials && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    Stored Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Username/Email:</label>
                      <p className="text-sm text-gray-900 font-mono">{credentials.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Password:</label>
                      <p className="text-sm text-gray-900 font-mono">••••••••••••</p>
                    </div>
                    {credentials.additional_info && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Additional Info:</label>
                        <p className="text-sm text-gray-900">{credentials.additional_info}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {subscription.availableSlots > 0 && user && subscription.sharerUserId !== user.id && (
                <Button onClick={handleJoinShare} className="bg-blue-600 hover:bg-blue-700">
                  Join This Share - ${subscription.costPerSlot}/month
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">Subscription not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}