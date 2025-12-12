import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Ban, CheckCircle, Clock, DollarSign, Download, TrendingUp, Users, XCircle } from 'lucide-react';
import { Button } from '../../ui/button';

interface ExportDialogProps {
  exportDialogOpen: boolean;
  setExportDialogOpen: (open: boolean) => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ exportDialogOpen, setExportDialogOpen }) => {
  return (
    <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#1e293b]">Export Financial Data</DialogTitle>
          <DialogDescription className="text-[#64748b]">
            Download financial data in CSV format for analysis and reporting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Options */}
          <div className="space-y-3">
            <h3 className="font-medium text-[#1e293b]">Select Data to Export</h3>

            {/** Each export card */}
            {[
              { icon: Download, title: 'Complete Financial Report', desc: 'All subscriptions, payments, and revenue data', btnText: 'Export All' },
              { icon: Users, title: 'Active Subscriptions', desc: 'User, plan, status, renewal dates', btnText: 'Export' },
              { icon: DollarSign, title: 'Payment History', desc: 'All successful transactions and invoices', btnText: 'Export' },
              { icon: XCircle, title: 'Failed Payments & Issues', desc: 'Payment failures, reasons, retry schedules', btnText: 'Export' },
              { icon: Clock, title: 'Trial Subscriptions', desc: 'All trial users and expiration dates', btnText: 'Export' },
              { icon: TrendingUp, title: 'Revenue Analytics', desc: 'Monthly revenue, MRR, conversion rates', btnText: 'Export' },
              { icon: Ban, title: 'Cancelled & Expired', desc: 'Churn data and cancellation reasons', btnText: 'Export' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1e293b]">{item.title}</p>
                      <p className="text-sm text-[#64748b]">{item.desc}</p>
                    </div>
                  </div>
                  <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">{item.btnText}</Button>
                </div>
              );
            })}
          </div>

          {/* Export Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Export Information</p>
                <p className="text-blue-800">
                  All exports are generated in CSV format and include complete data with headers for easy import into Excel, Google Sheets, or financial software.
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-[#e2e8f0]">
            <Button variant="outline" className="border-[#e2e8f0]" onClick={() => setExportDialogOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
