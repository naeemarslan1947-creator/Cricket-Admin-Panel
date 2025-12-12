"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { KeyRound } from "lucide-react";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
  onReset: () => void;
}

export default function ResetPasswordModal({
  open,
  onOpenChange,
  selectedUser,
  onReset
}: ResetPasswordModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#007BFF]" />
            Reset Password
          </DialogTitle>
          <DialogDescription>
            Send a password reset email to {selectedUser?.email}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-[#64748b]">
            The user will receive an email with instructions to reset their password.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onReset} className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
            Send Reset Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}