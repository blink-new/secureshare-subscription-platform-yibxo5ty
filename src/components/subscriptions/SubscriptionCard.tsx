import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  Star, 
  Users, 
  DollarSign, 
  Clock,
  Lock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { Subscription } from '@/types'

interface SubscriptionCardProps {
  subscription: Subscription
  onJoin?: (id: string) => void
  onViewDetails?: (id: string) => void
}

export function SubscriptionCard({ subscription, onJoin, onViewDetails }: SubscriptionCardProps) {
  const spotsLeft = subscription.availableSlots
  const spotsTotal = subscription.totalSlots
  const spotsUsed = spotsTotal - spotsLeft
  const fillPercentage = (spotsUsed / spotsTotal) * 100

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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">{subscription.title}</h3>
              <Badge variant="outline" className="text-xs">
                {subscription.service}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{subscription.description}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getTrustBadgeColor(subscription.trustScore)}>
              <Star className="h-3 w-3 mr-1" />
              {subscription.trustScore}%
            </Badge>
            <div className="flex items-center space-x-1">
              {getVerificationIcon(subscription.sharerVerification)}
              <span className="text-xs text-gray-500 capitalize">{subscription.sharerVerification}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pricing */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">Your cost:</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">${subscription.costPerSlot}</div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
        </div>

        {/* Spots Available */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Spots available</span>
            </div>
            <span className="text-sm font-medium">
              {spotsLeft} of {spotsTotal} left
            </span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
        </div>

        {/* Sharer Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {subscription.sharerUserId.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">Sharer</span>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                {subscription.sharerReputation}% trusted
              </Badge>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Member since {new Date(subscription.createdAt).getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Lock className="h-3 w-3 text-green-600" />
            <span>End-to-end encrypted</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="h-3 w-3 text-blue-600" />
            <span>Escrow protected</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails?.(subscription.id)}
          >
            View Details
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => onJoin?.(subscription.id)}
            disabled={spotsLeft === 0}
          >
            {spotsLeft === 0 ? 'Full' : 'Join Share'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}