import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog"
import makeRequest from "@/Api's/apiHelper"
import { UpdateAdminProfile } from "@/Api's/repo"
import { toastSuccess, toastError } from "../../../helper/toast"

interface DangerZoneProps {
  userId?: string;
}

type ActionType = 'deactivate' | 'delete' | null;

const DangerZone: React.FC<DangerZoneProps> = ({ userId }) => {
  const router = useRouter();
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingAction, setPendingAction] = useState<ActionType>(null);

  const handleAction = async () => {
    if (!userId) {
      toastError('User ID not found');
      setPendingAction(null);
      return;
    }

    if (pendingAction === 'deactivate') {
      setIsDeactivating(true);
    } else if (pendingAction === 'delete') {
      setIsDeleting(true);
    } else {
      setPendingAction(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('_id', userId);
      formData.append('action_type', pendingAction === 'deactivate' ? '4' : '3');

      const response = await makeRequest({
        url: UpdateAdminProfile,
        method: 'POST',
        data: formData,
      });

      if (response.status === 200 || response.status === 201) {
        toastSuccess(pendingAction === 'deactivate' ? 'Account deactivated successfully!' : 'Account deleted successfully!');
        localStorage.removeItem("auth");
  localStorage.removeItem("user");
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  router.push("/login");
      } else {
        const errorData = response.data as { message?: string };
        toastError(errorData?.message || `Failed to ${pendingAction} account`);
      }
    } catch (err: unknown) {
      const error = err as { data?: unknown; message?: string };
      const errorData = error.data as { message?: string };
      toastError(errorData?.message || error.message || `Failed to ${pendingAction} account`);
    } finally {
      setIsDeactivating(false);
      setIsDeleting(false);
      setPendingAction(null);
    }
  };

  const openConfirmDialog = (action: ActionType) => {
    setPendingAction(action);
  };

  return (
    <>
      <Card className="border-red-200 ">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-[#64748b]">Irreversible account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <p className="text-sm text-[#1e293b]">Deactivate Account</p>
              <p className="text-xs text-[#64748b]">Temporarily disable your account</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => openConfirmDialog('deactivate')}
              disabled={isDeactivating || isDeleting}
            >
              {isDeactivating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deactivating...
                </>
              ) : (
                'Deactivate'
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <p className="text-sm text-[#1e293b]">Delete Account</p>
              <p className="text-xs text-[#64748b]">Permanently delete your account and data</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => openConfirmDialog('delete')}
              disabled={isDeactivating || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deactivate Confirmation Dialog */}
      <AlertDialog open={pendingAction === 'deactivate'} onOpenChange={() => setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="w-5 h-5" />
              Deactivate Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will temporarily disable your account. You will not be able to access your account until it is reactivated by an administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              disabled={isDeactivating}
            >
              {isDeactivating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deactivating...
                </>
              ) : (
                'Deactivate'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={pendingAction === 'delete'} onOpenChange={() => setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. All your data, including profile information, posts, and activity history will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DangerZone

