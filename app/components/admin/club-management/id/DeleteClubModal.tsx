import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/app/components/ui/alert-dialog';

interface DeleteClubModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubName: string;
  onDelete: () => void;
}

export default function DeleteClubModal({ 
  open, 
  onOpenChange, 
  clubName, 
  onDelete 
}: DeleteClubModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Club</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="font-medium text-red-600">{clubName}</span>{" "}
            and remove all associated data including members, achievements, and statistics.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-700">
            <span className="font-medium">Warning:</span> All club data will be permanently deleted.
            This includes:
          </p>
          <ul className="mt-2 text-sm text-red-600 list-disc list-inside">
            <li>All member profiles and data</li>
            <li>Club achievements and records</li>
            <li>Team statistics and match history</li>
            <li>Payment and subscription information</li>
          </ul>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Club
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}