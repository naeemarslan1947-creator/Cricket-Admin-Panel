import { Shield, AlertCircle, Filter } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface StatsCardsProps {
  totalLogs: number;
  sessionLogs: number;
}

export function StatsCards({ totalLogs, sessionLogs }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-[#e2e8f0] ">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Total Actions Today</p>
              <p className="text-xl text-[#1e293b]">{totalLogs}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#e2e8f0] ">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Session Logs</p>
              <p className="text-xl text-[#1e293b]">{sessionLogs}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#e2e8f0] ">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Active Filters</p>
              <p className="text-xl text-[#1e293b]">0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}