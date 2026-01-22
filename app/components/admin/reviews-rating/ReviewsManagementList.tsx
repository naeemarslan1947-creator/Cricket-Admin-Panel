import { XCircle, CheckCircle, Star, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import ReviewActionDialog from './ReviewActionDialog';

type ReviewAction = 'remove' | 'suspend' | 'activate';

interface Review {
  id: number;
  club: string;
  reviewer: string;
  reviewerProfilePic?: string;
  subjectProfilePic?: string;
  date: string;
  comment: string;
  rating?: number;
  hasRating?: boolean;
  isVerified?: boolean;
  subjectIsVerified?: boolean;
  type: 'Player' | 'Club Admin' | 'Youth' | 'Parent';
  status: 'Active' | 'Deleted' | 'Suspended';
  userId?: string;
  reviewerId?: string;
}

interface ReviewsManagementListProps {
  reviews: Review[];
  onStatusChange?: (reviewId: number, newStatus: 'Active' | 'Deleted' | 'Suspended') => void;
}

const PROFILE_PIC_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://api-cricket.dsmeglobal.com';

export default function ReviewsManagementList({ reviews, onStatusChange }: ReviewsManagementListProps) {
  console.log("📢[ReviewsManagementList.tsx:33]: reviews: ", reviews);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ReviewAction>('remove');
  const [selectedReviewId, setSelectedReviewId] = useState<number>(0);
  const [selectedReviewName, setSelectedReviewName] = useState<string>('');

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Deleted': return 'bg-red-100 text-red-800';
      case 'Suspended': return 'bg-amber-100 text-amber-800';
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

  const openActionDialog = (reviewId: number, action: ReviewAction, reviewName: string) => {
    setSelectedReviewId(reviewId);
    setSelectedAction(action);
    setSelectedReviewName(reviewName);
    setDialogOpen(true);
  };

  const renderStars = (rating: number, hasRating: boolean) => {
    if (!hasRating) {
      return (
        <span className="text-sm text-gray-400 italic">No rating</span>
      );
    }
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const getFullProfilePicUrl = (profilePic?: string) => {
    if (!profilePic) return null;
    if (profilePic.startsWith('http://') || profilePic.startsWith('https://')) {
      return profilePic;
    }
    return `${PROFILE_PIC_BASE_URL}${profilePic}`;
  };

  return (
    <>
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews.map((review) => {
            const reviewerProfilePicUrl = getFullProfilePicUrl(review.reviewerProfilePic);
            const subjectProfilePicUrl = getFullProfilePicUrl(review.subjectProfilePic);
            
            return (
              <div key={review.id} className="p-4 border border-[#e2e8f0] rounded-lg hover: transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Subject profile pic */}
                      {subjectProfilePicUrl && (
                        <img
                          src={subjectProfilePicUrl}
                          alt={review.club}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <h4 className="text-[#1e293b] font-medium">{review.club}</h4>
                      {review.subjectIsVerified && (
                        <span title="Verified">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        </span>
                      )}
                      {!review.subjectIsVerified && (
                        <span title="Not Verified">
                          <ShieldAlert className="w-4 h-4 text-gray-400" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#64748b]">
                      {/* Reviewer Profile Pic */}
                      {reviewerProfilePicUrl && (
                        <img
                          src={reviewerProfilePicUrl}
                          alt={review.reviewer}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      )}
                      <span>{review.reviewer}</span>
                      <span>•</span>
                      <Badge className={`${getTypeBadgeClass(review.type)} hover:${getTypeBadgeClass(review.type).split(' ')[0]}`}>
                        {review.type}
                      </Badge>
                      <span>•</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating || 0, review.hasRating || false)}
                    <Badge className={`${getStatusBadgeClass(review.status)} hover:${getStatusBadgeClass(review.status).split(' ')[0]}`}>
                      {review.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-[#64748b] mb-3">{review.comment}</p>
                <div className="flex gap-2">
                  {review.status !== 'Active' && (
                    <Button 
                      size="sm" 
                      className="bg-[#00C853] hover:bg-[#00a844] text-white"
                      onClick={() => openActionDialog(review.id, 'activate', review.club)}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Activate
                    </Button>
                  )}
                  {review.status !== 'Suspended' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-[#e2e8f0]"
                      onClick={() => openActionDialog(review.id, 'suspend', review.club)}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Suspend
                    </Button>
                  )}
                  {review.status !== 'Deleted' && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => openActionDialog(review.id, 'remove', review.club)}
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <ReviewActionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        reviewId={selectedReviewId}
        action={selectedAction}
        reviewName={selectedReviewName}
        onSuccess={onStatusChange}
      />
    </>
  );
}

