"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'

const ReviewTable = () => {
     const [allReviews, setAllReviews] = useState([
    {
      id: 1,
      club: 'Lords Cricket Club',
      reviewer: 'James Anderson',
      rating: 5,
      date: '2024-11-10',
      comment: 'Excellent facilities and professional coaching staff. Highly recommended!',
      reviewType: 'Facilities',
      status: 'Approved',
      facilitiesRating: 5,
      sportsmanshipRating: 0
    },
    {
      id: 2,
      club: 'Yorkshire Cricket Academy',
      reviewer: 'Joe Root',
      rating: 4,
      date: '2024-11-12',
      comment: 'Great club with good infrastructure. Could improve scheduling.',
      reviewType: 'Facilities',
      status: 'Pending',
      facilitiesRating: 4,
      sportsmanshipRating: 0
    },
    {
      id: 3,
      club: 'Surrey County Cricket',
      reviewer: 'Ben Stokes',
      rating: 5,
      date: '2024-11-13',
      comment: 'Outstanding training programs for youth players.',
      reviewType: 'Facilities',
      status: 'Approved',
      facilitiesRating: 5,
      sportsmanshipRating: 0
    },
    {
      id: 4,
      club: 'Lords Cricket Club',
      reviewer: 'Stuart Broad',
      rating: 4,
      date: '2024-11-14',
      comment: 'Players showed excellent sportsmanship during matches.',
      reviewType: 'Sportsmanship',
      status: 'Approved',
      facilitiesRating: 0,
      sportsmanshipRating: 4
    },
    {
      id: 5,
      club: 'Yorkshire Cricket Academy',
      reviewer: 'Jonny Bairstow',
      rating: 5,
      date: '2024-11-15',
      comment: 'Very respectful and professional behavior from all players.',
      reviewType: 'Sportsmanship',
      status: 'Approved',
      facilitiesRating: 0,
      sportsmanshipRating: 5
    },
    {
      id: 6,
      club: 'Surrey County Cricket',
      reviewer: 'Chris Woakes',
      rating: 3,
      date: '2024-11-16',
      comment: 'Good facilities but maintenance could be better.',
      reviewType: 'Facilities',
      status: 'Pending',
      facilitiesRating: 3,
      sportsmanshipRating: 0
    },
  ]);

  // Calculate aggregate ratings for each club
  const calculateAggregateRatings = () => {
    const clubStats: { [key: string]: { facilities: number[], sportsmanship: number[], totalReviews: number } } = {};

    allReviews.forEach(review => {
      if (!clubStats[review.club]) {
        clubStats[review.club] = { facilities: [], sportsmanship: [], totalReviews: 0 };
      }
      clubStats[review.club].totalReviews++;
      if (review.reviewType === 'Facilities' && review.facilitiesRating > 0) {
        clubStats[review.club].facilities.push(review.facilitiesRating);
      }
      if (review.reviewType === 'Sportsmanship' && review.sportsmanshipRating > 0) {
        clubStats[review.club].sportsmanship.push(review.sportsmanshipRating);
      }
    });

    const aggregates = Object.entries(clubStats).map(([club, stats]) => {
      const facilitiesAvg = stats.facilities.length > 0
        ? stats.facilities.reduce((a, b) => a + b, 0) / stats.facilities.length
        : 0;
      const sportsmanshipAvg = stats.sportsmanship.length > 0
        ? stats.sportsmanship.reduce((a, b) => a + b, 0) / stats.sportsmanship.length
        : 0;
      const overallAvg = [...stats.facilities, ...stats.sportsmanship].length > 0
        ? [...stats.facilities, ...stats.sportsmanship].reduce((a, b) => a + b, 0) / [...stats.facilities, ...stats.sportsmanship].length
        : 0;

      return {
        club,
        facilitiesAvg: facilitiesAvg.toFixed(1),
        sportsmanshipAvg: sportsmanshipAvg.toFixed(1),
        overallAvg: overallAvg.toFixed(1),
        facilitiesCount: stats.facilities.length,
        sportsmanshipCount: stats.sportsmanship.length,
        totalReviews: stats.totalReviews,
        facilitiesTotal: stats.facilities.reduce((a, b) => a + b, 0),
        sportsmanshipTotal: stats.sportsmanship.reduce((a, b) => a + b, 0)
      };
    });

    return aggregates;
  };

  const aggregateRatings = calculateAggregateRatings();

  return (
 <Card className="border-[#e2e8f0]  mt-4">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Aggregate Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Club</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Facilities Avg</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Sportsmanship Avg</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Overall Avg</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Total Reviews</th>
              </tr>
            </thead>
            <tbody>
              {aggregateRatings.map((rating) => (
                <tr key={rating.club}>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">{rating.club}</td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">{rating.facilitiesAvg}</td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">{rating.sportsmanshipAvg}</td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">{rating.overallAvg}</td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">{rating.totalReviews}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>  )
}

export default ReviewTable