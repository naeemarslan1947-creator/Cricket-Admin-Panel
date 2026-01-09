
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { useAuth } from '@/app/hooks/useAuth';
import makeRequest from "@/Api's/apiHelper";
import { GetActivityLogById } from "@/Api's/repo";
import { useState, useEffect } from 'react';

interface CurrentUserCardProps {
  activityLogsCount?: number;
}

interface ActivityLogResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  total_records: number | null;
  message: string;
  result?: Array<{
    _id: string;
    user_id: {
      _id: string;
      email: string;
      profile_pic?: string;
    };
    action: string;
    ip: string;
    response_status: number;
    created_at: string;
  }>;
  misc_data: null;
}

export function CurrentUserCard() {
  const { user } = useAuth();
  const [logsCount, setLogsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserActivityLogs = async () => {
      if (!user?._id) return;

      try {
        setIsLoading(true);
        const response = await makeRequest<ActivityLogResponse>({
          url: GetActivityLogById,
          method: 'GET',
          params: { user_id: user._id },
        });

        console.log('📢[current-user-card.tsx:38]: Activity Log Response:', response);

        if (response.data?.success && response.data?.result) {
          setLogsCount(response.data.result.length);
        }
      } catch (error) {
        console.error('Error fetching user activity logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserActivityLogs();
  }, [user?._id]);

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
    <Card className="border-[#007BFF] shadow-md bg-linear-to-r from-blue-50 to-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-[#007BFF] to-[#00C853] rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-[#64748b]">Currently logged in as:</p>
                {getRoleBadge(user?.role?.name || 'Super-Admin')}
              </div>
              <h3 className="text-lg text-[#1e293b]">{user?.name}</h3>
              <p className="text-xs text-[#64748b]">{user?.email}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#64748b] mb-1">Active Logs</p>
            <p className="text-2xl text-[#007BFF]">{isLoading ? '...' : logsCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
