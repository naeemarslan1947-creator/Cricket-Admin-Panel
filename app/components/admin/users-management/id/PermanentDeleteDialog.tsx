"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/app/components/ui/alert-dialog";
import { toastError, toastSuccess } from "@/app/helper/toast";
import { PermanentDeleteUserAccount } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";

interface PermanentDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
  onSuccess?: () => void;
}

export default function PermanentDeleteDialog({
  open,
  onOpenChange,
  selectedUser,
  onSuccess,
}: PermanentDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePermanentDelete = async () => {
    if (!selectedUser?.id) {
      toastError("User ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await makeRequest({
        url: PermanentDeleteUserAccount,
        method: "POST",
        data: {
          user_id: selectedUser.id,
        },
      });

      if (response.status === 200) {
        toastSuccess("User account permanently deleted successfully!");
        onOpenChange(false);
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toastError(response.message || "Failed to permanently delete user account");
      }
    } catch (error) {
      console.error("Error permanently deleting user account:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while permanently deleting the user account";
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permanently Delete User Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action is permanent and cannot be undone. This will permanently delete {selectedUser?.name}&apos;s account and remove all associated data from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handlePermanentDelete} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Permanent Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

