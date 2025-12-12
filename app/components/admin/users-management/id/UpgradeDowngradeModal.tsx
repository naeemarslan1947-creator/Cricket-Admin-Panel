"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

interface UpgradeDowngradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
  upgradeAction: 'upgrade' | 'downgrade';
  onConfirm: () => void;
}

export default function UpgradeDowngradeModal({
  open,
  onOpenChange,
  selectedUser,
  upgradeAction,
  onConfirm
}: UpgradeDowngradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {upgradeAction === 'upgrade' ? <ArrowUp className="w-5 h-5 text-[#00C853]" /> : <ArrowDown className="w-5 h-5 text-[#FF9800]" />}
            {upgradeAction === 'upgrade' ? 'Upgrade' : 'Downgrade'} Subscription
          </DialogTitle>
          <DialogDescription>
            {upgradeAction === 'upgrade' 
              ? `Upgrade ${selectedUser?.name} to Premium subscription`
              : `Downgrade ${selectedUser?.name} to Free subscription`
            }
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-[#64748b]">
            {upgradeAction === 'upgrade'
              ? 'User will get access to all premium features immediately.'
              : 'User will lose access to premium features immediately.'
            }
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            className={upgradeAction === 'upgrade' ? 'bg-[#00C853] hover:bg-[#00a844] text-white' : 'bg-[#FF9800] hover:bg-[#F57C00] text-white'}
          >
            Confirm {upgradeAction === 'upgrade' ? 'Upgrade' : 'Downgrade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}