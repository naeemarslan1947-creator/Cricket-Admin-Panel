// Report Header API Response Types
export interface ReportHeaderItem {
  reason: string;
  count: number;
}

export interface ReportHeaderResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  total_records: number | null;
  page_number: number | null;
  total_pages: number | null;
  message: string;
  error_message: string | null;
  token: string | null;
  result: {
    header: ReportHeaderItem[];
  };
  misc_data: unknown;
}

export interface ReportsSummaryData {
  openReports: number;
  inappropriateContent: number;
  spam: number;
  privacyViolation: number;
  underageUser: number;
  harassmentBullying: number;
  clubRulesViolation: number;
  impersonation: number;
  other: number;
}

// Report Interface for UI
export interface Report {
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

