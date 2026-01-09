"use client";

import { useState, useEffect } from 'react';
import { Search, Download, User, Shield, Settings, Database, Users, FileText, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import makeRequest from "@/Api's/apiHelper";
import { GetActivityLogById } from "@/Api's/repo";
import { useAuth } from "@/app/hooks/useAuth";
import Pagination from '@/app/components/common/Pagination';
import Loader from '@/app/components/common/Loader';

interface UserInfo {
  _id: string;
  email: string;
  full_name: string;
  profile_pic: string;
}

interface ActivityLogItem {
  _id: string;
  user_id: UserInfo;
  action: string;
  ip: string;
  response_status: number;
  created_at: string;
}

interface ActivityLogResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  total_records: number | null;
  page_number: number | null;
  total_pages: number | null;
  message: string;
  error_message: null;
  token: null;
  result: ActivityLogItem[];
  misc_data: null;
}

export default function ActivityLogs() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const fetchActivityLog = async (page: number = 1) => {
    try {
      setIsLoading(true);
      if (!user?._id) return;

      const response = await makeRequest<ActivityLogResponse>({
        url: GetActivityLogById,
        method: 'GET',
        params: { user_id: user._id, page, limit },
      });

      console.log('Activity Log Response:', response);

      if (response.data) {
        setActivityLogs(response.data.result || []);
        setTotalPages(response.data.total_pages || 1);
        setTotalRecords(response.data.total_records || response.data.result?.length || 0);
        setCurrentPage(response.data.page_number || page);
      }
    } catch (error) {
      console.error('Error fetching activity log:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLog(1);
  }, [user]);

  const handlePageChange = (page: number) => {
    fetchActivityLog(page);
  };

  const getStatusFromResponseCode = (status: number): 'success' | 'failed' | 'warning' => {
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400) return 'failed';
    return 'warning';
  };

  const getCategoryFromAction = (action: string): 'user' | 'security' | 'content' | 'system' | 'admin' => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login') || actionLower.includes('logout') || actionLower.includes('auth')) return 'security';
    if (actionLower.includes('create') || actionLower.includes('update') || actionLower.includes('delete')) return 'admin';
    if (actionLower.includes('content') || actionLower.includes('post') || actionLower.includes('media')) return 'content';
    if (actionLower.includes('settings') || actionLower.includes('config') || actionLower.includes('system')) return 'system';
    return 'user';
  };

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionDescription = (action: string): string => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('login')) return 'Logged into the system';
    if (actionLower.includes('logout')) return 'Logged out from the system';
    if (actionLower.includes('create')) return `Created new ${actionLower.replace('/admin-create-', '').replace('-', ' ')}`;
    if (actionLower.includes('update')) return `Updated ${actionLower.replace('/admin-update-', '').replace('-', ' ')}`;
    if (actionLower.includes('delete')) return `Deleted ${actionLower.replace('/admin-delete-', '').replace('-', ' ')}`;
    if (actionLower.includes('view')) return `Viewed ${actionLower.replace('/admin-view-', '').replace('-', ' ')}`;
    if (actionLower.includes('export')) return `Exported ${actionLower.replace('/admin-export-', '').replace('-', ' ')}`;
    return action;
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.user_id.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const stats = {
    total: totalRecords,
    today: activityLogs.filter(log => {
      const logDate = new Date(log.created_at);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
    success: activityLogs.filter(log => log.response_status >= 200 && log.response_status < 300).length,
    failed: activityLogs.filter(log => log.response_status >= 400).length,
  };

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

  if (isLoading) {
    return <Loader />;
  }

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
                  placeholder="Search activities by user, action, or IP address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#e2e8f0] h-11"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs Table */}
      <Card className="border-[#e2e8f0] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">
            Activity Timeline
          </CardTitle>
          <CardDescription className="text-[#64748b]">
            Showing {filteredLogs.length} of {totalRecords} activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const category = getCategoryFromAction(log.action);
              const status = getStatusFromResponseCode(log.response_status);
              
              return (
                <div
                  key={log._id}
                  className="p-5 bg-slate-50 rounded-lg border border-[#e2e8f0] hover:border-[#007BFF] transition-all hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      {/* Category Icon */}
                      <div className={`w-10 h-10 rounded-lg ${getCategoryColor(category).replace('text-', 'bg-').replace('100', '50')} flex items-center justify-center shrink-0`}>
                        {getCategoryIcon(category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="text-sm text-[#1e293b]">{getActionDescription(log.action)}</h4>
                          <Badge className={`${getCategoryColor(category)} hover:${getCategoryColor(category)} text-xs`}>
                            {category}
                          </Badge>
                          {getStatusIcon(status)}
                        </div>
                        
                        <p className="text-sm text-[#64748b] mb-3">
                          {log.user_id.full_name} ({log.user_id.email})
                        </p>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-[#64748b]">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>{log.user_id.full_name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatTimestamp(log.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            <span>{log.ip}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Status: {log.response_status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-[#64748b] mx-auto mb-3" />
              <p className="text-[#64748b]">No activities found matching your filters</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              limit={limit}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

