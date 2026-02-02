import ReportItem from './ReportItem';

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

interface ClubLeagueRulesViolationReportsProps {
  reports: Report[];
  formatTimestamp?: (timestamp: string) => string;
  getReasonBadgeColor?: (code: string) => string;
  onActionComplete?: (reportId?: string | number) => void;
}

export default function ClubLeagueRulesViolationReports({
  reports,
  formatTimestamp,
  getReasonBadgeColor,
  onActionComplete,
}: ClubLeagueRulesViolationReportsProps) {
  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <ReportItem
          key={report.id}
          report={report}
          formatTimestamp={formatTimestamp}
          getReasonBadgeColor={getReasonBadgeColor}
          onActionComplete={() => onActionComplete?.(report.id)}
        />
      ))}
    </div>
  );
}

