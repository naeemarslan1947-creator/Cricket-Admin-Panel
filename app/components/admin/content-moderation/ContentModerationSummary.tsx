import { CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

interface SummaryData {
  openReports: number;
  actioned: number;
  removedContent: number;
  warnedUsers: number;
}

interface ContentModerationSummaryProps {
  data: SummaryData;
  isLoading: boolean;
}

export default function ContentModerationSummary({ data, isLoading }: ContentModerationSummaryProps) {
  const summaryItems = [
    { title: 'Open Reports', value: data.openReports.toString(), icon: AlertTriangle, color: 'red' },
    { title: 'Actioned', value: data.actioned.toString(), icon: CheckCircle, color: 'green' },
    { title: 'Removed Content', value: data.removedContent.toString(), icon: XCircle, color: 'amber' },
    { title: 'Warned Users', value: data.warnedUsers.toString(), icon: User, color: 'blue' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => {
        const Icon = item.icon;
        const colorClasses = {
          red: 'bg-red-100 text-red-600',
          green: 'bg-green-100 text-green-600',
          amber: 'bg-amber-100 text-amber-600',
          blue: 'bg-blue-100 text-blue-600',
        };

        return (
          <Card key={index} className="border-[#e2e8f0]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b]">{item.title}</p>
                  <p className="text-2xl text-[#1e293b] mt-1">
                    {isLoading ? '-' : item.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${colorClasses[item.color as keyof typeof colorClasses].split(' ')[0]} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
