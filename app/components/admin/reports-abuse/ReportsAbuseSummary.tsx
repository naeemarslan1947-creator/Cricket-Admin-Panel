"use client";

import { AlertTriangle, MessageSquare, UserX, Flag } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { useEffect, useState } from 'react';
import makeRequest from "@/Api's/apiHelper";
import { ReportHeaderResponse, ReportsSummaryData } from '@/app/types/reports';
import { ReportHeader } from "@/Api's/repo";
import Loader from '../../common/Loader';

interface ReportsAbuseSummaryProps {
  refreshTrigger?: number;
}

export default function ReportsAbuseSummary({ refreshTrigger = 0 }: ReportsAbuseSummaryProps) {
  const [summaryData, setSummaryData] = useState<ReportsSummaryData>({
    openReports: 0,
    bullying: 0,
    impersonation: 0,
    spam: 0,
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
            bullying: 0,
            impersonation: 0,
            spam: 0,
          };

          headerData.forEach((item: { reason: string; count: number }) => {
            const reason = item.reason.toLowerCase();

            if (reason.includes('bullying')) mappedData.bullying = item.count;
            else if (reason.includes('impersonation')) mappedData.impersonation = item.count;
            else if (reason.includes('spam')) mappedData.spam = item.count;
            else if (reason.includes('inappropriate'))
              mappedData.bullying += item.count;
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

  const summaryItems = [
    { title: 'Open Reports', value: summaryData.openReports, icon: AlertTriangle, color: 'red' },
    { title: 'Bullying', value: summaryData.bullying, icon: MessageSquare, color: 'amber' },
    { title: 'Impersonation', value: summaryData.impersonation, icon: UserX, color: 'blue' },
    { title: 'Spam', value: summaryData.spam, icon: Flag, color: 'green' },
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600';
      case 'amber': return 'text-amber-600';
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      default: return 'text-red-600';
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {summaryItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className="border-[#e2e8f0]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#64748b]">{item.title}</p>
                      <p className="text-2xl text-[#1e293b] mt-1">{item.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${getIconColor(item.color)}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
