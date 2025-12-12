"use client"

import DetailUserTypeChart from '@/app/components/admin/analytics-insights/analytics-detailed/DetailUserTypeChart';
import MostSearchedClubs from '@/app/components/admin/analytics-insights/analytics-detailed/MostSearchedClubs';
import MostViewedPosts from '@/app/components/admin/analytics-insights/analytics-detailed/MostViewedPosts';
import EngagementTrend from '@/app/components/admin/analytics-insights/analytics-overview/EngagementTrend';
import OverViewChart from '@/app/components/admin/analytics-insights/analytics-overview/OverViewChart';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { TrendingUp, Users, Building2, Activity } from 'lucide-react';

import { useState } from 'react';

export default function AnalyticsInsights() {
  const [activeTab, setActiveTab] = useState('overview');

  const userActivityData = [
    { date: 'Nov 1', users: 420, clubs: 45 },
    { date: 'Nov 5', users: 480, clubs: 52 },
    { date: 'Nov 10', users: 550, clubs: 58 },
    { date: 'Nov 15', users: 610, clubs: 65 },
    { date: 'Nov 20', users: 680, clubs: 71 },
  ];

  const audienceData = [
    { name: 'Players', value: 12450, color: '#007BFF' },
    { name: 'Clubs', value: 856, color: '#00C853' },
    { name: 'Visitors', value: 8934, color: '#f59e0b' },
  ];

  const engagementData = [
    { month: 'Jun', engagement: 65 },
    { month: 'Jul', engagement: 72 },
    { month: 'Aug', engagement: 68 },
    { month: 'Sep', engagement: 78 },
    { month: 'Oct', engagement: 85 },
    { month: 'Nov', engagement: 92 },
  ];

  const userTypeData = [
    { name: 'Premium', value: 3420, color: '#9333ea', percentage: '27.5%' },
    { name: 'Free', value: 9030, color: '#64748b', percentage: '72.5%' },
  ];

  const dailySignups = [
    { date: 'Dec 5', signups: 145 },
    { date: 'Dec 4', signups: 132 },
    { date: 'Dec 3', signups: 158 },
    { date: 'Dec 2', signups: 120 },
    { date: 'Dec 1', signups: 167 },
    { date: 'Nov 30', signups: 142 },
    { date: 'Nov 29', signups: 135 },
  ];

  const weeklySignups = [
    { week: 'Week 48', signups: 1050 },
    { week: 'Week 47', signups: 980 },
    { week: 'Week 46', signups: 1120 },
    { week: 'Week 45', signups: 890 },
    { week: 'Week 44', signups: 1200 },
    { week: 'Week 43', signups: 950 },
    { week: 'Week 42', signups: 1080 },
    { week: 'Week 41', signups: 920 },
  ];

  const monthlySignups = [
    { month: 'Nov', signups: 4520 },
    { month: 'Oct', signups: 4180 },
    { month: 'Sep', signups: 3890 },
    { month: 'Aug', signups: 4320 },
    { month: 'Jul', signups: 3650 },
    { month: 'Jun', signups: 3420 },
  ];

  const mostViewedPosts = [
    { id: 1, title: 'Top 10 Cricket Techniques for Beginners', author: 'Virat Kohli', views: 12540, date: 'Nov 28, 2024' },
    { id: 2, title: 'How to Improve Your Bowling Speed', author: 'Jasprit Bumrah', views: 10230, date: 'Nov 25, 2024' },
    { id: 3, title: 'Best Batting Strategies for T20', author: 'Rohit Sharma', views: 9870, date: 'Nov 22, 2024' },
    { id: 4, title: 'Cricket Fitness Training Guide', author: 'MS Dhoni', views: 8450, date: 'Nov 20, 2024' },
    { id: 5, title: 'Wicket Keeping Tips and Tricks', author: 'Rishabh Pant', views: 7820, date: 'Nov 18, 2024' },
  ];

  const mostSearchedClubs = [
    { id: 1, name: 'Mumbai Indians', searches: 8940, location: 'Mumbai, India', members: 2450 },
    { id: 2, name: 'Chennai Super Kings', searches: 8120, location: 'Chennai, India', members: 2280 },
    { id: 3, name: 'Royal Challengers Bangalore', searches: 7850, location: 'Bangalore, India', members: 2190 },
    { id: 4, name: 'Kolkata Knight Riders', searches: 7320, location: 'Kolkata, India', members: 2050 },
    { id: 5, name: 'Delhi Capitals', searches: 6890, location: 'Delhi, India', members: 1920 },
    { id: 6, name: 'Rajasthan Royals', searches: 6120, location: 'Jaipur, India', members: 1780 },
    { id: 7, name: 'Punjab Kings', searches: 5670, location: 'Punjab, India', members: 1650 },
    { id: 8, name: 'Sunrisers Hyderabad', searches: 5340, location: 'Hyderabad, India', members: 1520 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-[#1e293b] mb-1">Analytics & Insights</h1>
        <p className="text-[#64748b]">Track platform performance and user engagement metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-2">Growth Rate</p>
                <p className="text-2xl text-[#1e293b]">+18.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#00C853]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-2">Active Users</p>
                <p className="text-2xl text-[#1e293b]">12,450</p>
              </div>
              <Users className="w-8 h-8 text-[#007BFF]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-2">Retention</p>
                <p className="text-2xl text-[#1e293b]">76.4%</p>
              </div>
              <Activity className="w-8 h-8 text-[#f59e0b]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-2">Club Engagement</p>
                <p className="text-2xl text-[#1e293b]">92%</p>
              </div>
              <Building2 className="w-8 h-8 text-[#00C853]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-8">
          <OverViewChart audienceData={audienceData} userActivityData={userActivityData} />
          <EngagementTrend engagementData={engagementData} />
        </TabsContent>
        <TabsContent value="detailed" className="space-y-8">
         <DetailUserTypeChart userTypeData={userTypeData} monthlySignups={monthlySignups} weeklySignups={weeklySignups} dailySignups={dailySignups} />
         <MostViewedPosts mostViewedPosts={mostViewedPosts} />
         <MostSearchedClubs mostSearchedClubs={mostSearchedClubs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}