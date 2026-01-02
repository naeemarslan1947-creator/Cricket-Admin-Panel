import { useState, ReactNode } from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '../../ui/button';
import { Loader2 } from 'lucide-react';
import makeRequest from "@/Api's/apiHelper";
import { DeleteReport, SuspendReport, SuspendMedia, EscalateReport } from "@/Api's/repo";
import { toastSuccess, toastError } from '@/app/helper/toast';
import ReportActionConfirmationModal from './ReportActionConfirmationModal';

interface Report {
  id: string | number;
  reporterName: string;
  reportedUser: string;
  description: string;
  timestamp: string;
  reasonCode: string;
  status: 'active' | 'suspended' | 'deleted';
  mediaUrls?: string[];
  mediaType?: 'image' | 'video' | null;
}

interface ReportItemProps {
  report: Report;
  getReasonBadgeColor?: (code: string) => string;
  formatTimestamp?: (timestamp: string) => string;
  onActionComplete?: () => void;
}

type PendingAction = 'removeContent' | 'suspendReport' | 'deleteReport' | 'escalate' | null;

export default function ReportItem({ report, getReasonBadgeColor, formatTimestamp, onActionComplete }: ReportItemProps): ReactNode {
  const [loading, setLoading] = useState<{
    removeContent: boolean;
    suspendReport: boolean;
    deleteReport: boolean;
    escalate: boolean;
  }>({
    removeContent: false,
    suspendReport: false,
    deleteReport: false,
    escalate: false,
  });

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  // Handle Remove Content - SuspendMedia with action_type: 3
  const handleRemoveContent = async () => {
    setLoading(prev => ({ ...prev, removeContent: true }));
    try {
      await makeRequest({
        url: `${SuspendMedia}`,
        method: 'POST',
        data: {
          report_id: report.id,
          action_type: 3,
        },
      });
      toastSuccess('Content removed successfully');
      onActionComplete?.();
    } catch (error) {
      console.error('Error removing content:', error);
      toastError('Failed to remove content');
    } finally {
      setLoading(prev => ({ ...prev, removeContent: false }));
    }
  };

  // Handle Suspend Report - Call SuspendReport API
  // If status is suspended, this will re-activate it
  const handleSuspendReport = async () => {
    setLoading(prev => ({ ...prev, suspendReport: true }));
    try {
      await makeRequest({
        url: `${SuspendReport}`,
        method: 'POST',
        data: {
          report_id: report.id,
        },
      });
      toastSuccess(report.status === 'suspended' ? 'Report re-activated successfully' : 'Report suspended successfully');
      onActionComplete?.();
    } catch (error) {
      console.error('Error suspending report:', error);
      toastError('Failed to suspend report');
    } finally {
      setLoading(prev => ({ ...prev, suspendReport: false }));
    }
  };

  // Handle Delete Report - Call DeleteReport API
  const handleDeleteReport = async () => {
    setLoading(prev => ({ ...prev, deleteReport: true }));
    try {
      await makeRequest({
        url: `${DeleteReport}`,
        method: 'POST',
        data: {
          report_id: report.id,
        },
      });
      toastSuccess('Report deleted successfully');
      onActionComplete?.();
    } catch (error) {
      console.error('Error deleting report:', error);
      toastError('Failed to delete report');
    } finally {
      setLoading(prev => ({ ...prev, deleteReport: false }));
    }
  };

  // Handle Escalate Report - Call EscalateReport API
  const handleEscalateReport = async () => {
    setLoading(prev => ({ ...prev, escalate: true }));
    try {
      await makeRequest({
        url: `${EscalateReport}`,
        method: 'POST',
        data: {
          report_id: report.id,
        },
      });
      toastSuccess('Report escalated successfully');
      onActionComplete?.();
    } catch (error) {
      console.error('Error escalating report:', error);
      toastError('Failed to escalate report');
    } finally {
      setLoading(prev => ({ ...prev, escalate: false }));
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-amber-100 text-amber-800',
      deleted: 'bg-red-100 text-red-800',
    };

    const colorClass = colors[status] || 'bg-gray-100 text-gray-800';
    return (
      <Badge className={`${colorClass}`}>
        {status}
      </Badge>
    );
  };

  const defaultBadgeColor = (code: string) => {
    const colors: Record<string, string> = {
      BULLYING: 'bg-red-100 text-red-800',
      HARASSMENT: 'bg-red-100 text-red-800',
      INAPPROPRIATE_CONTENT: 'bg-purple-100 text-purple-800',
      IMPERSONATION: 'bg-orange-100 text-orange-800',
      SPAM: 'bg-amber-100 text-amber-800',
    };
    return colors[code] || 'bg-gray-100 text-gray-800';
  };

  const defaultFormatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const badgeColor = getReasonBadgeColor 
    ? getReasonBadgeColor(report.reasonCode) 
    : defaultBadgeColor(report.reasonCode);

  const formattedTimestamp = formatTimestamp 
    ? formatTimestamp(report.timestamp) 
    : defaultFormatTimestamp(report.timestamp);

  const renderMedia = () => {
    if (!report.mediaUrls?.length) return null;

    return (
      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700 mb-2">Reported Media</p>

        <div className="flex flex-wrap gap-3">
          {report.mediaUrls.map((url, index) => (
            <div key={index} className="relative w-32 h-32 rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              {report.mediaType === 'video' ? (
                <video src={url} className="w-full h-full object-cover" controls />
              ) : (
                <img src={url} className="w-full h-full object-cover" alt="" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        
        <div className="flex flex-col gap-2 flex-1">

          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-slate-800 font-semibold">
              Report #{report.id}
            </h4>

            <Badge className={badgeColor}>
              {report.reasonCode}
            </Badge>

            {getStatusBadge(report.status)}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            {report.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>
              Reporter: <span className="text-slate-800 font-medium">{report.reporterName}</span>
            </span>

            <span className="text-slate-400">•</span>

            <span>
              Reported User: <span className="text-slate-800 font-medium">{report.reportedUser}</span>
            </span>

            <span className="text-slate-400">•</span>

            <span>{formattedTimestamp}</span>
          </div>
        </div>
      </div>

      {renderMedia()}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mt-6">

        <Button 
          size="sm" 
          className="bg-[#00C853] hover:bg-[#00a844] text-white"
          onClick={() => setPendingAction('removeContent')}
          disabled={loading.removeContent || report.status === 'deleted'}
        >
          {loading.removeContent ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Removing...
            </>
          ) : (
            'Remove User'
          )}
        </Button>

        <Button 
          size="sm" 
          variant="outline" 
          className="border-amber-200 text-amber-700 hover:bg-amber-50"
          onClick={() => setPendingAction('escalate')}
          disabled={loading.escalate || report.status === 'deleted'}
        >
          {loading.escalate ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Escalating...
            </>
          ) : (
            'Escalate'
          )}
        </Button>

        <Button 
          size="sm" 
          variant="outline" 
          className={`border-red-200 ${report.status === 'suspended' ? 'text-green-600 hover:bg-green-50 border-green-200' : 'text-red-600 hover:bg-red-50'}`}
          onClick={() => setPendingAction('suspendReport')}
          disabled={loading.suspendReport || report.status === 'deleted'}
        >
          {loading.suspendReport ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Processing...
            </>
          ) : report.status === 'suspended' ? (
            'Activate Report'
          ) : (
            'Suspend Report'
          )}
        </Button>

        <Button 
          size="sm" 
          variant="outline" 
          className="border-slate-200 text-slate-700 hover:bg-slate-50"
          onClick={() => setPendingAction('deleteReport')}
          disabled={loading.deleteReport || report.status === 'deleted'}
        >
          {loading.deleteReport ? (
            <>
              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
              Deleting...
            </>
          ) : (
            'Delete Report'
          )}
        </Button>
      </div>

      {/* Confirmation Modal for Remove Content */}
      <ReportActionConfirmationModal
        open={pendingAction === 'removeContent'}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title="Remove User Content"
        description={`Are you sure you want to remove the reported content from user "${report.reportedUser}"? This action will suspend their media access.`}
        confirmText="Remove Content"
        onConfirm={handleRemoveContent}
        isLoading={loading.removeContent}
        variant="danger"
      />

      {/* Confirmation Modal for Escalate Report */}
      <ReportActionConfirmationModal
        open={pendingAction === 'escalate'}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title="Escalate Report"
        description={`Are you sure you want to escalate Report #${report.id}? This will flag it for higher-level review.`}
        confirmText="Escalate"
        onConfirm={handleEscalateReport}
        isLoading={loading.escalate}
        variant="warning"
      />

      {/* Confirmation Modal for Suspend/Activate Report */}
      <ReportActionConfirmationModal
        open={pendingAction === 'suspendReport'}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title={report.status === 'suspended' ? 'Activate Report' : 'Suspend Report'}
        description={report.status === 'suspended' 
          ? `Are you sure you want to re-activate Report #${report.id}? This will change the report status back to active.`
          : `Are you sure you want to suspend Report #${report.id}? This will mark the report as suspended and pause further actions.`
        }
        confirmText={report.status === 'suspended' ? 'Activate' : 'Suspend'}
        onConfirm={handleSuspendReport}
        isLoading={loading.suspendReport}
        variant={report.status === 'suspended' ? 'info' : 'warning'}
      />

      {/* Confirmation Modal for Delete Report */}
      <ReportActionConfirmationModal
        open={pendingAction === 'deleteReport'}
        onOpenChange={(open) => !open && setPendingAction(null)}
        title="Delete Report"
        description={`Are you sure you want to delete Report #${report.id}? This action cannot be undone and the report will be permanently removed.`}
        confirmText="Delete Report"
        onConfirm={handleDeleteReport}
        isLoading={loading.deleteReport}
        variant="danger"
      />
    </div>
  );
}
