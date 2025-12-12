import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import PostReports from './PostReports';
import CommentReports from './CommentReports';
import MediaReports from './MediaReports';



// FINAL FIXED TYPE (matches all child components)
interface Report {
  id: number;
  reporterName: string;
  reportedContent: string;
  reasonCode: string;
  timestamp: string;
  reportedUser: string;
  status: 'open' | 'closed';
  hasMedia?: boolean;
  mediaType?: 'image' | 'video' | null;
}

interface ReportsData {
  posts: Report[];
  comments: Report[];
  media: Report[];
}

interface ContentModerationTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  reports: ReportsData;
}

export default function ContentModerationTabs({
  activeTab,
  setActiveTab,
  reports,
}: ContentModerationTabsProps) {
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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
     <TabsList >
  <TabsTrigger
    value="posts"
   
  >
    Posts ({reports.posts.length})
  </TabsTrigger>

  <TabsTrigger
    value="comments"
   
  >
    Comments ({reports.comments.length})
  </TabsTrigger>

  <TabsTrigger
    value="media"
   >
    Media ({reports.media.length})
  </TabsTrigger>
</TabsList>


      <TabsContent value="posts" className="space-y-4">
        <PostReports
          formatTimestamp={formatTimestamp}
          getReasonBadgeColor={getReasonBadgeColor}
          reports={reports.posts}
        />
      </TabsContent>

      <TabsContent value="comments" className="space-y-4">
        <CommentReports
          formatTimestamp={formatTimestamp}
          getReasonBadgeColor={getReasonBadgeColor}
          reports={reports.comments}
        />
      </TabsContent>

      <TabsContent value="media" className="space-y-4">
        <MediaReports
          formatTimestamp={formatTimestamp}
          getReasonBadgeColor={getReasonBadgeColor}
          reports={reports.media}
        />
      </TabsContent>
    </Tabs>
  );
}
