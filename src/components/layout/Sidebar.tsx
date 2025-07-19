import { useState } from 'react'
import { 
  Home, 
  Search, 
  Plus, 
  Shield, 
  User, 
  CreditCard, 
  Settings, 
  HelpCircle,
  Star,
  Lock,
  TrendingUp,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  className?: string
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'browse', label: 'Browse Shares', icon: Search },
  { id: 'create', label: 'Create Share', icon: Plus },
  { id: 'my-shares', label: 'My Shares', icon: Star },
  { id: 'escrow', label: 'Escrow', icon: CreditCard, badge: '2' },
  { id: 'chat', label: 'Secure Chat', icon: MessageSquare, badge: '3' },
  { id: 'security', label: 'Security Center', icon: Shield },
  { id: 'reputation', label: 'Reputation', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const securityFeatures = [
  { label: 'End-to-End Encryption', icon: Lock, status: 'active' },
  { label: 'Identity Verified', icon: Shield, status: 'verified' },
  { label: 'Escrow Protection', icon: CreditCard, status: 'active' },
]

export function Sidebar({ activeTab, onTabChange, className }: SidebarProps) {
  return (
    <div className={cn("w-64 bg-white border-r border-gray-200 h-full flex flex-col", className)}>
      <div className="p-6 border-b border-gray-100">
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-900">Security Status</div>
          {securityFeatures.map((feature) => (
            <div key={feature.label} className="flex items-center space-x-2">
              <feature.icon className={cn(
                "h-4 w-4",
                feature.status === 'active' ? "text-green-500" : 
                feature.status === 'verified' ? "text-blue-500" : "text-gray-400"
              )} />
              <span className="text-xs text-gray-600">{feature.label}</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs h-5",
                  feature.status === 'active' ? "bg-green-50 text-green-700 border-green-200" :
                  feature.status === 'verified' ? "bg-blue-50 text-blue-700 border-blue-200" : ""
                )}
              >
                {feature.status === 'active' ? 'ON' : feature.status === 'verified' ? '✓' : 'OFF'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-10",
              activeTab === item.id 
                ? "bg-blue-50 text-blue-700 border border-blue-200" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
            {item.badge && (
              <Badge className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
          <HelpCircle className="h-4 w-4 mr-3" />
          Help & Support
        </Button>
      </div>
    </div>
  )
}