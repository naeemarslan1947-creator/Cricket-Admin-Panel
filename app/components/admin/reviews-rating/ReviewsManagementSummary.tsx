import { Star, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';

export default function ReviewsManagementSummary() {
  const summaryItems = [
    { title: 'Total Reviews', value: '1,847', icon: Star, color: 'amber' },
    { title: 'Average Rating', value: '4.6', icon: TrendingUp, color: 'green' },
    { title: 'Pending Approval', value: '23', icon: CheckCircle, color: 'blue' },
    { title: 'This Month', value: '187', icon: Star, color: 'blue' },
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case 'amber': return 'text-amber-400';
      case 'green': return 'text-[#00C853]';
      case 'blue': return 'text-[#007BFF]';
      default: return 'text-[#007BFF]';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {summaryItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card key={index} className="border-[#e2e8f0]">
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