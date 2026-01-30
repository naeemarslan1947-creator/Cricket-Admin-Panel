import { Card, CardContent } from '@/app/components/ui/card';
import ReportItem from './ReportItem';
import { ReactNode } from 'react';

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

interface SpamReportsProps {
  reports: Report[];
  formatTimestamp?: (timestamp: string) => string;
  getReasonBadgeColor?: (code: string) => string;
  onActionComplete?: () => void;
}

export default function SpamReports({ reports, formatTimestamp, getReasonBadgeColor, onActionComplete }: SpamReportsProps): ReactNode {
  return (
    <>
      {reports.map((report) => (
        <Card key={report.id} className="border-[#e2e8f0] ">
          <CardContent className="p-6">
            <ReportItem
              report={report}
              formatTimestamp={formatTimestamp}
              getReasonBadgeColor={getReasonBadgeColor}
              onActionComplete={onActionComplete}
            />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
