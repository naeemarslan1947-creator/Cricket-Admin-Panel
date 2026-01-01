import { useState } from 'react';
import { CheckCircle, Clock, FileImage, Flag, User, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/app/components/ui/alert-dialog";
import { toastError, toastSuccess } from "@/app/helper/toast";
import { SuspendReport, SuspendMedia, DeleteReport } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";

interface Report {
  id: string | number;
  reporterName: string;
  reportedContent: string;
  reasonCode: string;
  timestamp: string;
  reportedUser: string;
  status: 'active' | 'suspended' | 'deleted';
  mediaStatus: 'active' | 'suspended' | 'deleted';
  hasMedia?: boolean;
  mediaType?: 'image' | 'video' | null;
  mediaUrls?: string[];
}

interface CommentReportsProps {
  reports: Report[];
  getReasonBadgeColor: (reason: string) => string;
  formatTimestamp: (timestamp: string) => string;
  onActionComplete?: () => void;
}

export default function CommentReports({ reports, getReasonBadgeColor, formatTimestamp, onActionComplete }: CommentReportsProps) {
  console.log("📢[CommentReports.tsx:30]: reports: ", reports);
  
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | number | null>(null);
  const [isSuspending, setIsSuspending] = useState(false);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [activateMediaDialogOpen, setActivateMediaDialogOpen] = useState(false);
  const [suspendMediaDialogOpen, setSuspendMediaDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSuspend = async () => {
    if (!selectedReportId) {
      toastError("Report ID is missing");
      return;
    }

    setIsSuspending(true);
    try {
      const response = await makeRequest({
        url: SuspendReport,
        method: "POST",
        data: {
          report_id: selectedReportId,
        },
      });

      if (response.status === 200) {
        toastSuccess("Report suspended successfully");
        setSuspendDialogOpen(false);
        setSelectedReportId(null);
        onActionComplete?.();
      } else {
        toastError(response.message || "Failed to suspend report");
      }
    } catch (error) {
      console.error("Error suspending report:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while suspending the report";
      toastError(errorMessage);
    } finally {
      setIsSuspending(false);
    }
  };


  const openSuspendDialog = (reportId: string | number) => {
    setSelectedReportId(reportId);
    setSuspendDialogOpen(true);
  };

  const openSuspendMediaDialog = (reportId: string | number) => {
    setSelectedReportId(reportId);
    setSuspendMediaDialogOpen(true);
  };

  const openRemoveDialog = (reportId: string | number) => {
    setSelectedReportId(reportId);
    setRemoveDialogOpen(true);
  };

  const openActivateDialog = (reportId: string | number) => {
    setSelectedReportId(reportId);
    setActivateDialogOpen(true);
  };

  const openActivateMediaDialog = (reportId: string | number) => {
    setSelectedReportId(reportId);
    setActivateMediaDialogOpen(true);
  };

  const openDeleteDialog = (reportId: string | number) => {
    setSelectedReportId(reportId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedReportId) {
      toastError("Report ID is missing");
      return;
    }

    setIsDeleting(true);
    try {
      const response = await makeRequest({
        url: DeleteReport,
        method: "POST",
        data: {
          report_id: selectedReportId,
        },
      });

      if (response.status === 200) {
        toastSuccess("Report deleted successfully");
        setDeleteDialogOpen(false);
        setSelectedReportId(null);
        onActionComplete?.();
      } else {
        toastError(response.message || "Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while deleting the report";
      toastError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReportAction = async (actionType: number) => {
    if (!selectedReportId) {
      toastError("Report ID is missing");
      return;
    }

    setIsSuspending(true);
    try {
      const response = await makeRequest({
        url: SuspendMedia,
        method: "POST",
        data: {
          report_id: selectedReportId,
          action_type: actionType,
        },
      });

      if (response.status === 200) {
        if (actionType === 3) {
          toastSuccess("Content removed successfully");
        } else if (actionType === 4) {
          toastSuccess("Media suspended successfully");
        } else if (actionType === 1) {
          toastSuccess("Report activated successfully");
        }
        setSuspendMediaDialogOpen(false);
        setRemoveDialogOpen(false);
        setActivateDialogOpen(false);
        setSelectedReportId(null);
        onActionComplete?.();
      } else {
        toastError(response.message || "Failed to perform action");
      }
    } catch (error) {
      console.error("Error performing action:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toastError(errorMessage);
    } finally {
      setIsSuspending(false);
    }
  };

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

            {/* Content & Actions */}
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
                      Posted by: <span className="font-medium text-[#1e293b]">{report.reportedUser}</span>
                    </span>
                  </div>
                </div>

                {/* Media Preview */}
                {report.hasMedia && report.mediaUrls && report.mediaUrls.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-[#1e293b] mb-3 flex items-center gap-2">
                      <FileImage className="w-5 h-5 text-purple-600" />
                      Attached Media
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {report.mediaUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-slate-50 flex items-center justify-center"
                        >
                          {report.mediaType === "image" ? (
                            <img
                              src={url}
                              alt={`comment-${report.id}-${index}`}
                              className="object-contain w-full h-full"
                            />
                          ) : report.mediaType === "video" ? (
                            <video controls className="object-cover w-full h-full">
                              <source src={url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : null}

                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <Button variant="destructive" onClick={() => openRemoveDialog(report.id)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Remove
                </Button>

                <Button 
                  variant="secondary" 
                  className="bg-red-100 text-red-700 border-red-200 border hover:bg-red-200"
                  onClick={() => openDeleteDialog(report.id)}
                >
                  Delete Report
                </Button>

                {report.status === 'suspended'  ? (
                  <Button 
                    variant="outline" 
                    className="border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => openActivateDialog(report.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Activate
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => openSuspendDialog(report.id)}
                  >
                    Suspend Report
                  </Button>
                )}
                 {report.mediaStatus === 'suspended'  ? (
                  <Button 
                    variant="outline" 
                    className="border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => openActivateMediaDialog(report.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                     Active Media
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => openSuspendMediaDialog(report.id)}
                  >
                    Suspend Media
                  </Button>
                )}

              </div>

            </div>

            {/* Offender History */}
            <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
              <h4 className="text-sm font-medium text-[#1e293b] mb-2">Offender History</h4>
              <div className="flex flex-wrap gap-4 text-sm text-[#64748b]">
                <span>Previous Warnings: <span className="font-medium text-[#1e293b]">2</span></span>
                <span>Content Removed: <span className="font-medium text-[#1e293b]">1</span></span>
                <span>Account Age: <span className="font-medium text-[#1e293b]">3 months</span></span>
              </div>
            </div>

          </CardContent>
        </Card>
      ))}
      
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend this report? This action can be undone later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSuspending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSuspend} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isSuspending}
            >
              {isSuspending ? "Suspending..." : "Suspend"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={activateDialogOpen} onOpenChange={setActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate this report? This will reopen the report for review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSuspending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSuspend} 
              className="bg-[#00C853] hover:bg-[#00a844]"
              disabled={isSuspending}
            >
              {isSuspending ? "Activating..." : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Content</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this content? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSuspending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleReportAction(3)} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isSuspending}
            >
              {isSuspending ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={suspendMediaDialogOpen} onOpenChange={setSuspendMediaDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to suspend this media? The media will be hidden from public view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSuspending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleReportAction(4)} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isSuspending}
            >
              {isSuspending ? "Suspending..." : "Suspend Media"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={activateMediaDialogOpen} onOpenChange={setActivateMediaDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to activate this media? The media will be visible again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSuspending}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleReportAction(1)} 
              className="bg-[#00C853] hover:bg-[#00a844]"
              disabled={isSuspending}
            >
              {isSuspending ? "Activating..." : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action will permanently remove the report and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
