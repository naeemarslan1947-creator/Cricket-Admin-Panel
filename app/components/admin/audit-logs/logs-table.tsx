import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { ActivityLog } from '@/app/types/audit-logs';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';

interface LogsTableProps {
  allLogs: ActivityLog[];
  activityLogs: ActivityLog[];
}

export function LogsTable({ allLogs, activityLogs }: LogsTableProps) {
  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Authentication': 'bg-indigo-100 text-indigo-800',
      'Navigation': 'bg-cyan-100 text-cyan-800',
      'Club Management': 'bg-green-100 text-green-800',
      'User Management': 'bg-blue-100 text-blue-800',
      'Content Moderation': 'bg-amber-100 text-amber-800',
      'System Settings': 'bg-purple-100 text-purple-800',
      'Reviews Management': 'bg-pink-100 text-pink-800',
      'Reports': 'bg-orange-100 text-orange-800',
    };
    return <Badge className={`${colors[type] || 'bg-gray-100 text-gray-800'} hover:${colors[type] || 'bg-gray-100 text-gray-800'}`}>{type}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'Super Admin': 'bg-red-100 text-red-700 border border-red-200',
      'Super-Admin': 'bg-red-100 text-red-700 border border-red-200',
      'Moderator': 'bg-blue-100 text-blue-700 border border-blue-200',
      'Support': 'bg-green-100 text-green-700 border border-green-200',
      'Developer': 'bg-purple-100 text-purple-700 border border-purple-200',
    };
    return <Badge className={`${colors[role] || 'bg-gray-100 text-gray-700'}`}>{role}</Badge>;
  };

  return (
    <Card className="border-[#e2e8f0] ">
      <CardHeader>
        <CardTitle className="text-[#1e293b]">Activity Log</CardTitle>
        <p className="text-sm text-[#64748b]">
          Showing {allLogs.length} log{allLogs.length !== 1 ? 's' : ''} 
          {activityLogs.length > 0 && ` (${activityLogs.length} from current session)`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Admin</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-[#64748b]">
                    No activity logs yet. Actions will appear here as they occur.
                  </TableCell>
                </TableRow>
              ) : (
                allLogs.map((log) => (
                  <TableRow 
                    key={log.id} 
                    className={`hover:bg-[#F8FAFC] ${activityLogs.some(l => l.id === log.id) ? 'bg-green-50/50' : ''}`}
                  >
                    <TableCell className="text-[#1e293b]">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={log.profile_pic} alt={log.admin} />
                          <AvatarFallback className="text-xs">{log.admin?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <span>{log.admin}</span>
                        {activityLogs.some(l => l.id === log.id) && (
                          <Badge className="bg-green-100 text-green-700 text-xs">New</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(log.role)}</TableCell>
                    <TableCell className="text-[#64748b]">{log.action}</TableCell>
                    <TableCell className="text-[#64748b]">{log.target}</TableCell>
                    <TableCell>{getTypeBadge(log.type)}</TableCell>
                    <TableCell className="text-[#64748b] text-xs font-mono">{log.ipAddress || 'N/A'}</TableCell>
                    <TableCell className="text-[#64748b] text-xs">{log.timestamp}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}