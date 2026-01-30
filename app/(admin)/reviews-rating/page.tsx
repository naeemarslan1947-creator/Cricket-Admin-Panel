"use client";
import { useState, useEffect } from 'react';
import ReviewsManagementHeader from '@/app/components/admin/reviews-rating/ReviewsManagementHeader';
import ReviewsManagementSummary from '@/app/components/admin/reviews-rating/ReviewsManagementSummary';
import ReviewsManagementTrendChart from '@/app/components/admin/reviews-rating/ReviewsManagementTrendChart';
import ReviewsManagementList from '@/app/components/admin/reviews-rating/ReviewsManagementList';
import makeRequest from "@/Api's/apiHelper";
import { GetReviewMetrics } from "@/Api's/repo";
import Loader from '@/app/components/common/Loader';

interface ReviewItem {
  _id: string;
  user_id: {
    _id: string;
    user_name: string;
    email: string;
    full_name: string;
    is_club: boolean;
    club_name?: string;
    profile_pic?: string;
    is_verified?: boolean;
  } | null;
  review: string;
  action_type: number;
  is_verified: boolean;
  created_by: {
    _id: string;
    user_name: string;
    email: string;
    full_name: string;
    is_club: boolean;
    profile_pic?: string;
  } | null;
  updated_at: string;
  created_at?: string; // Made optional since it might be missing
  rating: string | number;
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
  // Handle missing created_at - use updated_at as fallback
  const dateToUse = apiReview.created_at || apiReview.updated_at;
  const createdDate = new Date(dateToUse);
  const formattedDate = createdDate.toISOString().split('T')[0];

  let status: 'Active' | 'Deleted' | 'Suspended';
  if (apiReview.action_type === 3) {
    status = 'Deleted';
  } else if (apiReview.action_type === 4) {
    status = 'Suspended';
  } else {
    status = 'Active';
  }

  const reviewerType = apiReview.created_by?.is_club 
    ? 'Club Admin' as const 
    : 'Player' as const;

  // Handle null user_id
  let reviewedSubject = 'Unknown Subject';
  if (apiReview.user_id) {
    reviewedSubject = apiReview.user_id.is_club === true
      ? (apiReview.user_id.club_name || apiReview.user_id.full_name || 'Unknown Club')
      : (apiReview.user_id.full_name || 'Unknown Player');
  }

  const reviewer = apiReview.created_by?.full_name || apiReview.created_by?.user_name || 'Unknown Reviewer';

  const reviewerProfilePic = apiReview.created_by?.profile_pic || '';
  const subjectProfilePic = apiReview.user_id?.profile_pic || '';
  const subjectIsVerified = apiReview.user_id?.is_verified || false;

  // Parse rating - handle both string and number
  // rating "0" or 0 means no rating set, positive values are actual ratings
  const ratingValue = typeof apiReview.rating === 'string' 
    ? parseInt(apiReview.rating, 10) 
    : apiReview.rating;
  const hasRating = ratingValue > 0;

  return {
    id: apiReview._id as unknown as number,
    club: reviewedSubject,
    reviewer: reviewer,
    reviewerProfilePic: reviewerProfilePic,
    subjectProfilePic: subjectProfilePic,
    date: formattedDate,
    comment: apiReview.review,
    rating: ratingValue,
    hasRating: hasRating,
    isVerified: apiReview.is_verified,
    subjectIsVerified: subjectIsVerified,
    type: reviewerType,
    status,
    userId: apiReview.user_id?._id || '',
    reviewerId: apiReview.created_by?._id || '',
  };
};

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
    reviewerProfilePic: string;
    subjectProfilePic: string;
    date: string;
    comment: string;
    rating: number;
    hasRating: boolean;
    isVerified: boolean;
    subjectIsVerified: boolean;
    type: 'Player' | 'Club Admin' | 'Youth' | 'Parent';
    status: 'Active' | 'Deleted' | 'Suspended';
    userId: string;
    reviewerId: string;
  }[]>([]);
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
        
        console.log('API Response:', response.data.result); // For debugging
        
        let totalRatings = 0;
        let ratingCount = 0;

        // Process ratings from allRatings array
        if (allRatings && allRatings.length > 0) {
          allRatings.forEach((item: RatingItem) => {
            const rating = parseInt(item.rating, 10);
            if (!isNaN(rating) && rating > 0) {
              totalRatings += rating;
              ratingCount++;
            }
          });
        }

        // Process ratings from allReviews array
        if (allReviews && allReviews.length > 0) {
          allReviews.forEach((review: ReviewItem) => {
            const ratingValue = typeof review.rating === 'string' 
              ? parseInt(review.rating, 10) 
              : review.rating;
            if (!isNaN(ratingValue) && ratingValue > 0) {
              totalRatings += ratingValue;
              ratingCount++;
            }
          });
        }

        const averageRating = ratingCount > 0 ? totalRatings / ratingCount : 0;

        // Calculate current month reviews
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const currentMonthReviewCount = allReviews?.filter((review) => {
          const dateToUse = review.created_at || review.updated_at;
          const reviewDate = new Date(dateToUse);
          return reviewDate.getMonth() === currentMonth && reviewDate.getFullYear() === currentYear;
        }).length || 0;

        // Map trend data
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

        // Map reviews data
        const mappedReviews = allReviews?.map((review) => 
          mapApiReviewToReview(review)
        ) || [];

        setSummaryData({
          reviewCount: reviewCount || 0,
          averageRating: parseFloat(averageRating.toFixed(1)), // Round to 1 decimal place
          reviewedUserCount: reviewedUserCount || 0,
          currentMonthReviewCount,
        });
        
        setTrendData(mappedTrendData);
        setReviews(mappedReviews);
        
        console.log('Mapped Reviews:', mappedReviews); // For debugging
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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <ReviewsManagementHeader />
      <ReviewsManagementSummary summaryData={summaryData} isLoading={isLoading} />
      <ReviewsManagementTrendChart 
        timeRange={timeRange} 
        setTimeRange={setTimeRange}
        trendData={trendData}
      />
      <ReviewsManagementList reviews={reviews} onStatusChange={handleStatusChange} />
    </div>
  );
}