import { Star, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';
import type { UserRating, UserReview } from '@/app/types/clubs';

interface ReviewsRatingsSectionProps {
  ratings: UserRating[];
  reviews: UserReview[];
}

export default function ReviewsRatingsSection({
  ratings,
  reviews,
}: ReviewsRatingsSectionProps) {
  const displayRatings = ratings && ratings.length > 0 ? ratings.slice(0, 5) : [];
  const displayReviews = reviews && reviews.length > 0 ? reviews.slice(0, 5) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ratings Card */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="px-6 py-5 bg-linear-to-br from-amber-50 to-white border-b border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Ratings
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                {displayRatings.length} rating{displayRatings.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          {displayRatings.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No ratings yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rating</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayRatings.map((rating) => (
                  <TableRow key={rating._id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < parseInt(String(rating.rating))
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-medium text-[#0f172a]">
                          {rating.rating}/5
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200 border">
                        {rating.rating_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-[#64748b]">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Reviews Card */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="px-6 py-5 bg-linear-to-br from-blue-50 to-white border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Reviews
              </h3>
              <p className="text-sm text-[#64748b] mt-1">
                {displayReviews.length} review{displayReviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          {displayReviews.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No reviews yet
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {displayReviews.map((review) => (
                <div key={review._id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < parseInt(String(review.rating))
                              ? 'fill-blue-500 text-blue-500'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-[#64748b]">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {review.review && (
                    <p className="text-sm text-[#0f172a] line-clamp-2">
                      {review.review}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
