"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { KeyRound } from "lucide-react";
import { toastError, toastSuccess } from "@/app/helper/toast";
import { SendResetPasswordEmail } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
}

export default function ResetPasswordModal({
  open,
  onOpenChange,
  selectedUser,
}: ResetPasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendResetEmail = async () => {
    if (!selectedUser?.id) {
      toastError("User ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await makeRequest({
        url: SendResetPasswordEmail,
        method: "POST",
        data: {
          user_id: selectedUser.id,
        },
      });

      if (response.status === 200) {
        toastSuccess("Password reset email sent successfully!");
        onOpenChange(false);
      } else {
        toastError(response.message || "Failed to send reset email");
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while sending the reset email";
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendResetEmail} 
            className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}