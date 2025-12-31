"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Skeleton } from '@/app/components/ui/skeleton'

interface AggregateRating {
  name: string;
  isClub: boolean;
  userRatingAvg: string;
  clubRatingAvg: string;
  overallAvg: string;
  totalRatings: number;
}

interface ReviewTableProps {
  aggregateRatings: AggregateRating[];
  isLoading: boolean;
}

const ReviewTable = ({ aggregateRatings, isLoading }: ReviewTableProps) => {
  if (isLoading) {
    return (
      <Card className="border-[#e2e8f0] mt-4">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Aggregate Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Name</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Type</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">User Rating Avg</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Club Rating Avg</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Overall Avg</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Total Ratings</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">
                    <Skeleton className="h-4 w-12" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#e2e8f0] mt-4">
      <CardHeader>
        <CardTitle className="text-[#1e293b]">Aggregate Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        {aggregateRatings.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Name</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Type</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">User Rating Avg</th>
                <th className="px-4 py-2 border-b border-[#e2e8f0] text-left">Club Rating Avg</th>
              </tr>
            </thead>
            <tbody>
              {aggregateRatings.map((rating) => (
                <tr key={rating.name}>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">{rating.name}</td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      rating.isClub 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {rating.isClub ? 'Club' : 'Player'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">{rating.userRatingAvg}</td>
                  <td className="px-4 py-2 border-b border-[#e2e8f0] text-left">{rating.clubRatingAvg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-[#64748b] text-center py-4">No ratings available</p>
        )}
      </CardContent>
    </Card>
  )
}

export default ReviewTable
