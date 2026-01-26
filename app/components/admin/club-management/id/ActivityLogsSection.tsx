import { Activity } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import type { UserLog } from '@/app/types/clubs';

interface ActivityLogsProps {
  logs: UserLog[];
}

const getMethodColor = (method: string) => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'POST':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'PUT':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'DELETE':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getStatusColor = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) {
    return 'text-green-600';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'text-amber-600';
  } else if (statusCode >= 500) {
    return 'text-red-600';
  }
  return 'text-slate-600';
};

export default function ActivityLogsSection({ logs }: ActivityLogsProps) {
  const displayLogs = logs && logs.length > 0 ? logs.slice(0, 10) : [];

  return (
    <Card className="border-slate-200 overflow-hidden">
      <div className="px-6 py-5 bg-linear-to-br from-purple-50 to-white border-b border-purple-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              Activity Logs
            </h3>
            <p className="text-sm text-[#64748b] mt-1">
              {displayLogs.length} of {logs?.length || 0} log{logs?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
      <CardContent className="p-0">
        {displayLogs.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            No activity logs yet
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {displayLogs.map((log) => (
              <div key={log._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        className={`border ${getMethodColor(log.details.request.method)}`}
                      >
                        {log.details.request.method}
                      </Badge>
                      <span className="text-sm font-medium text-[#0f172a] truncate">
                        {log.details.request.path}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#64748b]">
                      <span className={`font-semibold ${getStatusColor(log.response_status)}`}>
                        {log.response_status}
                      </span>
                      <span>•</span>
                      <span>{log.details.response.duration_ms}ms</span>
                      <span>•</span>
                      <span>{new Date(log.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
