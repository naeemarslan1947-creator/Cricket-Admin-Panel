"use client";

import { 
  AlertTriangle, 
  Flag, 
  Shield, 
  UserX, 
  MessageSquare, 
  Building2, 
  UserCog, 
  MoreHorizontal,
  FileWarning
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { useEffect, useState } from 'react';
import makeRequest from "@/Api's/apiHelper";
import { ReportHeaderResponse, ReportsSummaryData } from '@/app/types/reports';
import { ReportHeader } from "@/Api's/repo";
import Loader from '../../common/Loader';

interface ReportsAbuseSummaryProps {
  refreshTrigger?: number;
}

interface SummaryItem {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export default function ReportsAbuseSummary({ refreshTrigger = 0 }: ReportsAbuseSummaryProps) {
  const [summaryData, setSummaryData] = useState<ReportsSummaryData>({
    openReports: 0,
    inappropriateContent: 0,
    spam: 0,
    privacyViolation: 0,
    underageUser: 0,
    harassmentBullying: 0,
    clubRulesViolation: 0,
    impersonation: 0,
    other: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportHeader = async () => {
      setIsLoading(true);
      try {
        const response = await makeRequest<ReportHeaderResponse>({
          url: ReportHeader,
          method: 'GET',
        });

        if (response.data && response.data.result?.header) {
          const headerData = response.data.result.header;

          const totalOpenReports = headerData.reduce(
            (sum: number, item: { count: number }) => sum + item.count,
            0
          );

          const mappedData: ReportsSummaryData = {
            openReports: totalOpenReports,
            inappropriateContent: 0,
            spam: 0,
            privacyViolation: 0,
            underageUser: 0,
            harassmentBullying: 0,
            clubRulesViolation: 0,
            impersonation: 0,
            other: 0,
          };

          headerData.forEach((item: { reason: string; count: number }) => {
            const reason = item.reason.toLowerCase();

            if (reason.includes('inappropriate')) mappedData.inappropriateContent = item.count;
            else if (reason.includes('spam') || reason.includes('misleading')) mappedData.spam = item.count;
            else if (reason.includes('privacy')) mappedData.privacyViolation = item.count;
            else if (reason.includes('underage')) mappedData.underageUser = item.count;
            else if (reason.includes('harassment') || reason.includes('bullying')) mappedData.harassmentBullying = item.count;
            else if (reason.includes('club') || reason.includes('league') || reason.includes('rules') || reason.includes('violation')) mappedData.clubRulesViolation = item.count;
            else if (reason.includes('impersonation')) mappedData.impersonation = item.count;
            else if (reason.includes('other')) mappedData.other = item.count;
          });

          setSummaryData(mappedData);
        }
      } catch (error) {
        console.error('Error fetching report header:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportHeader();
  }, [refreshTrigger]);

  const summaryItems: SummaryItem[] = [
    { title: 'Inappropriate Content', value: summaryData.inappropriateContent, icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { title: 'Spam', value: summaryData.spam, icon: Flag, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: 'Privacy Violation', value: summaryData.privacyViolation, icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: 'Underage User', value: summaryData.underageUser, icon: UserX, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { title: 'Harassment/Bullying', value: summaryData.harassmentBullying, icon: MessageSquare, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Club Rules Violation', value: summaryData.clubRulesViolation, icon: Building2, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'Impersonation', value: summaryData.impersonation, icon: UserCog, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { title: 'Other Reports', value: summaryData.other, icon: MoreHorizontal, color: 'text-gray-600', bgColor: 'bg-gray-50' },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {/* Total Open Reports Card */}
          <Card className="border-l-4 border-l-red-500 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b] font-medium">Total Open Reports</p>
                  <p className="text-3xl font-bold text-[#1e293b] mt-1">{summaryData.openReports}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-full">
                  <FileWarning className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {summaryItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${item.bgColor}`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                    </div>
                    <p className="text-sm text-[#64748b]">{item.title}</p>
                    <p className="text-xl font-semibold text-[#1e293b] mt-1">{item.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
