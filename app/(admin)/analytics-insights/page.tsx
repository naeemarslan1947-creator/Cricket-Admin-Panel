"use client"

import DetailUserTypeChart from '@/app/components/admin/analytics-insights/analytics-detailed/DetailUserTypeChart';
import MostFollowedClubs from '@/app/components/admin/analytics-insights/analytics-detailed/MostFollowedClubs';
import MostLikedPosts from '@/app/components/admin/analytics-insights/analytics-detailed/MostLikedPosts';
import EngagementTrend from '@/app/components/admin/analytics-insights/analytics-overview/EngagementTrend';
import OverViewChart from '@/app/components/admin/analytics-insights/analytics-overview/OverViewChart';
import { Card, CardContent } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { TrendingUp, Users, Building2, Activity } from 'lucide-react';

import { useState, useEffect, useCallback, useRef } from 'react';
import makeRequest from "@/Api's/apiHelper";
import { GetAnalyticsDashboard } from "@/Api's/repo";
import Loader from '@/app/components/common/Loader';

type AudienceItem = {
  name: string;
  value: number;
  color: string;
};

type UserActivityItem = {
  date: string;
  users: number;
  clubs: number;
};

type EngagementItem = {
  month: string;
  engagement: number;
};

type GrowthRateData = {
  growth_rate: string;
  active_users: number;
  retentions: number;
  club_enagagement: number;
  user_activity_trends: Array<{ month: string; year: number; users: number }>;
};

type PieGraphData = {
  clubs: number;
  players: number;
  teams: number;
};

type EngagementTrendItem = {
  month: string;
  count: number;
};

type UserTypeItem = {
  name: string;
  value: number;
  percentage: string;
  color: string;
};

type DailySignup = {
  date: string;
  signups: number;
};

type WeeklySignup = {
  week: string;
  signups: number;
};

type MonthlySignup = {
  month: string;
  signups: number;
};

type LikedPost = {
  id: string | number;
  title: string;
  author: string;
  likes: number;
  date: string;
};

type FollowedClub = {
  id: number;
  name: string;
  owner: string;
  followers: number;
};

type PremiumVsFreeGraph = {
  premium: number;
  free: number;
};

type UserSignupTrends = {
  last_seven_days: number[];
  last_seven_weeks: number[];
  last_seven_months: number[];
};

type MostLikedPost = {
  _id: string;
  caption: string;
  user_id: {
    _id: string;
    user_name: string;
    full_name: string;
    profile_pic: string;
  };
  likeCount: number;
  created_at: string;
};

type MostFollowedClub = {
  _id: string;
  name: string;
  user_id: {
    _id: string;
    user_name: string;
    full_name: string;
  };
};

type AnalyticsAPIResponse = {
  growth_rate: GrowthRateData;
  pie_graph: PieGraphData;
  engagement_trends: EngagementTrendItem[];
  premium_vs_free_graph: PremiumVsFreeGraph;
  user_signup_trends: UserSignupTrends;
  most_liked_posts: MostLikedPost[];
  most_followed_clubs: MostFollowedClub[];
};

export default function AnalyticsInsights() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
    const fetchedTabsRef = useRef<Set<string>>(new Set());
  const [audienceData, setAudienceData] = useState<AudienceItem[]>([]);
  const [userActivityData, setUserActivityData] = useState<UserActivityItem[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementItem[]>([]);
  const [growthRate, setGrowthRate] = useState<string>('0%');
  const [activeUsers, setActiveUsers] = useState<string>('0');
  const [retention, setRetention] = useState<string>('0%');
  const [clubEngagement, setClubEngagement] = useState<string>('0%');
  const [userTypeData, setUserTypeData] = useState<UserTypeItem[]>([]);
  const [dailySignups, setDailySignups] = useState<DailySignup[]>([]);
  const [weeklySignups, setWeeklySignups] = useState<WeeklySignup[]>([]);
  const [monthlySignups, setMonthlySignups] = useState<MonthlySignup[]>([]);
  const [mostViewedPosts, setMostViewedPosts] = useState<LikedPost[]>([]);
  const [mostSearchedClubs, setMostSearchedClubs] = useState<FollowedClub[]>([]);

  const transformData = useCallback((data: AnalyticsAPIResponse) => {
    if (data.growth_rate) {
      setGrowthRate(`+${data.growth_rate.growth_rate}%`);
      setActiveUsers(data.growth_rate.active_users.toString());
      setRetention(`${data.growth_rate.retentions}%`);
      setClubEngagement(`${data.growth_rate.club_enagagement}%`);

      if (data.growth_rate.user_activity_trends) {
        const trends = data.growth_rate.user_activity_trends.map((item) => ({
          date: `${item.month} ${item.year}`,
          users: item.users,
          clubs: 0, // API doesn't provide club data, default to 0
        }));
        setUserActivityData(trends);
      }
    }

    if (data.pie_graph) {
      const pieData: AudienceItem[] = [];
      if (data.pie_graph.players > 0) {
        pieData.push({ name: 'Players', value: data.pie_graph.players, color: '#007BFF' });
      }
      if (data.pie_graph.clubs > 0) {
        pieData.push({ name: 'Clubs', value: data.pie_graph.clubs, color: '#00C853' });
      }
      if (data.pie_graph.teams > 0) {
        pieData.push({ name: 'Teams', value: data.pie_graph.teams, color: '#f59e0b' });
      }
      if (pieData.length > 0) {
        setAudienceData(pieData);
      }
    }

    if (data.engagement_trends) {
      const engagement = data.engagement_trends.map((item) => ({
        month: item.month,
        engagement: item.count,
      }));
      setEngagementData(engagement);
    }

    if (data.premium_vs_free_graph) {
      const { premium, free } = data.premium_vs_free_graph;
      const total = premium + free;
      const premiumPercentage = total > 0 ? ((premium / total) * 100).toFixed(1) : '0';
      const freePercentage = total > 0 ? ((free / total) * 100).toFixed(1) : '0';
      
      setUserTypeData([
        { name: 'Premium', value: premium, color: '#9333ea', percentage: `${premiumPercentage}%` },
        { name: 'Free', value: free, color: '#64748b', percentage: `${freePercentage}%` },
      ]);
    }

    if (data.user_signup_trends) {
      const { last_seven_days, last_seven_weeks, last_seven_months } = data.user_signup_trends;
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      setDailySignups(last_seven_days.map((count, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - index));
        return {
          date: days[date.getDay()],
          signups: count,
        };
      }));
      
      setWeeklySignups(last_seven_weeks.slice().reverse().map((count, index) => ({
        week: `Week ${index + 1}`,
        signups: count,
      })));
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      setMonthlySignups(last_seven_months.map((count, index) => {
        const monthIndex = (currentMonth - (6 - index) + 12) % 12;
        return {
          month: months[monthIndex],
          signups: count,
        };
      }));
    }

if (data.most_liked_posts && data.most_liked_posts.length > 0) {
      const posts: LikedPost[] = data.most_liked_posts.map((post) => ({
        id: post._id,
        title: post.caption || 'Untitled Post',
        author: post.user_id?.full_name || post.user_id?.user_name || 'Unknown',
        likes: post.likeCount,
        date: new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }));
      setMostViewedPosts(posts);
    }

    if (data.most_followed_clubs && data.most_followed_clubs.length > 0) {
      const clubs: FollowedClub[] = data.most_followed_clubs.map((club, index) => ({
        id: index + 1,
        name: club.name,
        owner: club.user_id?.full_name || club.user_id?.user_name || 'Unknown',
        followers: 0, 
      }));
      setMostSearchedClubs(clubs);
    }
  }, []);

  const fetchAnalyticsData = useCallback(async () => {
    // Skip if this tab has already been fetched
    if (fetchedTabsRef.current.has(activeTab)) {
      return;
    }
    
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await makeRequest<any>({
        url: GetAnalyticsDashboard,
        method: "GET",
        params: { view: activeTab },
      });
      
      console.log('Analytics response:', response);
      
      if (response?.data?.result) {
        const data = response.data.result as AnalyticsAPIResponse;
        transformData(data);
        fetchedTabsRef.current.add(activeTab);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, transformData]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-[#1e293b] mb-1">Analytics & Insights</h1>
        <p className="text-[#64748b]">Track platform performance and user engagement metrics</p>
      </div>

      {isLoading ? (
       <Loader/>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-[#e2e8f0]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#64748b] mb-2">Growth Rate</p>
                    <p className="text-2xl text-[#1e293b]">{growthRate}</p>
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
                    <p className="text-2xl text-[#1e293b]">{parseInt(activeUsers).toLocaleString()}</p>
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
                    <p className="text-2xl text-[#1e293b]">{retention}</p>
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
                    <p className="text-2xl text-[#1e293b]">{clubEngagement}</p>
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
              <DetailUserTypeChart 
                userTypeData={userTypeData} 
                monthlySignups={monthlySignups} 
                weeklySignups={weeklySignups} 
                dailySignups={dailySignups} 
              />
<MostLikedPosts mostLikedPosts={mostViewedPosts} />
              <MostFollowedClubs mostFollowedClubs={mostSearchedClubs} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

