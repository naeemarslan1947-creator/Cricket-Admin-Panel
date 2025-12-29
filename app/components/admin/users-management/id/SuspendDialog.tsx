"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/app/components/ui/alert-dialog";
import { toastError, toastSuccess } from "@/app/helper/toast";
import { SuspendUserAccount } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";

interface SuspendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: {
    id: string | number;
    name?: string;
    status?: string;
    [key: string]: unknown;
  };
  suspendReason?: string;
  onSuccess?: () => void;
}

export default function SuspendDialog({
  open,
  onOpenChange,
  selectedUser,
  onSuccess,
}: SuspendDialogProps) {
  console.log("📢[SuspendDialog.tsx:28]: selectedUser: ", selectedUser);
  const [isLoading, setIsLoading] = useState(false);
  const isSuspended = selectedUser?.status === "Suspended";

  const handleToggleSuspend = async () => {
    if (!selectedUser?.id) {
      toastError("User ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await makeRequest({
        url: SuspendUserAccount,
        method: "POST",
        data: {
          user_id: selectedUser.id,
        },
      });

      if (response.status === 200) {
        const successMessage = isSuspended 
          ? "User account activated successfully!"
          : "User account suspended successfully!";
        toastSuccess(successMessage);
        onOpenChange(false);
        
        // Call the onSuccess callback to refetch users
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toastError(response.message || (isSuspended ? "Failed to activate user account" : "Failed to suspend user account"));
      }
    } catch (error) {
      console.error("Error toggling user account suspension:", error);
      const errorMessage = error instanceof Error ? error.message : (isSuspended ? "An error occurred while activating the user account" : "An error occurred while suspending the user account");
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isSuspended ? "Activate User Account" : "Suspend User Account"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isSuspended 
              ? `Are you sure you want to activate ${selectedUser?.name}'s account? They will be able to access the platform again.`
              : `Are you sure you want to suspend ${selectedUser?.name}'s account? They will not be able to access the platform.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
     
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleToggleSuspend} 
            className={isSuspended ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}
            disabled={isLoading}
          >
            {isLoading ? (isSuspended ? "Activating..." : "Suspending...") : (isSuspended ? "Activate Account" : "Suspend Account")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}