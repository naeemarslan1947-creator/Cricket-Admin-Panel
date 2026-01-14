"use client";

import { ShieldCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';

interface VerifyClubModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubName: string;
  onVerify: () => Promise<void>;
  isLoading?: boolean;
}

export default function VerifyClubModal({ 
  open, 
  onOpenChange, 
  clubName,
  onVerify,
  isLoading = false,
}: VerifyClubModalProps) {
  const handleVerifyClick = async () => {
    try {
      await onVerify();
      onOpenChange(false);
    } catch (err) {
      console.error('Error verifying club:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Verify Club
          </DialogTitle>
          <DialogDescription>
            This will mark the club as verified. Verified clubs receive a verification badge and increased visibility.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-sm text-emerald-700">
              You are about to verify <span className="font-medium">{clubName}</span>. 
              This action will grant the club official verification status.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-600">
              After verification:
            </p>
            <ul className="text-sm text-slate-600 list-disc list-inside space-y-1">
              <li>The club will display a verification badge</li>
              <li>Club profile will show as verified</li>
              <li>This action can be reversed later if needed</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyClick}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify Club'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

