import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Ban, Calendar, Play, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';

export interface Subscription {
  id: number;
  user: string;
  email: string;
  plan: 'Premium' | 'Pro' | 'Basic';
  status: 'Active' | 'Trial' | 'Expired' | 'Cancelled';
  trial: boolean;
  renewal: string;
  amount: string;
}

interface ManageSubscriptionDialogProps {
  manageDialogOpen: boolean;
  setManageDialogOpen: (open: boolean) => void;
  selectedSubscription: Subscription | null;
  getPlanBadge: (plan: Subscription['plan']) => React.ReactNode;
  getStatusBadge: (status: Subscription['status']) => React.ReactNode;
}

const ManageSubscriptionDialog: React.FC<ManageSubscriptionDialogProps> = ({
  manageDialogOpen,
  setManageDialogOpen,
  selectedSubscription,
  getPlanBadge,
  getStatusBadge,
}) => {
  return (
    <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#1e293b]">Manage Subscription</DialogTitle>
          <DialogDescription className="text-[#64748b]">
            Manual override actions for {selectedSubscription?.user}
          </DialogDescription>
        </DialogHeader>

        {selectedSubscription && (
          <div className="space-y-6">
            {/* User Details Card */}
            <div className="p-4 bg-slate-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b]">User</p>
                  <p className="font-medium text-[#1e293b]">{selectedSubscription.user}</p>
                </div>
                <div>
                  <p className="text-sm text-[#64748b]">Email</p>
                  <p className="font-medium text-[#1e293b]">{selectedSubscription.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#64748b]">Current Plan</p>
                  <div className="mt-1">{getPlanBadge(selectedSubscription.plan)}</div>
                </div>
                <div>
                  <p className="text-sm text-[#64748b]">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedSubscription.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-[#64748b]">Renewal</p>
                  <p className="font-medium text-[#1e293b]">{selectedSubscription.renewal}</p>
                </div>
              </div>
            </div>

            {/* Manual Override Actions */}
            <div className="space-y-3">
              <h3 className="font-medium text-[#1e293b]">Manual Override Actions</h3>

              {/* Start Free Trial */}
              <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1e293b]">Start Free Trial</p>
                    <p className="text-sm text-[#64748b]">Grant a new 14-day free trial period</p>
                  </div>
                </div>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">Start Trial</Button>
              </div>

              {/* Extend Free Trial */}
              <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1e293b]">Extend Free Trial</p>
                    <p className="text-sm text-[#64748b]">Add 7 more days to current trial</p>
                  </div>
                </div>
                <Button className="bg-[#f59e0b] hover:bg-[#d97706] text-white">Extend Trial</Button>
              </div>

              {/* Convert to Premium */}
              <div className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1e293b]">Convert to Premium</p>
                    <p className="text-sm text-[#64748b]">Upgrade to Premium plan immediately</p>
                  </div>
                </div>
                <Button className="bg-[#9333ea] hover:bg-[#7e22ce] text-white">Convert</Button>
              </div>

              {/* Revoke Access */}
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Ban className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1e293b]">Revoke Access</p>
                    <p className="text-sm text-[#64748b]">Immediately cancel and revoke subscription</p>
                  </div>
                </div>
                <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                  Revoke
                </Button>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-[#e2e8f0]">
              <Button variant="outline" className="border-[#e2e8f0]" onClick={() => setManageDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ManageSubscriptionDialog;
