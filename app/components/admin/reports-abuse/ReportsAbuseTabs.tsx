"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import BullyingReports from './BullyingReports';
import InappropriateContentReports from './InappropriateContentReports';
import ImpersonationReports from './ImpersonationReports';
import SpamReports from './SpamReports';
import makeRequest from "@/Api's/apiHelper";
import { GetReportedMedia } from "@/Api's/repo";
import { useState, useEffect, useCallback } from 'react';
import { Loader2, FileWarning } from 'lucide-react';

interface ReporterInfo {
  _id: string;
  user_name: string;
  email: string;
}

      // User type structure (for bullying, impersonation, spam reports)
interface ReportedUserInfo {
  _id: string;
  user_name: string;
  email: string;
  full_name?: string;
  profile_pic?: string;
  bio?: string;
  geo_location?: string;
  about_me?: string;
  date_of_birth?: string;
  last_active?: string;
  is_user_verified?: boolean;
  is_club?: boolean;
  is_club_verified?: boolean;
  stats_link?: string;
  media_type?: string;
  action_type: number;
  updated_at: string;
  created_at: string;
}

// Post type structure
interface ReportedMediaInfo {
  _id: string;
  media?: string[];
  caption?: string;
  comment?: string;
  user_id?: string;
  comment_by?: string;
  reported_by?: string;
  reported_to?: string;
  media_type?: string;
  action_type: number;
  updated_at: string;
  created_at: string;
}

interface ApiReportItem {
  _id: string;
  reported_media_id: ReportedUserInfo | ReportedMediaInfo;
  reported_media_type: string;
  reason: string;
  detail: string;
  created_by: ReporterInfo;
  action_type: number;
  escalation?: number;
  updated_at: string;
  created_at: string;
}

interface ApiResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  total_records: number;
  page_number: number;
  total_pages: number;
  message: string;
  error_message: null;
  token: null;
  result: ApiReportItem[];
}

interface Report {
  id: string | number;
  reporterName: string;
  reporterEmail?: string;
  reportedUser: string;
  reportedUserFullName?: string;
  reportedUserProfilePic?: string;
  reportedUserBio?: string;
  reportedUserLocation?: string;
  reportedUserAbout?: string;
  reportedUserVerified?: boolean;
  reportedUserLastActive?: string;
  description: string;
  timestamp: string;
  reasonCode: string;
  status: 'active' | 'suspended' | 'deleted';
  mediaUrls?: string[];
  mediaType?: 'image' | 'video' | null;
  escalation?: number;
}

interface ReportsData {
  bullying: Report[];
  inappropriate: Report[];
  impersonation: Report[];
  spam: Report[];
}

interface ReportsAbuseTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

interface LoadingState {
  bullying: boolean;
  inappropriate: boolean;
  impersonation: boolean;
  spam: boolean;
}

export default function ReportsAbuseTabs({ activeTab, setActiveTab }: ReportsAbuseTabsProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';



  const [reports, setReports] = useState<ReportsData>({
    bullying: [],
    inappropriate: [],
    impersonation: [],
    spam: [],
  });
  const [cachedTabs, setCachedTabs] = useState<Set<string>>(new Set());
  const [loadingState, setLoadingState] = useState<LoadingState>({
    bullying: false,
    inappropriate: false,
    impersonation: false,
    spam: false,
  });

  const mapApiReportToReport = useCallback((apiReport: ApiReportItem, tab: string): Report => {
    const createdDate = new Date(apiReport.created_at);
    const formattedDate = createdDate.toISOString().split('T')[0];

    const reportedMedia = apiReport.reported_media_id;

    let description = apiReport.detail || '';
    let reportedUser = '';
    let mediaUrls: string[] = [];
    
    // User info fields
    let reportedUserFullName = '';
    let reportedUserProfilePic = '';
    let reportedUserBio = '';
    let reportedUserLocation = '';
    let reportedUserAbout = '';
    let reportedUserVerified = false;
    let reportedUserLastActive = '';

    // Check if it's a User type (has user_name property which is unique to User type)
    if ('user_name' in reportedMedia && 'email' in reportedMedia) {
      // User type structure (for bullying, impersonation, spam)
      const userInfo = reportedMedia as ReportedUserInfo;
      description = apiReport.detail || '';
      reportedUser = userInfo.user_name || '';
      reportedUserFullName = userInfo.full_name || '';
      reportedUserProfilePic = userInfo.profile_pic ? `${BASE_URL}${userInfo.profile_pic}` : '';
      reportedUserBio = userInfo.bio || '';
      reportedUserLocation = userInfo.geo_location || '';
      reportedUserAbout = userInfo.about_me || '';
      reportedUserVerified = userInfo.is_user_verified || false;
      reportedUserLastActive = userInfo.last_active || '';
    } else if ('caption' in reportedMedia) {
      // Post type structure
      description = reportedMedia.caption || apiReport.detail || '';
      reportedUser = reportedMedia.user_id || '';
      mediaUrls = (reportedMedia.media || []).map(
        (url) => `${BASE_URL}${url}`
      );
    } else if ('comment' in reportedMedia) {
      // Comment type structure
      description = reportedMedia.comment || apiReport.detail || '';
      reportedUser = reportedMedia.comment_by || '';
    } else if ('reported_by' in reportedMedia) {
      // User type structure (for bullying, impersonation, spam)
      description = apiReport.detail || '';
      reportedUser = reportedMedia.reported_to || '';
    }

    // Map action_type to status: 3=deleted, 4=suspended, 1 or 2=active
    let status: 'active' | 'suspended' | 'deleted';
    if (apiReport.action_type === 3) {
      status = 'deleted';
    } else if (apiReport.action_type === 4) {
      status = 'suspended';
    } else {
      status = 'active';
    }

    return {
      id: apiReport._id,
      reporterName: apiReport.created_by.user_name || apiReport.created_by.email,
      reporterEmail: apiReport.created_by.email,
      reportedUser,
      reportedUserFullName,
      reportedUserProfilePic,
      reportedUserBio,
      reportedUserLocation,
      reportedUserAbout,
      reportedUserVerified,
      reportedUserLastActive,
      description,
      timestamp: formattedDate,
      reasonCode: apiReport.reason,
      status,
      mediaType: mediaUrls.length > 0
        ? (reportedMedia.media_type === 'video' || mediaUrls[0]?.endsWith('.mp4') ? 'video' as const : 'image' as const)
        : null,
      mediaUrls,
      escalation: apiReport.escalation,
    };
  }, []);

  const fetchReportedMedia = useCallback(async (tab: string) => {
    if (cachedTabs.has(tab)) return;

    setLoadingState(prev => ({ ...prev, [tab]: true }));
    try {
      const query = tab === 'bullying' ? 'Bullying' :
                    tab === 'inappropriate' ? 'Inappropriate' :
                    tab === 'impersonation' ? 'Impersonation' : 'Spam';
      const response = await makeRequest<ApiResponse>({
        url: `${GetReportedMedia}?reason=${encodeURIComponent(query)}&reported_media_type=User`,
        method: 'GET',
      });

      if (response?.data?.result) {
        const mappedReports = response.data.result.map((apiReport) => mapApiReportToReport(apiReport, tab));

        setReports(prev => ({
          ...prev,
          [tab]: mappedReports,
        }));

        setCachedTabs(prev => new Set([...prev, tab]));
        console.log(`Reported ${tab} response:`, response.data);
      }
    } catch (error) {
      console.error(`Error fetching reported ${tab}:`, error);
    } finally {
      setLoadingState(prev => ({ ...prev, [tab]: false }));
    }
  }, [cachedTabs, mapApiReportToReport]);

  // Fetch reported media only once when tab changes and not cached
  useEffect(() => {
    fetchReportedMedia(activeTab);
  }, [activeTab, fetchReportedMedia]);

  const getReasonBadgeColor = (code: string) => {
    switch (code) {
      case 'BULLYING':
      case 'HARASSMENT':
        return 'bg-red-100 text-red-800 border-red-200 border hover:bg-red-100';
      case 'INAPPROPRIATE_CONTENT':
        return 'bg-purple-100 text-purple-800 border-purple-200 border hover:bg-purple-100';
      case 'IMPERSONATION':
        return 'bg-orange-100 text-orange-800 border-orange-200 border hover:bg-orange-100';
      case 'SPAM':
        return 'bg-amber-100 text-amber-800 border-amber-200 border hover:bg-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 border hover:bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Loader2 className="w-10 h-10 animate-spin text-[#007BFF] mb-4" />
      <p className="text-[#64748b] text-lg">Loading reports...</p>
    </div>
  );

  const renderEmptyState = (title: string, description: string) => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <FileWarning className="w-16 h-16 text-[#94a3b8] mb-4" />
      <p className="text-[#1e293b] text-lg font-medium mb-2">{title}</p>
      <p className="text-[#64748b]">{description}</p>
    </div>
  );

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="bullying">Bullying</TabsTrigger>
        <TabsTrigger value="inappropriate">Inappropriate Content</TabsTrigger>
        <TabsTrigger value="impersonation">Impersonation</TabsTrigger>
        <TabsTrigger value="spam">Spam</TabsTrigger>
      </TabsList>

      <TabsContent value="bullying" className="space-y-4">
        {loadingState.bullying ? (
          renderLoadingState()
        ) : reports.bullying.length > 0 ? (
          <BullyingReports
            reports={reports.bullying}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={() => {
              setCachedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('bullying');
                return newSet;
              });
              fetchReportedMedia('bullying');
            }}
          />
        ) : (
          renderEmptyState('No Bullying Reports', 'There are no bullying reports to display.')
        )}
      </TabsContent>

      <TabsContent value="inappropriate" className="space-y-4">
        {loadingState.inappropriate ? (
          renderLoadingState()
        ) : reports.inappropriate.length > 0 ? (
          <InappropriateContentReports
            reports={reports.inappropriate}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={() => {
              setCachedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('inappropriate');
                return newSet;
              });
              fetchReportedMedia('inappropriate');
            }}
          />
        ) : (
          renderEmptyState('No Inappropriate Content Reports', 'There are no inappropriate content reports to display.')
        )}
      </TabsContent>

      <TabsContent value="impersonation" className="space-y-4">
        {loadingState.impersonation ? (
          renderLoadingState()
        ) : reports.impersonation.length > 0 ? (
          <ImpersonationReports
            reports={reports.impersonation}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={() => {
              setCachedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('impersonation');
                return newSet;
              });
              fetchReportedMedia('impersonation');
            }}
          />
        ) : (
          renderEmptyState('No Impersonation Reports', 'There are no impersonation reports to display.')
        )}
      </TabsContent>

      <TabsContent value="spam" className="space-y-4">
        {loadingState.spam ? (
          renderLoadingState()
        ) : reports.spam.length > 0 ? (
          <SpamReports
            reports={reports.spam}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={() => {
              setCachedTabs(prev => {
                const newSet = new Set(prev);
                newSet.delete('spam');
                return newSet;
              });
              fetchReportedMedia('spam');
            }}
          />
        ) : (
          renderEmptyState('No Spam Reports', 'There are no spam reports to display.')
        )}
      </TabsContent>
    </Tabs>
  );
}
