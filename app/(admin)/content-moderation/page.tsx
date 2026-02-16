"use client";
import { useState, useEffect, useCallback } from 'react';
import ContentModerationHeader from '@/app/components/admin/content-moderation/ContentModerationHeader';
import ContentModerationSummary from '@/app/components/admin/content-moderation/ContentModerationSummary';
import ContentModerationTabs from '@/app/components/admin/content-moderation/ContentModerationTabs';
import Loader from '@/app/components/common/Loader'; // Make sure Loader is imported
import makeRequest from "@/Api's/apiHelper";
import { GetReportHeader } from "@/Api's/repo";

interface HeaderItem {
  action_type: number;
  count: number;
}

interface HeaderResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  message: string;
  result: {
    header: HeaderItem[];
  };
  misc_data: null;
}

interface SummaryData {
  openReports: number;
  actioned: number;
  removedContent: number;
  warnedUsers: number;
}

export default function ContentModeration() {
  const [activeTab, setActiveTab] = useState<string>('posts');
  const [summaryData, setSummaryData] = useState<SummaryData>({
    openReports: 0,
    actioned: 0,
    removedContent: 0,
    warnedUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReportHeader = async () => {
    try {
      const response = await makeRequest<HeaderResponse>({
        url: GetReportHeader,
        method: 'GET',
      });

      if (response?.data?.result?.header) {
        const headerData = response.data.result.header;

        const summary: SummaryData = {
          openReports: 0,
          actioned: 0,
          removedContent: 0,
          warnedUsers: 0,
        };

        headerData.forEach((item) => {
          switch (item.action_type) {
            case 1:
              summary.openReports = item.count;
              break;
            case 2:
              summary.actioned = item.count;
              break;
            case 3:
              summary.removedContent = item.count;
              break;
            case 4:
              summary.warnedUsers = item.count;
              break;
          }
        });

        setSummaryData(summary);
        console.log('Report header data:', summary);
      }
    } catch (error) {
      console.error('Error fetching report header:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportHeader();
  }, []);

  // Callback to refresh header counts when an action is completed in tabs
  const handleActionComplete = useCallback(() => {
    fetchReportHeader();
  }, []);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="space-y-6">
      <ContentModerationHeader />
      <ContentModerationSummary data={summaryData} isLoading={isLoading} />
      <ContentModerationTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onActionComplete={handleActionComplete}
      />
    </div>
  );
}
