import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { User } from '@/app/types/users';

interface CurrentUserCardProps {
  currentUser: User;
  activityLogsCount: number;
}

export function CurrentUserCard({ currentUser, activityLogsCount }: CurrentUserCardProps) {
  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'Super Admin': 'bg-red-100 text-red-700 border border-red-200',
      'Moderator': 'bg-blue-100 text-blue-700 border border-blue-200',
      'Support': 'bg-green-100 text-green-700 border border-green-200',
      'Developer': 'bg-purple-100 text-purple-700 border border-purple-200',
    };
    return <Badge className={`${colors[role] || 'bg-gray-100 text-gray-700'}`}>{role}</Badge>;
  };

  return (
    <Card className="border-[#007BFF] shadow-md bg-gradient-to-r from-blue-50 to-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#00C853] rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-[#64748b]">Currently logged in as:</p>
                {getRoleBadge(currentUser.role.name)}
              </div>
              <h3 className="text-lg text-[#1e293b]">{currentUser.name}</h3>
              <p className="text-xs text-[#64748b]">{currentUser.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#64748b] mb-1">Active Logs</p>
            <p className="text-2xl text-[#007BFF]">{activityLogsCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}