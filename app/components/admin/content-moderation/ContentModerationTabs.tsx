import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import PostReports from './PostReports';
import CommentReports from './CommentReports';
import makeRequest from "@/Api's/apiHelper";
import { GetReportedMedia } from "@/Api's/repo";
import { useState, useEffect, useCallback } from 'react';
import { Loader2, FileWarning } from 'lucide-react';
import Pagination from '@/app/components/common/Pagination';

interface ReporterInfo {
  _id: string;
  user_name: string;
  email: string;
}

// Post type reported_media_id structure
interface PostReportedMediaInfo {
  _id: string;
  media?: string[];
  caption?: string;
  location?: string;
  user_id: string;
  is_private: boolean;
  media_type?: string;
  action_type: number;
  updated_at: string;
  created_at: string;
}

// Comment type reported_media_id structure
interface CommentReportedMediaInfo {
  _id: string;
  commented_media_id: string;
  comment: string;
  comment_by: string;
  media_type: string;
  action_type: number;
  updated_at: string;
  created_at: string;
}

interface ApiReportItem {
  _id: string;
  reported_media_id: PostReportedMediaInfo | CommentReportedMediaInfo;
  reported_media_type: string;
  reason: string;
  detail: string;
  created_by: ReporterInfo | null; // Can be null for anonymous reports
  action_type: number;
  escalation: number;
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
  reportedContent: string;
  reasonCode: string;
  mediaStatus: 'active' | 'suspended' | 'deleted';
  timestamp: string;
  reportedUser: string;
  status: 'active' | 'suspended' | 'deleted';
  hasMedia?: boolean;
  mediaType?: 'image' | 'video' | null;
  mediaUrls?: string[];
  escalation?: number;
  reportedMediaType?: string;
  reportedMediaId?: string;
  mediaId?: string; // Add mediaId field
  detail?: string; // Add detail field for report description
  location?: string; // Add location field for posts
}

interface ReportsData {
  posts: Report[];
  comments: Report[];
  media: Report[];
}

// Pagination state per tab
interface PaginationState {
  posts: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
  comments: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
  media: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}

interface ContentModerationTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  onActionComplete?: () => void;
}

// Loading state tracker per tab
interface LoadingState {
  posts: boolean;
  comments: boolean;
  media: boolean;
}

// Default pagination values
const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10,
};

export default function ContentModerationTabs({
  activeTab,
  setActiveTab,
}: ContentModerationTabsProps) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  const [reports, setReports] = useState<ReportsData>({
    posts: [],
    comments: [],
    media: [],
  });
  const [cachedTabs, setCachedTabs] = useState<Set<string>>(new Set());
  const [loadingState, setLoadingState] = useState<LoadingState>({
    posts: false,
    comments: false,
    media: false,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    posts: { ...DEFAULT_PAGINATION },
    comments: { ...DEFAULT_PAGINATION },
    media: { ...DEFAULT_PAGINATION },
  });

  const mapApiReportToReport = useCallback((apiReport: ApiReportItem, tab: string): Report => {
    const createdDate = new Date(apiReport.created_at);
    const formattedDate = createdDate.toISOString().split('T')[0];

    const reportedMedia = apiReport.reported_media_id;
    
    let reportedContent = '';
    let reportedUser = '';
    let mediaUrls: string[] = [];
    let location = '';
    let mediaId = '';

    if ('caption' in reportedMedia) {
      // Post type structure
      reportedContent = reportedMedia.caption || apiReport.detail || '';
      reportedUser = reportedMedia.user_id || '';
      location = reportedMedia.location || '';
      mediaId = reportedMedia._id || '';
      mediaUrls = (reportedMedia.media || []).map(
        (url) => url.startsWith('http') ? url : `${BASE_URL}${url}`
      );
    } else if ('comment' in reportedMedia) {
      // Comment type structure
      reportedContent = reportedMedia.comment || apiReport.detail || '';
      reportedUser = reportedMedia.comment_by || '';
      mediaId = reportedMedia._id || '';
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
    
    let mediaStatus: 'active' | 'suspended' | 'deleted';
    if (reportedMedia.action_type === 3) {
      mediaStatus = 'deleted';
    } else if (reportedMedia.action_type === 4) {
      mediaStatus = 'suspended';
    } else {
      mediaStatus = 'active';
    }

    // Handle null created_by (anonymous reporter)
    const reporterName = apiReport.created_by 
      ? (apiReport.created_by.user_name || apiReport.created_by.email)
      : 'Anonymous';

    return {
      id: apiReport._id,
      reporterName,
      reportedContent,
      reasonCode: apiReport.reason,
      timestamp: formattedDate,
      reportedUser,
      mediaStatus,
      status,
      hasMedia: mediaUrls.length > 0,
      mediaType: mediaUrls.length > 0 
        ? (reportedMedia.media_type === 'video' || mediaUrls[0]?.endsWith('.mp4') ? 'video' as const : 'image' as const) 
        : null,
      mediaUrls,
      escalation: apiReport.escalation,
      reportedMediaType: apiReport.reported_media_type,
      mediaId,
      detail: apiReport.detail,
      location,
    };
  }, []);

  const fetchReportedMedia = useCallback(async (tab: string, page: number = 1, limit: number = 10) => {
    // Clear cache when fetching new page to ensure fresh data
    setCachedTabs(prev => {
      const newSet = new Set(prev);
      newSet.delete(tab);
      return newSet;
    });

    setLoadingState(prev => ({ ...prev, [tab]: true }));
    try {
      const query = tab === 'posts' ? 'Post' : tab === 'comments' ? 'Comment' : 'media';
      const response = await makeRequest<ApiResponse>({
        url: `${GetReportedMedia}?reported_media_type=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        method: 'GET',
      });

      if (response?.data?.result) {
        const mappedReports = response.data.result.map((apiReport) => mapApiReportToReport(apiReport, tab));
        
        setReports(prev => ({
          ...prev,
          [tab]: mappedReports,
        }));

        // Update pagination state
        const data = response.data;
        setPagination(prev => ({
          ...prev,
          [tab]: {
            currentPage: data.page_number || 1,
            totalPages: data.total_pages || 1,
            totalRecords: data.total_records || 0,
            limit: limit,
          },
        }));

        setCachedTabs(prev => new Set([...prev, tab]));
        console.log(`Reported ${tab} response:`, response.data);
      }
    } catch (error) {
      console.error(`Error fetching reported ${tab}:`, error);
    } finally {
      setLoadingState(prev => ({ ...prev, [tab]: false }));
    }
  }, [mapApiReportToReport]);

  // Track if initial data has been fetched for each tab to avoid refetching
  const [fetchedTabs, setFetchedTabs] = useState<Set<string>>(new Set());

  // Fetch reported media when tab changes or pagination changes
  useEffect(() => {
    const currentPagination = pagination[activeTab as keyof PaginationState];
    const tabKey = `${activeTab}-${currentPagination.currentPage}`;
    
    // Only fetch if not already fetched for this specific page
    if (!fetchedTabs.has(tabKey)) {
      fetchReportedMedia(activeTab, currentPagination.currentPage, currentPagination.limit);
      setFetchedTabs(prev => new Set([...prev, tabKey]));
    }
  }, [activeTab, fetchReportedMedia, pagination, fetchedTabs]);

  const handlePageChange = useCallback((newPage: number) => {
    // Clear the fetched state for the new page to allow refetching
    setFetchedTabs(prev => {
      const newSet = new Set(prev);
      newSet.delete(`${activeTab}-${newPage}`);
      return newSet;
    });
    
    setPagination(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab as keyof PaginationState],
        currentPage: newPage,
      },
    }));
  }, [activeTab]);

  const getReasonBadgeColor = (code: string) => {
    switch (code) {
      case 'SPAM':
        return 'bg-amber-100 text-amber-800 border-amber-200 border hover:bg-amber-100';
      case 'INAPPROPRIATE_CONTENT':
        return 'bg-red-100 text-red-800 border-red-200 border hover:bg-red-100';
      case 'MISINFORMATION':
        return 'bg-orange-100 text-orange-800 border-orange-200 border hover:bg-orange-100';
      case 'INAPPROPRIATE_IMAGE':
        return 'bg-purple-100 text-purple-800 border-purple-200 border hover:bg-purple-100';
      case 'HARASSMENT':
        return 'bg-red-100 text-red-800 border-red-200 border hover:bg-red-100';
      case 'INAPPROPRIATE':
        return 'bg-red-100 text-red-800 border-red-200 border hover:bg-red-100';
      case 'BULLYING':
        return 'bg-red-100 text-red-800 border-red-200 border hover:bg-red-100';
      case 'IMPERSONATION':
        return 'bg-purple-100 text-purple-800 border-purple-200 border hover:bg-purple-100';
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

  const renderPagination = (tab: string) => {
    const tabPagination = pagination[tab as keyof PaginationState];
    
    // Only show pagination if there are records and multiple pages
    if (tabPagination.totalRecords === 0 || tabPagination.totalPages <= 1) {
      return null;
    }

    return (
      <Pagination
        currentPage={tabPagination.currentPage}
        totalPages={tabPagination.totalPages}
        totalRecords={tabPagination.totalRecords}
        limit={tabPagination.limit}
        onPageChange={handlePageChange}
      />
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="posts">
          Posts ({pagination.posts.totalRecords > 0 ? `${reports.posts.length} of ${pagination.posts.totalRecords}` : 0})
        </TabsTrigger>
        <TabsTrigger value="comments">
          Comments ({pagination.comments.totalRecords > 0 ? `${reports.comments.length} of ${pagination.comments.totalRecords}` : 0})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="posts" className="space-y-4">
        {loadingState.posts ? (
          renderLoadingState()
        ) : reports.posts.length > 0 ? (
          <>
            <PostReports
              formatTimestamp={formatTimestamp}
              getReasonBadgeColor={getReasonBadgeColor}
              reports={reports.posts}
              onActionComplete={() => {
                const currentPagination = pagination.posts;
                setCachedTabs(prev => {
                  const newSet = new Set(prev);
                  newSet.delete('posts');
                  return newSet;
                });
                fetchReportedMedia('posts', currentPagination.currentPage, currentPagination.limit);
              }}
            />
            {renderPagination('posts')}
          </>
        ) : (
          renderEmptyState('No Post Reports', 'There are no post reports to display.')
        )}
      </TabsContent>

      <TabsContent value="comments" className="space-y-4">
        {loadingState.comments ? (
          renderLoadingState()
        ) : reports.comments.length > 0 ? (
          <>
            <CommentReports
              onActionComplete={() => {
                const currentPagination = pagination.comments;
                setCachedTabs(prev => {
                  const newSet = new Set(prev);
                  newSet.delete('comments');
                  return newSet;
                });
                fetchReportedMedia('comments', currentPagination.currentPage, currentPagination.limit);
              }}
              formatTimestamp={formatTimestamp}
              getReasonBadgeColor={getReasonBadgeColor}
              reports={reports.comments}
            />
            {renderPagination('comments')}
          </>
        ) : (
          renderEmptyState('No Comment Reports', 'There are no comment reports to display.')
        )}
      </TabsContent>
    </Tabs>
  );
}

