"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/app/components/ui/alert-dialog";
import { toastError, toastSuccess } from "@/app/helper/toast";
import { UpdateReviewStatus } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";

type ReviewAction = 'remove' | 'suspend' | 'activate';

interface ReviewActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: number;
  action: ReviewAction;
  reviewName?: string;
  onSuccess?: (reviewId: number, newStatus: 'Active' | 'Deleted' | 'Suspended') => void;
}

const actionConfig = {
  remove: {
    title: "Remove Review",
    description: (name?: string) => `Are you sure you want to remove this review${name ? ` for ${name}` : ''}? This action cannot be undone.`,
    buttonText: "Remove",
    loadingText: "Removing...",
    successMessage: "Review removed successfully",
    newStatus: 'Deleted' as const,
    buttonClass: "bg-red-600 hover:bg-red-700",
  },
  suspend: {
    title: "Suspend Review",
    description: (name?: string) => `Are you sure you want to suspend this review${name ? ` for ${name}` : ''}?`,
    buttonText: "Suspend",
    loadingText: "Suspending...",
    successMessage: "Review suspended successfully",
    newStatus: 'Suspended' as const,
    buttonClass: "bg-amber-600 hover:bg-amber-700",
  },
  activate: {
    title: "Activate Review",
    description: (name?: string) => `Are you sure you want to activate this review${name ? ` for ${name}` : ''}?`,
    buttonText: "Activate",
    loadingText: "Activating...",
    successMessage: "Review activated successfully",
    newStatus: 'Active' as const,
    buttonClass: "bg-[#00C853] hover:bg-[#00a844]",
  },
};

export default function ReviewActionDialog({
  open,
  onOpenChange,
  reviewId,
  action,
  reviewName,
  onSuccess,
}: ReviewActionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const config = actionConfig[action];

  const handleAction = async () => {
    if (!reviewId) {
      toastError("Review ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const actionType = action === 'remove' ? 3 : action === 'suspend' ? 4 : 1;
      
      const response = await makeRequest({
        url: UpdateReviewStatus,
        method: "POST",
        data: {
          id: reviewId,
          action_type: actionType,
        },
      });

      if (response.status === 200) {
        toastSuccess(config.successMessage);
        onOpenChange(false);
        
        if (onSuccess) {
          onSuccess(reviewId, config.newStatus);
        }
      } else {
        toastError(response.message || `Failed to ${action} review`);
      }
    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
      const errorMessage = error instanceof Error ? error.message : `An error occurred while ${action}ing the review`;
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{config.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {config.description(reviewName)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleAction} 
            className={config.buttonClass}
            disabled={isLoading}
          >
            {isLoading ? config.loadingText : config.buttonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
