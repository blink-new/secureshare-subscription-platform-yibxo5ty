import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Star,
  Lock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

const stats = [
  {
    title: "Monthly Savings",
    value: "$127.50",
    change: "+12%",
    icon: DollarSign,
    color: "text-green-600"
  },
  {
    title: "Active Shares",
    value: "8",
    change: "+2",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Trust Score",
    value: "95%",
    change: "+3%",
    icon: Star,
    color: "text-yellow-600"
  },
  {
    title: "Security Level",
    value: "Enhanced",
    change: "Verified",
    icon: Shield,
    color: "text-green-600"
  }
]

const recentActivity = [
  {
    id: 1,
    type: "payment",
    title: "Netflix Premium payment processed",
    description: "Monthly payment of $4.99 released from escrow",
    time: "2 hours ago",
    status: "completed",
    icon: CheckCircle
  },
  {
    id: 2,
    type: "join",
    title: "New member joined Spotify Family",
    description: "Sarah M. joined your Spotify share",
    time: "1 day ago",
    status: "active",
    icon: Users
  },
  {
    id: 3,
    type: "security",
    title: "Security scan completed",
    description: "All shared credentials verified and encrypted",
    time: "2 days ago",
    status: "verified",
    icon: Shield
  },
  {
    id: 4,
    type: "alert",
    title: "Payment reminder",
    description: "Adobe Creative Cloud payment due in 3 days",
    time: "3 days ago",
    status: "pending",
    icon: AlertTriangle
  }
]

const activeShares = [
  {
    id: 1,
    service: "Netflix Premium",
    members: 4,
    maxMembers: 4,
    monthlyCost: 4.99,
    status: "active",
    trustScore: 98
  },
  {
    id: 2,
    service: "Spotify Family",
    members: 5,
    maxMembers: 6,
    monthlyCost: 2.99,
    status: "active",
    trustScore: 95
  },
  {
    id: 3,
    service: "Adobe Creative Cloud",
    members: 2,
    maxMembers: 3,
    monthlyCost: 19.99,
    status: "pending",
    trustScore: 92
  }
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Shares */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Active Shares</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeShares.map((share) => (
              <div key={share.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{share.service}</h4>
                    <Badge 
                      variant={share.status === 'active' ? 'default' : 'secondary'}
                      className={share.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {share.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-600">
                      {share.members}/{share.maxMembers} members
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      ${share.monthlyCost}/month
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>Trust Score</span>
                      <span>{share.trustScore}%</span>
                    </div>
                    <Progress value={share.trustScore} className="h-1" />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Shares
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-green-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100' :
                  activity.status === 'active' ? 'bg-blue-100' :
                  activity.status === 'verified' ? 'bg-green-100' :
                  'bg-yellow-100'
                }`}>
                  <activity.icon className={`h-4 w-4 ${
                    activity.status === 'completed' ? 'text-green-600' :
                    activity.status === 'active' ? 'text-blue-600' :
                    activity.status === 'verified' ? 'text-green-600' :
                    'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Alert */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-green-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900">Your account is secure</h3>
              <p className="text-sm text-green-700">
                All your shared subscriptions are protected with end-to-end encryption and multi-party escrow.
              </p>
            </div>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
              Security Center
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}