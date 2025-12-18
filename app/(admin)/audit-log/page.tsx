"use client";

import { CurrentUserCard } from '@/app/components/admin/audit-logs/current-user-card';
import { RealTimeAlert } from '@/app/components/admin/audit-logs/real-time-alert';
import { LogsTable } from '@/app/components/admin/audit-logs/logs-table';
import { Filters } from '@/app/components/admin/audit-logs/filters';
import { StatsCards } from '@/app/components/admin/audit-logs/stats-cards';
import { ActivityLog, AuditLogsProps } from '@/app/types/audit-logs';
const SAMPLE_LOGS: ActivityLog[] = [
  {
    id: 1001,
    admin: 'Admin User',
    role: 'Super Admin',
    action: 'Verified Club',
    target: 'Mumbai Cricket Club',
    timestamp: '2024-12-04 10:30 AM',
    type: 'Club Management',
    ipAddress: '192.168.1.5'
  },
  {
    id: 1002,
    admin: 'Sarah Wilson',
    role: 'Moderator',
    action: 'Suspended User',
    target: 'user@example.com',
    timestamp: '2024-12-04 09:15 AM',
    type: 'User Management',
    ipAddress: '192.168.1.8'
  },
  {
    id: 1003,
    admin: 'Mike Johnson',
    role: 'Support',
    action: 'Responded to Report',
    target: 'Report #1234',
    timestamp: '2024-12-04 08:45 AM',
    type: 'Reports',
    ipAddress: '192.168.1.12'
  },
  {
    id: 1004,
    admin: 'Emma Davis',
    role: 'Developer',
    action: 'Updated System Settings',
    target: 'API Configuration',
    timestamp: '2024-12-03 05:20 PM',
    type: 'System Settings',
    ipAddress: '192.168.1.15'
  },
  {
    id: 1005,
    admin: 'Admin User',
    role: 'Super Admin',
    action: 'Approved Review',
    target: 'Review #567',
    timestamp: '2024-12-03 03:10 PM',
    type: 'Reviews Management',
    ipAddress: '192.168.1.5'
  },
];


const MOCK_CURRENT_USER = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: {
    name: 'Super Admin',
    level: 10
  },
  lastActive: '2024-12-04 10:45 AM',
  club: 'Admin Club',
  subscription: 'Premium',
  status: 'Active' as const,
  joined: '2023-01-01'
};

export default function AuditLogs({ activityLogs = [], currentUser = MOCK_CURRENT_USER }: AuditLogsProps) {
  const allLogs = [...activityLogs, ...SAMPLE_LOGS].sort((a, b) => b.id - a.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-[#1e293b] mb-1">Audit Logs</h1>
        <p className="text-[#64748b]">Track all administrative actions and system changes in real-time</p>
      </div>

      {currentUser && (
        <CurrentUserCard 
          currentUser={currentUser} 
          activityLogsCount={activityLogs.length} 
        />
      )}

      <RealTimeAlert activityLogsCount={activityLogs.length} />

      <Filters />

      <LogsTable allLogs={allLogs} activityLogs={activityLogs} />

      <StatsCards totalLogs={allLogs.length} sessionLogs={activityLogs.length} />
    </div>
  );
}