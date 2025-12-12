"use client";

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/app/components/ui/alert-dialog";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";

interface SuspendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
  suspendReason: string;
  onSuspendReasonChange: (reason: string) => void;
  onSuspend: () => void;
}

export default function SuspendDialog({
  open,
  onOpenChange,
  selectedUser,
  suspendReason,
  onSuspendReasonChange,
  onSuspend
}: SuspendDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Suspend User Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to suspend {selectedUser?.name}&apos;s account? They will not be able to access the platform.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="suspendReason">Reason for suspension</Label>
          <Textarea
            id="suspendReason"
            value={suspendReason}
            onChange={(e) => onSuspendReasonChange(e.target.value)}
            placeholder="Enter reason..."
            rows={3}
            className="mt-2"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSuspend} className="bg-orange-600 hover:bg-orange-700">
            Suspend Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}