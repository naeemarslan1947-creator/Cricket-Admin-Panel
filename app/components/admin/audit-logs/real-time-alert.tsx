import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface RealTimeAlertProps {
  activityLogsCount: number;
}

export function RealTimeAlert({ activityLogsCount }: RealTimeAlertProps) {
  if (activityLogsCount === 0) return null;

  return (
    <Card className="border-[#00C853] bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#00C853] mt-0.5" />
          <div>
            <h4 className="text-sm text-[#1e293b] mb-1">Real-time Activity Tracking Enabled</h4>
            <p className="text-xs text-[#64748b]">
              All your actions are being logged automatically. Your session has generated {activityLogsCount} log{activityLogsCount !== 1 ? 's' : ''} so far.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}