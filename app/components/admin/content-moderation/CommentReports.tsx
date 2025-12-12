import { CheckCircle, Clock, Flag, User, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';


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

interface CommentReportsProps {
  reports: Report[];
  getReasonBadgeColor: (reason: string) => string;
  formatTimestamp: (timestamp: string) => string;
}

export default function CommentReports({ reports, getReasonBadgeColor, formatTimestamp }: CommentReportsProps) {
  return (
    <>
      {reports.map((report) => (
        <Card key={report.id} className="border-[#e2e8f0] ">
          <CardContent className="p-6">
            
            {/* Header */}
            <div className="mb-4 pb-4 border-b border-[#e2e8f0]">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-medium text-[#1e293b]">Report #{report.id}</h3>
                <Badge className={getReasonBadgeColor(report.reasonCode)}>
                  {report.reasonCode}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Reporter Info */}
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-700 mb-0.5">Reported By</p>
                    <p className="text-sm font-medium text-[#1e293b]">{report.reporterName}</p>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-slate-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 mb-0.5">Reported At</p>
                    <p className="text-sm font-medium text-[#1e293b]">{report.timestamp}</p>
                    <p className="text-xs text-slate-500">{formatTimestamp(report.timestamp)}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              <div className="flex-1">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[#1e293b] mb-2 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-red-600" />
                    Reported Content
                  </h4>

                  <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#e2e8f0]">
                    <p className="text-[#1e293b]">{report.reportedContent}</p>
                  </div>

                  <div className="mt-2 text-sm text-[#64748b]">
                    <span>
                      Posted by: <span className="font-medium text-[#1e293b]">{report.reportedUser}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <Button className="bg-[#00C853] hover:bg-[#00a844] text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>

                <Button variant="destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Remove
                </Button>

                <Button variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                  Warn User
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
