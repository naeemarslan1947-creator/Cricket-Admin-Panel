import { Star, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Skeleton } from '@/app/components/ui/skeleton';

interface SummaryData {
  reviewCount: number;
  averageRating: number;
  reviewedUserCount: number;
  currentMonthReviewCount: number;
}

interface ReviewsManagementSummaryProps {
  summaryData: SummaryData;
  isLoading?: boolean;
}

export default function ReviewsManagementSummary({ summaryData, isLoading = false }: ReviewsManagementSummaryProps) {

  const summaryItems = [
    { title: 'Total Reviews', value: summaryData.reviewCount, icon: Star, color: 'amber' },
    { title: 'Average Rating', value: summaryData.averageRating, icon: TrendingUp, color: 'green' },
    { title: 'Reviewed Users', value: summaryData.reviewedUserCount, icon: CheckCircle, color: 'blue' },
    { title: 'This Month', value: summaryData.currentMonthReviewCount, icon: Star, color: 'blue' },
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case 'amber': return 'text-amber-400';
      case 'green': return 'text-[#00C853]';
      case 'blue': return 'text-[#007BFF]';
      default: return 'text-[#007BFF]';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="border-[#e2e8f0]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

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
                  <p className="text-2xl text-[#1e293b] mt-1">
                    {item.title === 'Average Rating' ? item.value.toFixed(1) : item.value}
                  </p>
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
