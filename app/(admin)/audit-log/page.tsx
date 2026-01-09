"use client";

import { useState, useEffect } from 'react';
import { CurrentUserCard } from '@/app/components/admin/audit-logs/current-user-card';
import { RealTimeAlert } from '@/app/components/admin/audit-logs/real-time-alert';
import { LogsTable } from '@/app/components/admin/audit-logs/logs-table';
import { Filters } from '@/app/components/admin/audit-logs/filters';
import { StatsCards } from '@/app/components/admin/audit-logs/stats-cards';
import { ActivityLog, AuditLogsProps } from '@/app/types/audit-logs';
import makeRequest from "@/Api's/apiHelper";
import { GetAllAdminLogs } from "@/Api's/repo";
import Pagination from '@/app/components/common/Pagination';
import Loader from '@/app/components/common/Loader';

interface ApiLogEntry {
  _id: string;
  user_id: {
    _id: string;
    email: string;
    full_name: string;
    profile_pic?: string;
  };
  action: string;
  ip: string;
  response_status: number;
  created_at: string;
}

interface AdminLogsResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  total_records: number | null;
  page_number: number | null;
  total_pages: number | null;
  message: string;
  error_message: null | string;
  token: null;
  result: ApiLogEntry[];
  misc_data: null;
}

// Helper to extract type from action
const getActionType = (action: string): string => {
  if (action.includes('login') || action.includes('logout') || action.includes('auth')) {
    return 'Authentication';
  }
  if (action.includes('club')) {
    return 'Club Management';
  }
  if (action.includes('user')) {
    return 'User Management';
  }
  if (action.includes('review') || action.includes('report')) {
    return 'Reports';
  }
  if (action.includes('settings') || action.includes('config')) {
    return 'System Settings';
  }
  if (action.includes('content') || action.includes('moderate')) {
    return 'Content Moderation';
  }
  return 'Navigation';
};

// Transform API response to ActivityLog format
const transformApiLogToActivityLog = (apiLog: ApiLogEntry): ActivityLog => {
  return {
    id: apiLog._id.charCodeAt(apiLog._id.length - 1) * 1000 + Math.floor(Math.random() * 100),
    admin: apiLog.user_id?.full_name || apiLog.user_id?.email || 'Unknown Admin',
    role: 'Admin user', // Default role since API doesn't return role info
    action: apiLog.action,
    target: apiLog.user_id?.email || 'System',
    timestamp: new Date(apiLog.created_at).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }),
    type: getActionType(apiLog.action),
    ipAddress: apiLog.ip,
    profile_pic: apiLog.user_id?.profile_pic
  };
};

export default function AuditLogs() {
  const [adminLogs, setAdminLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;

  const fetchAdminLogs = async (page: number = 1) => {
    try {
      setIsLoading(true);
      
      const response = await makeRequest<AdminLogsResponse>({
        url: GetAllAdminLogs,
        method: 'GET',
        params: { page, limit },
      });

      console.log('All Admin Logs Response:', response);

      if (response.data) {
        const transformedLogs = (response.data.result || []).map(transformApiLogToActivityLog);
        setAdminLogs(transformedLogs);
        setTotalPages(response.data.total_pages || 1);
        setTotalRecords(response.data.total_records || response.data.result?.length || 0);
        setCurrentPage(response.data.page_number || page);
      }
    } catch (error) {
      console.error('Error fetching admin logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminLogs(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchAdminLogs(page);
  };

  const allLogs = adminLogs;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-[#1e293b] mb-1">Audit Logs</h1>
        <p className="text-[#64748b]">Track all administrative actions and system changes in real-time</p>
      </div>
      <CurrentUserCard />

      <RealTimeAlert activityLogsCount={adminLogs.length} />

      {/* <Filters /> */}

      <LogsTable allLogs={allLogs} activityLogs={adminLogs} />

      <StatsCards totalLogs={allLogs.length} sessionLogs={adminLogs.length} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          limit={limit}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

