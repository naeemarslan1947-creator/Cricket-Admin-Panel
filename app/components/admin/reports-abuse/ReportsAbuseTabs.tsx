"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import InappropriateContentReports from './InappropriateContentReports';
import ImpersonationReports from './ImpersonationReports';
import SpamReports from './SpamReports';
import PrivacyViolationReports from './PrivacyViolationReports';
import UnderageUserReports from './UnderageUserReports';
import HarassmentReports from './HarassmentReports';
import ClubLeagueRulesViolationReports from './ClubLeagueRulesViolationReports';
import OtherReports from './OtherReports';
import makeRequest from "@/Api's/apiHelper";
import { GetReportedMedia } from "@/Api's/repo";
import { useState, useEffect, useCallback, ReactNode } from 'react';
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
  all: Report[];
  inappropriate: Report[];
  impersonation: Report[];
  spam: Report[];
  privacyViolation: Report[];
  underageUser: Report[];
  harassmentOrBullying: Report[];
  clubLeagueRulesViolation: Report[];
  other: Report[];
}

interface ReportsAbuseTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  onActionComplete?: () => void;
}

interface LoadingState {
  all: boolean;
  inappropriate: boolean;
  impersonation: boolean;
  spam: boolean;
  privacyViolation: boolean;
  underageUser: boolean;
  harassmentOrBullying: boolean;
  clubLeagueRulesViolation: boolean;
  other: boolean;
}

export default function ReportsAbuseTabs({ activeTab, setActiveTab, onActionComplete }: ReportsAbuseTabsProps): ReactNode {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  // Set to track which tabs have been cached/fetched
  const [cachedTabs, setCachedTabs] = useState<Set<string>>(new Set());



const [reports, setReports] = useState<ReportsData>({
    all: [],
    inappropriate: [],
    impersonation: [],
    spam: [],
    privacyViolation: [],
    underageUser: [],
    harassmentOrBullying: [],
    clubLeagueRulesViolation: [],
    other: [],
  });
const [loadingState, setLoadingState] = useState<LoadingState>({
    all: false,
    inappropriate: false,
    impersonation: false,
    spam: false,
    privacyViolation: false,
    underageUser: false,
    harassmentOrBullying: false,
    clubLeagueRulesViolation: false,
    other: false,
  });
  
  // Use a counter to force re-render after actions
  const [refreshCounter, setRefreshCounter] = useState(0);

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
    // Map tab values to state keys
    const stateKeyMap: Record<string, string> = {
      'all': 'all',
      'inappropriate-or-offensive': 'inappropriate',
      'spam-or-misleading': 'spam',
      'privacy-violation': 'privacyViolation',
      'underage-user': 'underageUser',
      'harassment-or-bullying': 'harassmentOrBullying',
      'club-league-rules-violation': 'clubLeagueRulesViolation',
      'impersonation': 'impersonation',
      'other': 'other',
    };

    const stateKey = stateKeyMap[tab] || tab;

    setLoadingState(prev => ({ ...prev, [stateKey]: true }));
    
    try {
      let url = '';
      
      if (tab === 'all') {
        // For "all" tab, only pass reported_media_type=User without reason
        url = `${GetReportedMedia}?reported_media_type=User`;
      } else {
        const query = 
          tab === 'inappropriate-or-offensive' ? 'Inappropriate-or-offensive' :
          tab === 'spam-or-misleading' ? 'Spam-or-misleading' :
          tab === 'privacy-violation' ? 'Privacy-violation' :
          tab === 'underage-user' ? 'Underage-user' :
          tab === 'harassment-or-bullying' ? 'Harrassment-or-bullying' :
          tab === 'club-league-rules-violation' ? 'Club/League-rules-violation' :
          tab === 'impersonation' ? 'Impersonation' :
          'Other';
        
        url = `${GetReportedMedia}?reason=${encodeURIComponent(query)}&reported_media_type=User`;
      }
      
      const response = await makeRequest<ApiResponse>({
        url: url,
        method: 'GET',
      });

      if (response?.data?.result) {
        const mappedReports = response.data.result.map((apiReport) => mapApiReportToReport(apiReport, tab));

        setReports(prev => ({
          ...prev,
          [stateKey]: mappedReports,
        }));
        
        // Mark this tab as cached
        setCachedTabs(prev => new Set(prev).add(tab));
        
        console.log(`Reported ${tab} response:`, response.data);
      }
    } catch (error) {
      console.error(`Error fetching reported ${tab}:`, error);
    } finally {
      setLoadingState(prev => ({ ...prev, [stateKey]: false }));
    }
  }, [mapApiReportToReport]);

  // Helper function to remove a report by ID
  const removeReportById = useCallback((reportId: string | number) => {
    setReports(prev => ({
      ...prev,
      all: prev.all.filter((r: Report) => r.id !== reportId),
      inappropriate: prev.inappropriate.filter((r: Report) => r.id !== reportId),
      spam: prev.spam.filter((r: Report) => r.id !== reportId),
      privacyViolation: prev.privacyViolation.filter((r: Report) => r.id !== reportId),
      underageUser: prev.underageUser.filter((r: Report) => r.id !== reportId),
      harassmentOrBullying: prev.harassmentOrBullying.filter((r: Report) => r.id !== reportId),
      clubLeagueRulesViolation: prev.clubLeagueRulesViolation.filter((r: Report) => r.id !== reportId),
      impersonation: prev.impersonation.filter((r: Report) => r.id !== reportId),
      other: prev.other.filter((r: Report) => r.id !== reportId),
    }));
  }, []);

  // Fetch reported media only once when tab changes and not cached
  useEffect(() => {
    if (!cachedTabs.has(activeTab)) {
      fetchReportedMedia(activeTab);
    }
  }, [activeTab, fetchReportedMedia, cachedTabs]);

const getReasonBadgeColor = (code: string) => {
    switch (code) {
      case 'HARASSMENT':
      case 'HARASSMENT_OR_BULLYING':
        return 'bg-red-100 text-red-800 border-red-200 border hover:bg-red-100';
      case 'INAPPROPRIATE_CONTENT':
      case 'INAPPROPRIATE_OR_OFFENSIVE':
        return 'bg-purple-100 text-purple-800 border-purple-200 border hover:bg-purple-100';
      case 'IMPERSONATION':
        return 'bg-orange-100 text-orange-800 border-orange-200 border hover:bg-orange-100';
      case 'SPAM':
      case 'SPAM_OR_MISLEADING':
        return 'bg-amber-100 text-amber-800 border-amber-200 border hover:bg-amber-100';
      case 'PRIVACY_VIOLATION':
        return 'bg-blue-100 text-blue-800 border-blue-200 border hover:bg-blue-100';
      case 'UNDERAGE_USER':
        return 'bg-pink-100 text-pink-800 border-pink-200 border hover:bg-pink-100';
      case 'CLUB_LEAGUE_RULES_VIOLATION':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 border hover:bg-indigo-100';
      case 'OTHER':
        return 'bg-gray-100 text-gray-800 border-gray-200 border hover:bg-gray-100';
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
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="inappropriate-or-offensive">Inappropriate/Offensive</TabsTrigger>
        <TabsTrigger value="spam-or-misleading">Spam/Misleading</TabsTrigger>
        <TabsTrigger value="privacy-violation">Privacy Violation</TabsTrigger>
        <TabsTrigger value="underage-user">Underage User</TabsTrigger>
        <TabsTrigger value="harassment-or-bullying">Harassment/Bullying</TabsTrigger>
        <TabsTrigger value="club-league-rules-violation">Club/League Rules</TabsTrigger>
        <TabsTrigger value="impersonation">Impersonation</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4" key="all">
        {loadingState.all ? (
          renderLoadingState()
        ) : reports.all.length > 0 ? (
          <InappropriateContentReports
            key={`all-${refreshCounter}`}
            reports={reports.all}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('all');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Reports', 'There are no reports to display.')
        )}
      </TabsContent>

      <TabsContent value="inappropriate-or-offensive" className="space-y-4" key="inappropriate-or-offensive">
        {loadingState.inappropriate ? (
          renderLoadingState()
        ) : reports.inappropriate.length > 0 ? (
<InappropriateContentReports
            key={`inappropriate-${refreshCounter}`}
            reports={reports.inappropriate}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('inappropriate-or-offensive');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Inappropriate/Offensive Reports', 'There are no inappropriate or offensive reports to display.')
        )}
      </TabsContent>

      <TabsContent value="spam-or-misleading" className="space-y-4" key="spam-or-misleading">
        {loadingState.spam ? (
          renderLoadingState()
        ) : reports.spam.length > 0 ? (
<SpamReports
            key={`spam-${refreshCounter}`}
            reports={reports.spam}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('spam-or-misleading');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Spam/Misleading Reports', 'There are no spam or misleading reports to display.')
        )}
      </TabsContent>

      <TabsContent value="privacy-violation" className="space-y-4" key="privacy-violation">
        {loadingState.privacyViolation ? (
          renderLoadingState()
        ) : reports.privacyViolation.length > 0 ? (
<PrivacyViolationReports
            key={`privacy-${refreshCounter}`}
            reports={reports.privacyViolation}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('privacy-violation');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Privacy Violation Reports', 'There are no privacy violation reports to display.')
        )}
      </TabsContent>

      <TabsContent value="underage-user" className="space-y-4" key="underage-user">
        {loadingState.underageUser ? (
          renderLoadingState()
        ) : reports.underageUser.length > 0 ? (
<UnderageUserReports
            key={`underage-${refreshCounter}`}
            reports={reports.underageUser}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('underage-user');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Underage User Reports', 'There are no underage user reports to display.')
        )}
      </TabsContent>

      <TabsContent value="harassment-or-bullying" className="space-y-4" key="harassment-or-bullying">
        {loadingState.harassmentOrBullying ? (
          renderLoadingState()
        ) : reports.harassmentOrBullying.length > 0 ? (
<HarassmentReports
            key={`harassment-${refreshCounter}`}
            reports={reports.harassmentOrBullying}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('harassment-or-bullying');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Harassment/Bullying Reports', 'There are no harassment or bullying reports to display.')
        )}
      </TabsContent>

      <TabsContent value="club-league-rules-violation" className="space-y-4" key="club-league-rules-violation">
        {loadingState.clubLeagueRulesViolation ? (
          renderLoadingState()
        ) : reports.clubLeagueRulesViolation.length > 0 ? (
<ClubLeagueRulesViolationReports
            key={`club-${refreshCounter}`}
            reports={reports.clubLeagueRulesViolation}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('club-league-rules-violation');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Club/League Rules Violation Reports', 'There are no club/league rules violation reports to display.')
        )}
      </TabsContent>

      <TabsContent value="impersonation" className="space-y-4" key="impersonation">
        {loadingState.impersonation ? (
          renderLoadingState()
        ) : reports.impersonation.length > 0 ? (
<ImpersonationReports
            key={`impersonation-${refreshCounter}`}
            reports={reports.impersonation}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('impersonation');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Impersonation Reports', 'There are no impersonation reports to display.')
        )}
      </TabsContent>

      <TabsContent value="other" className="space-y-4" key="other">
        {loadingState.other ? (
          renderLoadingState()
        ) : reports.other.length > 0 ? (
<OtherReports
            key={`other-${refreshCounter}`}
            reports={reports.other}
            formatTimestamp={formatTimestamp}
            getReasonBadgeColor={getReasonBadgeColor}
            onActionComplete={(reportId) => {
              if (reportId) {
                removeReportById(reportId);
              }
              setRefreshCounter(prev => prev + 1);
              fetchReportedMedia('other');
              onActionComplete?.();
            }}
          />
        ) : (
          renderEmptyState('No Other Reports', 'There are no other reports to display.')
        )}
      </TabsContent>
    </Tabs>
  );
}
