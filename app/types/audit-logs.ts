
export interface ActivityLog {
  id: number;
  admin: string;
  role: string;
  action: string;
  target: string;
  timestamp: string;
  type: string;
  ipAddress?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: {
    name: string;
    level: number;
  };
  lastActive: string;
}

export interface AuditLogsProps {
  activityLogs?: ActivityLog[];
  currentUser?: AdminUser;
}
