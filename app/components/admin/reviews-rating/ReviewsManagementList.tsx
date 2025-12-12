import { Star, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

interface Review {
  id: number;
  club: string;
  reviewer: string;
  rating: number;
  date: string;
  comment: string;
  type: 'Player' | 'Club Admin' | 'Youth' | 'Parent';
  status: 'Approved' | 'Pending' | 'Rejected';
}

interface ReviewsManagementListProps {
  reviews: Review[];
}

export default function ReviewsManagementList({ reviews }: ReviewsManagementListProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    const colorMap: Record<string, string> = {
      'Player': 'bg-blue-100 text-blue-800',
      'Club Admin': 'bg-purple-100 text-purple-800',
      'Youth': 'bg-green-100 text-green-800',
      'Parent': 'bg-orange-100 text-orange-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="border-[#e2e8f0]">
      <CardHeader>
        <CardTitle className="text-[#1e293b]">Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="p-4 border border-[#e2e8f0] rounded-lg hover: transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-[#1e293b]">{review.club}</h4>
                  {renderStars(review.rating)}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <span>{review.reviewer}</span>
                  <span>•</span>
                  <Badge className={`${getTypeBadgeClass(review.type)} hover:${getTypeBadgeClass(review.type).split(' ')[0]}`}>
                    {review.type}
                  </Badge>
                  <span>•</span>
                  <span>{review.date}</span>
                </div>
              </div>
              <Badge className={`${getStatusBadgeClass(review.status)} hover:${getStatusBadgeClass(review.status).split(' ')[0]}`}>
                {review.status}
              </Badge>
            </div>
            <p className="text-[#64748b] mb-3">{review.comment}</p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-[#00C853] hover:bg-[#00a844] text-white">
                <CheckCircle className="w-3 h-3 mr-1" />
                Approve
              </Button>
              <Button size="sm" variant="destructive">
                <XCircle className="w-3 h-3 mr-1" />
                Remove
              </Button>
              <Button size="sm" variant="outline" className="border-[#e2e8f0]">
                Mark Inappropriate
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}