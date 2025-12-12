import { CheckCircle, Clock, FileImage, Flag, Image, User, Video, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';

interface Report {
  id: number;
  reporterName: string;
  reasonCode: string;
  reportedUser: string;
  reportedContent: string;
  timestamp: string;
  status: 'open' | 'closed';
  hasMedia?: boolean;
  mediaType?: 'image' | 'video';
}

interface PostReportsProps {
  reports: Report[];
  getReasonBadgeColor: (code: string) => string;
  formatTimestamp: (timestamp: string) => string;
}

export default function PostReports({ reports, getReasonBadgeColor, formatTimestamp }: PostReportsProps) {
  console.log("📢 [PostReports.tsx] reports: ", reports);

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
                
                {/* Reporter */}
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


            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Content Section */}
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
                      Posted by:{" "}
                      <span className="font-medium text-[#1e293b]">
                        {report.reportedUser}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Media Preview */}
                {report.hasMedia && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-[#1e293b] mb-2 flex items-center gap-2">
                      <FileImage className="w-4 h-4 text-purple-600" />
                      Attached Media
                    </h4>

                    <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#e2e8f0]">

                      {report.mediaType === 'image' && (
                        <div className="relative w-full h-64 bg-linear-to-br from-slate-200 to-slate-100 rounded-lg flex flex-col items-center justify-center">
                          <Image className="w-12 h-12 text-slate-400 mb-2" />
                          <p className="text-sm text-slate-500">Image Preview</p>
                          <p className="text-xs text-slate-400 mt-1">post-{report.id}.jpg</p>
                        </div>
                      )}

                      {report.mediaType === 'video' && (
                        <div className="relative w-full h-64 bg-linear-to-br from-blue-200 to-blue-100 rounded-lg flex flex-col items-center justify-center">
                          <Video className="w-12 h-12 text-blue-600 mb-2" />
                          <p className="text-sm text-blue-700">Video Preview</p>
                          <p className="text-xs text-blue-500 mt-1">post-{report.id}.mp4</p>
                        </div>
                      )}

                    </div>
                  </div>
                )}

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

                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                  Suspend
                </Button>

                <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                  Hide
                </Button>
              </div>

            </div>

            {/* Offender History */}
            <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
              <h4 className="text-sm font-medium text-[#1e293b] mb-2">Offender History</h4>
              <div className="flex gap-4 text-sm text-[#64748b]">
                <span>Previous Warnings: <span className="font-medium text-[#1e293b]">2</span></span>
                <span>Content Removed: <span className="font-medium text-[#1e293b]">1</span></span>
                <span>Account Age: <span className="font-medium text-[#1e293b]">3 months</span></span>
              </div>
            </div>

          </CardContent>
        </Card>
      ))}
    </>
  );
}
