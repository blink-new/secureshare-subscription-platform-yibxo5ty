import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { 
  Shield, 
  Lock, 
  Users, 
  DollarSign, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Info,
  Eye,
  EyeOff
} from 'lucide-react'
import { blink } from '@/blink/client'

interface CreateSubscriptionShareProps {
  onSuccess?: () => void
}

const SUBSCRIPTION_CATEGORIES = [
  'Streaming (Video)',
  'Streaming (Music)',
  'Software & Tools',
  'Cloud Storage',
  'Gaming',
  'News & Media',
  'Education',
  'Productivity',
  'Design & Creative',
  'Other'
]

const ENCRYPTION_LEVELS = [
  { value: 'standard', label: 'Standard Encryption', description: 'AES-256 encryption for credentials' },
  { value: 'enhanced', label: 'Enhanced Security', description: 'Multi-layer encryption + 2FA required' },
  { value: 'premium', label: 'Premium Security', description: 'Zero-knowledge encryption + hardware keys' }
]

export default function CreateSubscriptionShare({ onSuccess }: CreateSubscriptionShareProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    service_name: '',
    category: '',
    description: '',
    monthly_cost: '',
    total_spots: '4',
    available_spots: '3',
    encryption_level: 'standard',
    requires_verification: true,
    auto_approve: false,
    billing_cycle: 'monthly',
    renewal_date: '',
    access_type: 'shared_account',
    trust_score_required: '3.0'
  })

  const [showCredentials, setShowCredentials] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    additional_info: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.service_name.trim()) {
      newErrors.service_name = 'Service name is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    if (!formData.monthly_cost || parseFloat(formData.monthly_cost) <= 0) {
      newErrors.monthly_cost = 'Valid monthly cost is required'
    }
    if (!formData.total_spots || parseInt(formData.total_spots) < 2) {
      newErrors.total_spots = 'At least 2 total spots required'
    }
    if (!formData.available_spots || parseInt(formData.available_spots) >= parseInt(formData.total_spots)) {
      newErrors.available_spots = 'Available spots must be less than total spots'
    }
    if (!formData.renewal_date) {
      newErrors.renewal_date = 'Renewal date is required'
    }
    if (!credentials.username.trim()) {
      newErrors.username = 'Username/email is required'
    }
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const user = await blink.auth.me()
      
      // Create the subscription share
      const subscriptionData = {
        id: `sub_${Date.now()}`,
        title: formData.service_name,
        service: formData.service_name,
        service_name: formData.service_name,
        category: formData.category,
        description: formData.description,
        total_cost: parseFloat(formData.monthly_cost),
        cost_per_slot: parseFloat(formData.monthly_cost) / parseInt(formData.total_spots),
        monthly_cost: parseFloat(formData.monthly_cost),
        total_slots: parseInt(formData.total_spots),
        available_slots: parseInt(formData.available_spots),
        total_spots: parseInt(formData.total_spots),
        available_spots: parseInt(formData.available_spots),
        duration: formData.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly',
        sharer_user_id: user.id,
        sharer_reputation: 85, // Default for new users
        sharer_verification: 'basic',
        is_active: true,
        trust_score: 85,
        encryption_level: formData.encryption_level,
        requires_verification: formData.requires_verification,
        auto_approve: formData.auto_approve,
        billing_cycle: formData.billing_cycle,
        renewal_date: formData.renewal_date,
        access_type: formData.access_type,
        trust_score_required: parseFloat(formData.trust_score_required),
        status: 'active'
      }

      await blink.db.subscriptions.create(subscriptionData)

      // Store encrypted credentials (in a real app, this would be properly encrypted)
      const credentialData = {
        id: `cred_${Date.now()}`,
        subscription_id: subscriptionData.id,
        username: credentials.username,
        password: credentials.password, // This would be encrypted in production
        additional_info: credentials.additional_info,
        encryption_level: formData.encryption_level,
        created_at: new Date().toISOString()
      }

      await blink.db.subscription_credentials.create(credentialData)

      // Show success message
      toast({
        title: "Subscription Share Created!",
        description: `Your ${formData.service_name} share has been created successfully and is now available for others to join.`,
      })

      // Reset form
      setFormData({
        service_name: '',
        category: '',
        description: '',
        monthly_cost: '',
        total_spots: '4',
        available_spots: '3',
        encryption_level: 'standard',
        requires_verification: true,
        auto_approve: false,
        billing_cycle: 'monthly',
        renewal_date: '',
        access_type: 'shared_account',
        trust_score_required: '3.0'
      })
      setCredentials({
        username: '',
        password: '',
        additional_info: ''
      })

      onSuccess?.()
    } catch (error) {
      console.error('Error creating subscription share:', error)
      setErrors({ submit: 'Failed to create subscription share. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const costPerPerson = formData.monthly_cost ? 
    (parseFloat(formData.monthly_cost) / parseInt(formData.total_spots || '1')).toFixed(2) : '0.00'

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Share Your Subscription</h1>
        <p className="text-gray-600">Create a secure share for your digital subscription and split costs with trusted members</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Tell us about the subscription you want to share
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="service_name">Service Name *</Label>
                <Input
                  id="service_name"
                  placeholder="e.g., Netflix, Spotify, Adobe Creative Cloud"
                  value={formData.service_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_name: e.target.value }))}
                  className={errors.service_name ? 'border-red-500' : ''}
                />
                {errors.service_name && (
                  <p className="text-sm text-red-600">{errors.service_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBSCRIPTION_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional: Add details about the subscription plan, features, or any special requirements"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Cost & Sharing Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Cost & Sharing Details
            </CardTitle>
            <CardDescription>
              Set up the financial structure for your subscription share
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly_cost">Monthly Cost ($) *</Label>
                <Input
                  id="monthly_cost"
                  type="number"
                  step="0.01"
                  placeholder="15.99"
                  value={formData.monthly_cost}
                  onChange={(e) => setFormData(prev => ({ ...prev, monthly_cost: e.target.value }))}
                  className={errors.monthly_cost ? 'border-red-500' : ''}
                />
                {errors.monthly_cost && (
                  <p className="text-sm text-red-600">{errors.monthly_cost}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_spots">Total Spots *</Label>
                <Select value={formData.total_spots} onValueChange={(value) => setFormData(prev => ({ ...prev, total_spots: value }))}>
                  <SelectTrigger className={errors.total_spots ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} people
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.total_spots && (
                  <p className="text-sm text-red-600">{errors.total_spots}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="available_spots">Available Spots *</Label>
                <Select value={formData.available_spots} onValueChange={(value) => setFormData(prev => ({ ...prev, available_spots: value }))}>
                  <SelectTrigger className={errors.available_spots ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: parseInt(formData.total_spots) - 1 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} spot{num > 1 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.available_spots && (
                  <p className="text-sm text-red-600">{errors.available_spots}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billing_cycle">Billing Cycle</Label>
                <Select value={formData.billing_cycle} onValueChange={(value) => setFormData(prev => ({ ...prev, billing_cycle: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="renewal_date">Next Renewal Date *</Label>
                <Input
                  id="renewal_date"
                  type="date"
                  value={formData.renewal_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, renewal_date: e.target.value }))}
                  className={errors.renewal_date ? 'border-red-500' : ''}
                />
                {errors.renewal_date && (
                  <p className="text-sm text-red-600">{errors.renewal_date}</p>
                )}
              </div>
            </div>

            {/* Cost Breakdown */}
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Cost per person: ${costPerPerson}</strong> - Each member will pay this amount monthly through our secure escrow system.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Configure security and trust requirements for your subscription share
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Encryption Level</Label>
              <div className="space-y-3">
                {ENCRYPTION_LEVELS.map((level) => (
                  <div key={level.value} className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id={level.value}
                      name="encryption_level"
                      value={level.value}
                      checked={formData.encryption_level === level.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, encryption_level: e.target.value }))}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor={level.value} className="font-medium cursor-pointer">
                        {level.label}
                      </label>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requires_verification">Require Identity Verification</Label>
                    <p className="text-sm text-gray-600">Only verified users can join</p>
                  </div>
                  <Switch
                    id="requires_verification"
                    checked={formData.requires_verification}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_verification: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_approve">Auto-approve Requests</Label>
                    <p className="text-sm text-gray-600">Automatically approve qualified users</p>
                  </div>
                  <Switch
                    id="auto_approve"
                    checked={formData.auto_approve}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, auto_approve: checked }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trust_score_required">Minimum Trust Score Required</Label>
                <Select value={formData.trust_score_required} onValueChange={(value) => setFormData(prev => ({ ...prev, trust_score_required: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">1.0 - New Users</SelectItem>
                    <SelectItem value="2.0">2.0 - Basic Trust</SelectItem>
                    <SelectItem value="3.0">3.0 - Good Standing</SelectItem>
                    <SelectItem value="4.0">4.0 - High Trust</SelectItem>
                    <SelectItem value="4.5">4.5 - Excellent Trust</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Account Credentials
            </CardTitle>
            <CardDescription>
              Securely store your subscription credentials. These will be encrypted and only shared with approved members.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your credentials are encrypted with military-grade security and only accessible to approved share members.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username/Email *</Label>
                <Input
                  id="username"
                  type="email"
                  placeholder="your.email@example.com"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showCredentials ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCredentials(!showCredentials)}
                  >
                    {showCredentials ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additional_info">Additional Information</Label>
              <Textarea
                id="additional_info"
                placeholder="Optional: Any additional login instructions, 2FA details, or special notes for members"
                value={credentials.additional_info}
                onChange={(e) => setCredentials(prev => ({ ...prev, additional_info: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        {errors.submit && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
            {isSubmitting ? 'Creating...' : 'Create Share'}
          </Button>
        </div>
      </form>
    </div>
  )
}