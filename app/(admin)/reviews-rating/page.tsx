"use client";
import { useState, useEffect } from 'react';
import ReviewsManagementHeader from '@/app/components/admin/reviews-rating/ReviewsManagementHeader';
import ReviewsManagementSummary from '@/app/components/admin/reviews-rating/ReviewsManagementSummary';
import ReviewsManagementTrendChart from '@/app/components/admin/reviews-rating/ReviewsManagementTrendChart';
import ReviewsManagementList from '@/app/components/admin/reviews-rating/ReviewsManagementList';
import ReviewTable from '@/app/components/admin/reviews-rating/ReviewTable';
import makeRequest from "@/Api's/apiHelper";
import { GetReviewMetrics } from "@/Api's/repo";
import Loader from '@/app/components/common/Loader';

interface ReviewItem {
  _id: string;
  user_id: {
    _id: string;
    user_name: string;
    full_name: string;
    is_club: boolean;
    club_name?: string;
  };
  review: string;
  action_type: number;
  is_verified: boolean;
  created_by: {
    _id: string;
    user_name: string;
    full_name: string;
    is_club: boolean;
  };
  updated_at: string;
  created_at: string;
}

interface RatingItem {
  rating: string;
  rating_type: string;
  user_id: {
    _id: string;
    user_name: string;
    full_name: string;
    is_club: boolean;
    club_name?: string;
  };
}

interface TrendItem {
  count: number;
  date: string;
}

interface SummaryData {
  reviewCount: number;
  averageRating: number;
  reviewedUserCount: number;
  currentMonthReviewCount: number;
}

interface ReviewMetricsResult {
  reviewCount: number;
  reviewedUserCount: number;
  trend: TrendItem[];
  allReviews: ReviewItem[];
  allRatings: RatingItem[];
}
interface ApiResponse {
  response_code: number;
  success: boolean;
  result: ReviewMetricsResult;
}

const mapApiReviewToReview = (apiReview: ReviewItem) => {
  const createdDate = new Date(apiReview.created_at);
  const formattedDate = createdDate.toISOString().split('T')[0];

  let status: 'Active' | 'Deleted' | 'Suspended';
  if (apiReview.action_type === 3) {
    status = 'Deleted';
  } else if (apiReview.action_type === 4) {
    status = 'Suspended';
  } else {
    status = 'Active';
  }

  return {
    id: apiReview._id as unknown as number,
    club: apiReview?.user_id?.is_club === true 
      ? (apiReview.user_id.club_name || apiReview.user_id.full_name || 'Unknown')
      : (apiReview.user_id.full_name || 'Unknown'),
    reviewer: apiReview.user_id.full_name || apiReview.user_id.user_name || 'Unknown',
    date: formattedDate,
    comment: apiReview.review,
    type: 'Player' as const,
    status,
  };
};

const calculateAggregateRatings = (allRatings: RatingItem[]) => {
  const clubStats: { [key: string]: { userRating: number[], clubRating: number[], count: number, isClub: boolean } } = {};

  allRatings.forEach(rating => {
    const displayName = rating.user_id.is_club
      ? rating.user_id.club_name || 'Unknown Club'
      : rating.user_id.full_name || rating.user_id.user_name || 'Unknown';

    if (!clubStats[displayName]) {
      clubStats[displayName] = { userRating: [], clubRating: [], count: 0, isClub: rating.user_id.is_club };
    }
    clubStats[displayName].count++;

    if (rating.rating_type === 'userRating' && parseInt(rating.rating) > 0) {
      clubStats[displayName].userRating.push(parseInt(rating.rating));
    }
    if (rating.rating_type === 'clubRating' && parseInt(rating.rating) > 0) {
      clubStats[displayName].clubRating.push(parseInt(rating.rating));
    }
  });

  const aggregates = Object.entries(clubStats).map(([club, stats]) => {
    const userRatingAvg = stats.userRating.length > 0
      ? stats.userRating.reduce((a, b) => a + b, 0) / stats.userRating.length
      : 0;
    const clubRatingAvg = stats.clubRating.length > 0
      ? stats.clubRating.reduce((a, b) => a + b, 0) / stats.clubRating.length
      : 0;
    const overallAvg = [...stats.userRating, ...stats.clubRating].length > 0
      ? [...stats.userRating, ...stats.clubRating].reduce((a, b) => a + b, 0) / [...stats.userRating, ...stats.clubRating].length
      : 0;

    return {
      name: club,
      isClub: stats.isClub,
      userRatingAvg: userRatingAvg.toFixed(1),
      clubRatingAvg: clubRatingAvg.toFixed(1),
      overallAvg: overallAvg.toFixed(1),
      totalRatings: stats.count,
    };
  });

  return aggregates;
};

interface AggregateRating {
  name: string;
  isClub: boolean;
  userRatingAvg: string;
  clubRatingAvg: string;
  overallAvg: string;
  totalRatings: number;
}

export default function ReviewsManagement() {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [summaryData, setSummaryData] = useState<SummaryData>({
    reviewCount: 0,
    averageRating: 0,
    reviewedUserCount: 0,
    currentMonthReviewCount: 0,
  });
  const [trendData, setTrendData] = useState<{ date: string; reviews: number }[]>([]);
  const [reviews, setReviews] = useState<{
    id: number;
    club: string;
    reviewer: string;
    date: string;
    comment: string;
    type: 'Player' | 'Club Admin' | 'Youth' | 'Parent';
    status: 'Active' | 'Deleted' | 'Suspended';
  }[]>([]);
  const [aggregateRatings, setAggregateRatings] = useState<AggregateRating[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchReviewMetrics = async () => {
    setIsLoading(true);
    try {
      const response = await makeRequest<ApiResponse>({
        url: GetReviewMetrics,
        method: 'GET',
      });

      if (response?.data?.result) {
        const { reviewCount, reviewedUserCount, allRatings, trend, allReviews } = response.data.result;

        let averageRating = 0;
        if (allRatings && allRatings.length > 0) {
          const totalRating = allRatings.reduce((sum: number, item: RatingItem) => {
            return sum + parseInt(item.rating, 10);
          }, 0);
          averageRating = totalRating / allRatings.length;
        }

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthReviewCount = allReviews?.filter((review) => {
          const reviewDate = new Date(review.created_at);
          return reviewDate.getMonth() === currentMonth && reviewDate.getFullYear() === currentYear;
        }).length || 0;

        const mappedTrendData = trend?.map((item) => {
          const dateObj = new Date(item.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          });
          return {
            date: formattedDate,
            reviews: item.count,
          };
        }) || [];

        const mappedReviews = allReviews?.map((review) => 
          mapApiReviewToReview(review)
        ) || [];

        setSummaryData({
          reviewCount: reviewCount || 0,
          averageRating: averageRating || 0,
          reviewedUserCount: reviewedUserCount || 0,
          currentMonthReviewCount,
        });
        
        setTrendData(mappedTrendData);
        setReviews(mappedReviews);
        setAggregateRatings(calculateAggregateRatings(allRatings));
      }
    } catch (error) {
      console.error('GetReviewMetrics Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewMetrics();
  }, []);

  const handleStatusChange = async (reviewId: number, newStatus: 'Active' | 'Deleted' | 'Suspended') => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );
    await fetchReviewMetrics();
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="space-y-6">
      <ReviewsManagementHeader />
      <ReviewsManagementSummary summaryData={summaryData} isLoading={isLoading} />
      <ReviewsManagementTrendChart 
        timeRange={timeRange} 
        setTimeRange={setTimeRange}
        trendData={trendData}
      />
      <ReviewsManagementList reviews={reviews} onStatusChange={handleStatusChange} />
      <ReviewTable aggregateRatings={aggregateRatings} isLoading={isLoading} />
    </div>
  );
}
