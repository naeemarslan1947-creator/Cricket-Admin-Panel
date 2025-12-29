"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/app/components/ui/alert-dialog";
import { toastError, toastSuccess } from "@/app/helper/toast";
import { DeleteUserAccount } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
  onSuccess?: () => void;
}

export default function DeleteDialog({
  open,
  onOpenChange,
  selectedUser,
  onSuccess,
}: DeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedUser?.id) {
      toastError("User ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await makeRequest({
        url: DeleteUserAccount,
        method: "POST",
        data: {
          user_id: selectedUser.id,
        },
      });

      if (response.status === 200) {
        toastSuccess("User account deleted successfully!");
        onOpenChange(false);
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toastError(response.message || "Failed to delete user account");
      }
    } catch (error) {
      console.error("Error deleting user account:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while deleting the user account";
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User Account</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {selectedUser?.name}&apos;s account and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
