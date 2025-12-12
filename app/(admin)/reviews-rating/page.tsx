"use client";
import { useState } from 'react';
import ReviewsManagementHeader from '@/app/components/admin/reviews-rating/ReviewsManagementHeader';
import ReviewsManagementSummary from '@/app/components/admin/reviews-rating/ReviewsManagementSummary';
import ReviewsManagementTrendChart from '@/app/components/admin/reviews-rating/ReviewsManagementTrendChart';
import ReviewsManagementList from '@/app/components/admin/reviews-rating/ReviewsManagementList';
import ReviewTable from '@/app/components/admin/reviews-rating/ReviewTable';

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

export default function ReviewsManagement() {
  const [timeRange, setTimeRange] = useState<string>('30d');

  const reviews: Review[] = [
    {
      id: 1,
      club: 'Mumbai Cricket Club',
      reviewer: 'Virat Kohli',
      rating: 5,
      date: '2024-11-10',
      comment: 'Excellent facilities and professional coaching staff. Highly recommended!',
      type: 'Player',
      status: 'Approved'
    },
    {
      id: 2,
      club: 'Delhi Sports Academy',
      reviewer: 'Sarah Johnson',
      rating: 4,
      date: '2024-11-12',
      comment: 'Great club with good infrastructure. Could improve scheduling.',
      type: 'Club Admin',
      status: 'Pending'
    },
    {
      id: 3,
      club: 'Chennai Cricket Academy',
      reviewer: 'Ravi Sharma',
      rating: 5,
      date: '2024-11-13',
      comment: 'Outstanding training programs for youth players.',
      type: 'Youth',
      status: 'Approved'
    },
  ];

  const trendData = [
    { date: 'Nov 1', reviews: 12 },
    { date: 'Nov 5', reviews: 18 },
    { date: 'Nov 10', reviews: 25 },
    { date: 'Nov 15', reviews: 22 },
    { date: 'Nov 20', reviews: 30 },
  ];

  return (
    <div className="space-y-6">
      <ReviewsManagementHeader />
      <ReviewsManagementSummary />
      <ReviewsManagementTrendChart 
        timeRange={timeRange} 
        setTimeRange={setTimeRange}
        trendData={trendData}
      />
      <ReviewsManagementList reviews={reviews} />
      <ReviewTable/>
    </div>
  );
}