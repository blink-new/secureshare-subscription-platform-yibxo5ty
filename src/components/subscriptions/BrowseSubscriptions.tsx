import { useState } from 'react'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SubscriptionCard } from './SubscriptionCard'
import { Subscription } from '@/types'

// Mock data for demonstration
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    title: 'Netflix Premium 4K',
    service: 'Netflix',
    description: 'Premium Netflix subscription with 4K streaming and 4 simultaneous screens. Perfect for families and groups.',
    totalCost: 19.99,
    costPerSlot: 4.99,
    totalSlots: 4,
    availableSlots: 2,
    duration: 'Monthly',
    category: 'Streaming',
    sharerUserId: 'user123',
    sharerReputation: 98,
    sharerVerification: 'premium',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    trustScore: 98,
    encryptionLevel: 'enhanced'
  },
  {
    id: '2',
    title: 'Spotify Family Plan',
    service: 'Spotify',
    description: 'Spotify Family subscription for up to 6 accounts. Individual playlists and recommendations for each member.',
    totalCost: 17.99,
    costPerSlot: 2.99,
    totalSlots: 6,
    availableSlots: 1,
    duration: 'Monthly',
    category: 'Music',
    sharerUserId: 'user456',
    sharerReputation: 95,
    sharerVerification: 'enhanced',
    isActive: true,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    trustScore: 95,
    encryptionLevel: 'standard'
  },
  {
    id: '3',
    title: 'Adobe Creative Cloud',
    service: 'Adobe',
    description: 'Complete Adobe Creative Suite including Photoshop, Illustrator, Premiere Pro, and more. Perfect for creatives.',
    totalCost: 59.99,
    costPerSlot: 19.99,
    totalSlots: 3,
    availableSlots: 1,
    duration: 'Monthly',
    category: 'Software',
    sharerUserId: 'user789',
    sharerReputation: 92,
    sharerVerification: 'enhanced',
    isActive: true,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-08T09:15:00Z',
    trustScore: 92,
    encryptionLevel: 'military'
  },
  {
    id: '4',
    title: 'Disney+ Bundle',
    service: 'Disney+',
    description: 'Disney+ with Hulu and ESPN+ bundle. Access to Disney, Marvel, Star Wars, Pixar content and live sports.',
    totalCost: 19.99,
    costPerSlot: 4.99,
    totalSlots: 4,
    availableSlots: 3,
    duration: 'Monthly',
    category: 'Streaming',
    sharerUserId: 'user101',
    sharerReputation: 89,
    sharerVerification: 'basic',
    isActive: true,
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
    trustScore: 89,
    encryptionLevel: 'standard'
  }
]

const categories = ['All', 'Streaming', 'Music', 'Software', 'Gaming', 'Productivity']
const sortOptions = [
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'trust-high', label: 'Trust Score: High to Low' },
  { value: 'spots-most', label: 'Most Spots Available' },
  { value: 'newest', label: 'Newest First' }
]

export function BrowseSubscriptions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('trust-high')
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions)

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.costPerSlot - b.costPerSlot
      case 'price-high':
        return b.costPerSlot - a.costPerSlot
      case 'trust-high':
        return b.trustScore - a.trustScore
      case 'spots-most':
        return b.availableSlots - a.availableSlots
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  const handleJoinShare = (id: string) => {
    console.log('Joining share:', id)
    // TODO: Implement join share logic
  }

  const handleViewDetails = (id: string) => {
    console.log('Viewing details for:', id)
    // TODO: Implement view details logic
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Subscription Shares</h1>
          <p className="text-gray-600">Discover secure subscription shares from trusted members</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 w-fit">
          {sortedSubscriptions.length} shares available
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search subscriptions, services, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Badges */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results */}
      {sortedSubscriptions.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedSubscriptions.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onJoin={handleJoinShare}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  )
}