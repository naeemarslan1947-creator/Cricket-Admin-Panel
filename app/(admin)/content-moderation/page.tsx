"use client";
import { useState } from 'react';
import ContentModerationHeader from '@/app/components/admin/content-moderation/ContentModerationHeader';
import ContentModerationSummary from '@/app/components/admin/content-moderation/ContentModerationSummary';
import ContentModerationTabs from '@/app/components/admin/content-moderation/ContentModerationTabs';

interface Report {
  id: number;
  content: string;
  reporter: string;
  reason: string;
  reported: string;
  status: 'open' | 'closed';
}

interface ReportsData {
  posts: Report[];
  comments: Report[];
  media: Report[];
}

export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState<string>('posts');

  const reports = {
    posts: [
      {
        id: 1,
        reporterName: 'James Anderson',
        reportedContent: 'Check out this amazing cricket shot! Best innings of the season. #Cricket #Sports',
        reasonCode: 'SPAM',
        timestamp: '2024-12-05 14:30:00',
        reportedUser: 'Ben Stokes',
        status: 'open',
        hasMedia: true,
        mediaType: 'image'
      },
      {
        id: 2,
        reporterName: 'Joe Root',
        reportedContent: 'Great match today at the stadium. What an incredible finish!',
        reasonCode: 'INAPPROPRIATE_CONTENT',
        timestamp: '2024-12-05 11:15:00',
        reportedUser: 'Jonny Bairstow',
        status: 'open',
        hasMedia: true,
        mediaType: 'video'
      },
    ],
    comments: [
      {
        id: 3,
        reporterName: 'Stuart Broad',
        reportedContent: 'This is completely wrong information about the player stats',
        reasonCode: 'MISINFORMATION',
        timestamp: '2024-12-04 16:45:00',
        reportedUser: 'Moeen Ali',
        status: 'open',
        hasMedia: false,
        mediaType: null
      },
    ],
    media: [
      {
        id: 4,
        reporterName: 'Chris Woakes',
        reportedContent: 'Profile photo upload',
        reasonCode: 'INAPPROPRIATE_IMAGE',
        timestamp: '2024-12-05 13:20:00',
        reportedUser: 'Jofra Archer',
        status: 'open',
        hasMedia: true,
        mediaType: 'image'
      },
    ]
  };

  return (
    <div className="space-y-6">
      <ContentModerationHeader />
      <ContentModerationSummary />
      <ContentModerationTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        reports={reports}
      />
    </div>
  );
}