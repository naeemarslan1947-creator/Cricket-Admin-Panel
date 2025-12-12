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
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { 
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem 
} from '@/app/components/ui/select';

interface OverrideStatusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubName: string;
}

export default function OverrideStatusModal({ 
  open, 
  onOpenChange, 
  clubName 
}: OverrideStatusModalProps) {
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');

  const handleOverrideStatus = () => {
    // Handle status override logic here
    // toast.success(`Club status updated to ${newStatus}`);
    onOpenChange(false);
    setNewStatus('');
    setStatusReason('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Override Club Status
          </DialogTitle>
          <DialogDescription>
            Manually change the club status. This action will be logged.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-status">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status-reason">Reason for Change</Label>
            <Textarea
              id="status-reason"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Enter reason for status change..."
              rows={4}
            />
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-700">
              <span className="font-medium">Note:</span> Overriding status for &quot;{clubName}&quot; will 
              affect all club members and associated data.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleOverrideStatus} 
            disabled={!newStatus}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}