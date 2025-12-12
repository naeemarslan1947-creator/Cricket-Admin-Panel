"use client";

import { useState } from 'react';
import { Search, Download, Filter, Calendar, User, Shield, Settings, Database, Users, FileText,  Eye, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';


interface ActivityLog {
  id: number;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  category: 'user' | 'security' | 'content' | 'system' | 'admin';
  description: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'warning';
  details?: string;
}

export default function ActivityLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'user' | 'security' | 'content' | 'system' | 'admin'>('all');
  const [visibleCount, setVisibleCount] = useState(8);

  const activityLogs: ActivityLog[] = [
    {
      id: 1,
      timestamp: 'Today, 10:30 AM',
      user: 'Rahul Sharma',
      userRole: 'Super Admin',
      action: 'Updated user role',
      category: 'admin',
      description: 'Changed Priya Patel role from Support to Moderator',
      ipAddress: '103.21.45.78',
      status: 'success',
      details: 'User ID: #12345',
    },
    {
      id: 2,
      timestamp: 'Today, 10:15 AM',
      user: 'Amit Kumar',
      userRole: 'Moderator',
      action: 'Deleted reported content',
      category: 'content',
      description: 'Removed inappropriate post from Mumbai Cricket Club',
      ipAddress: '103.21.45.92',
      status: 'success',
      details: 'Post ID: #98765',
    },
    {
      id: 3,
      timestamp: 'Today, 9:45 AM',
      user: 'Priya Patel',
      userRole: 'Support',
      action: 'Resolved support ticket',
      category: 'user',
      description: 'Helped user with subscription billing issue',
      ipAddress: '103.21.45.88',
      status: 'success',
      details: 'Ticket ID: #54321',
    },
    {
      id: 4,
      timestamp: 'Today, 9:30 AM',
      user: 'Vikram Singh',
      userRole: 'Developer',
      action: 'Deployed system update',
      category: 'system',
      description: 'Released v2.4.1 with bug fixes and performance improvements',
      ipAddress: '103.21.45.65',
      status: 'success',
      details: 'Version: 2.4.1',
    },
    {
      id: 5,
      timestamp: 'Today, 8:45 AM',
      user: 'Amit Kumar',
      userRole: 'Moderator',
      action: 'Approved club registration',
      category: 'content',
      description: 'Verified and approved Bangalore Strikers Cricket Club',
      ipAddress: '103.21.45.92',
      status: 'success',
      details: 'Club ID: #7891',
    },
    {
      id: 6,
      timestamp: 'Today, 8:30 AM',
      user: 'Rahul Sharma',
      userRole: 'Super Admin',
      action: 'Sent push notification',
      category: 'admin',
      description: 'Global announcement: New tournament features available',
      ipAddress: '103.21.45.78',
      status: 'success',
      details: 'Recipients: 18,542',
    },
    {
      id: 7,
      timestamp: 'Today, 7:50 AM',
      user: 'Unknown User',
      userRole: 'N/A',
      action: 'Failed login attempt',
      category: 'security',
      description: 'Multiple failed login attempts from suspicious IP',
      ipAddress: '182.75.34.21',
      status: 'failed',
      details: 'Attempts: 7',
    },
    {
      id: 8,
      timestamp: 'Yesterday, 11:45 PM',
      user: 'System',
      userRole: 'System',
      action: 'Security scan completed',
      category: 'security',
      description: 'Weekly security vulnerability scan finished',
      ipAddress: 'Internal',
      status: 'success',
      details: 'Vulnerabilities found: 0',
    },
    {
      id: 9,
      timestamp: 'Yesterday, 10:30 PM',
      user: 'Amit Kumar',
      userRole: 'Moderator',
      action: 'Banned user account',
      category: 'content',
      description: 'Suspended account for violating community guidelines',
      ipAddress: '103.21.45.92',
      status: 'success',
      details: 'User ID: #34567',
    },
    {
      id: 10,
      timestamp: 'Yesterday, 9:15 PM',
      user: 'Rahul Sharma',
      userRole: 'Super Admin',
      action: 'Created new admin user',
      category: 'admin',
      description: 'Added new support staff member: Anjali Verma',
      ipAddress: '103.21.45.78',
      status: 'success',
      details: 'User ID: #45678',
    },
    {
      id: 11,
      timestamp: 'Yesterday, 8:00 PM',
      user: 'Vikram Singh',
      userRole: 'Developer',
      action: 'Updated API configuration',
      category: 'system',
      description: 'Modified rate limiting for payment gateway integration',
      ipAddress: '103.21.45.65',
      status: 'warning',
      details: 'Config: api_rate_limit',
    },
    {
      id: 12,
      timestamp: 'Yesterday, 7:30 PM',
      user: 'Priya Patel',
      userRole: 'Support',
      action: 'Exported user data',
      category: 'user',
      description: 'Generated CSV export of premium users for marketing team',
      ipAddress: '103.21.45.88',
      status: 'success',
      details: 'Records: 2,847',
    },
  ];

  const stats = {
    total: activityLogs.length,
    today: activityLogs.filter(log => log.timestamp.includes('Today')).length,
    success: activityLogs.filter(log => log.status === 'success').length,
    failed: activityLogs.filter(log => log.status === 'failed').length,
  };

  const filterCategories = [
    { id: 'all', label: 'All Activities', icon: FileText, count: activityLogs.length },
    { id: 'user', label: 'User Actions', icon: Users, count: activityLogs.filter(log => log.category === 'user').length },
    { id: 'security', label: 'Security', icon: Shield, count: activityLogs.filter(log => log.category === 'security').length },
    { id: 'content', label: 'Content', icon: Database, count: activityLogs.filter(log => log.category === 'content').length },
    { id: 'system', label: 'System', icon: Settings, count: activityLogs.filter(log => log.category === 'system').length },
    { id: 'admin', label: 'Admin', icon: User, count: activityLogs.filter(log => log.category === 'admin').length },
  ];

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || log.category === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user': return <Users className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'content': return <Database className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'admin': return <User className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'user': return 'bg-blue-100 text-blue-700';
      case 'security': return 'bg-red-100 text-red-700';
      case 'content': return 'bg-purple-100 text-purple-700';
      case 'system': return 'bg-gray-100 text-gray-700';
      case 'admin': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };

  const handleExport = () => {
    console.log('Exporting activity logs...');
    // Export logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1e293b] mb-1">Activity Logs</h1>
          <p className="text-[#64748b]">Monitor all actions and events across the platform</p>
        </div>
        <Button onClick={handleExport} className="bg-[#00C853] hover:bg-[#00A843] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0] shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748b] mb-1">Total Activities</p>
                <h3 className="text-2xl text-[#1e293b]">{stats.total}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748b] mb-1">Today&apos;s Activity</p>
                <h3 className="text-2xl text-[#1e293b]">{stats.today}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748b] mb-1">Successful</p>
                <h3 className="text-2xl text-[#1e293b]">{stats.success}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#64748b] mb-1">Failed</p>
                <h3 className="text-2xl text-[#1e293b]">{stats.failed}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="border-[#e2e8f0] shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                <Input
                  placeholder="Search activities by user, action, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#e2e8f0] h-11"
                />
              </div>
            </div>

            {/* Date Filter */}
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#e2e8f0]">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
              <Button variant="outline" className="border-[#e2e8f0]">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {filterCategories.map((category) => {
          const Icon = category.icon;
          const isActive = activeFilter === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id as typeof activeFilter)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
                isActive
                  ? 'border-[#007BFF] bg-blue-50 text-[#007BFF]'
                  : 'border-[#e2e8f0] bg-white text-[#64748b] hover:border-[#007BFF] hover:text-[#007BFF]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{category.label}</span>
              <Badge className={`${isActive ? 'bg-[#007BFF] text-white' : 'bg-slate-100 text-[#64748b]'} hover:bg-current`}>
                {category.count}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Activity Logs Table */}
      <Card className="border-[#e2e8f0] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">
            Activity Timeline
          </CardTitle>
          <CardDescription className="text-[#64748b]">
            Showing {filteredLogs.length} of {activityLogs.length} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.slice(0, visibleCount).map((log) => (
              <div
                key={log.id}
                className="p-5 bg-slate-50 rounded-lg border border-[#e2e8f0] hover:border-[#007BFF] transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4 flex-1">
                    {/* Category Icon */}
                    <div className={`w-10 h-10 rounded-lg ${getCategoryColor(log.category).replace('text-', 'bg-').replace('100', '50')} flex items-center justify-center flex-shrink-0`}>
                      {getCategoryIcon(log.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h4 className="text-sm text-[#1e293b]">{log.action}</h4>
                        <Badge className={`${getCategoryColor(log.category)} hover:${getCategoryColor(log.category)} text-xs`}>
                          {log.category}
                        </Badge>
                        {getStatusIcon(log.status)}
                      </div>
                      
                      <p className="text-sm text-[#64748b] mb-3">{log.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-xs text-[#64748b]">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          <span>{log.user}</span>
                          {log.userRole !== 'System' && log.userRole !== 'N/A' && (
                            <Badge className="bg-slate-100 text-[#64748b] hover:bg-slate-100 text-xs px-1.5 py-0">
                              {log.userRole}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{log.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          <span>{log.ipAddress}</span>
                        </div>
                        {log.details && (
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{log.details}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button variant="ghost" size="sm" className="text-[#64748b] hover:text-[#007BFF]">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-[#64748b] mx-auto mb-3" />
              <p className="text-[#64748b]">No activities found matching your filters</p>
            </div>
          )}

          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#e2e8f0]">
              <p className="text-sm text-[#64748b]">
                Showing 1 to {Math.min(visibleCount, filteredLogs.length)} of {filteredLogs.length} results
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="border-[#e2e8f0]" onClick={() => setVisibleCount(visibleCount + 8)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}