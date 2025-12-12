import { AlertTriangle, MessageSquare, UserX, Flag } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

export default function ReportsAbuseSummary() {
  const summaryItems = [
    { title: 'Open Reports', value: '23', icon: AlertTriangle, color: 'red' },
    { title: 'Bullying', value: '8', icon: MessageSquare, color: 'amber' },
    { title: 'Impersonation', value: '5', icon: UserX, color: 'blue' },
    { title: 'Spam', value: '10', icon: Flag, color: 'green' },
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600';
      case 'amber': return 'text-amber-600';
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="border-[#e2e8f0] ">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b]">{item.title}</p>
                  <p className="text-2xl text-[#1e293b] mt-1">{item.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${getIconColor(item.color)}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}