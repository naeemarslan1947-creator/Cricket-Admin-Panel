"use client";

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem 
} from '@/app/components/ui/select';

interface ClubStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubName: string;
  onStatusChange: (status: 'active' | 'suspended') => Promise<void>;
  isLoading?: boolean;
}

export default function ClubStatusModal({ 
  open, 
  onOpenChange, 
  clubName,
  onStatusChange,
  isLoading = false,
}: ClubStatusModalProps) {
  const [newStatus, setNewStatus] = useState('');

  const handleStatusChange = async () => {
    if (!newStatus) return;

    try {
      const statusType = newStatus === 'Active' ? 'active' : 'suspended';
      await onStatusChange(statusType);
      onOpenChange(false);
      setNewStatus('');
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Change Club Status
          </DialogTitle>
          <DialogDescription>
            Update the status for <span className="font-medium text-slate-700">{clubName}</span>. This action will be logged.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="club-status">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-700">
              <span className="font-medium">Note:</span> Changing status for &quot;{clubName}&quot; will 
              affect all club members and associated data.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusChange} 
            disabled={!newStatus || isLoading}
            className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
