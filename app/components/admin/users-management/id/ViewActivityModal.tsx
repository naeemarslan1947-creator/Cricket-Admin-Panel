"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Activity } from "lucide-react";

interface ViewActivityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
}

export default function ViewActivityModal({
  open,
  onOpenChange,
  selectedUser
}: ViewActivityModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#007BFF]" />
            Full Activity Log
          </DialogTitle>
          <DialogDescription>
            Complete activity history for {selectedUser?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          {[
            { action: 'Logged in from Mumbai, India', time: '2 hours ago', type: 'login' },
            { action: 'Updated profile picture', time: '1 day ago', type: 'profile' },
            { action: 'Posted match score', time: '2 days ago', type: 'post' },
            { action: 'Joined Mumbai Cricket Club', time: '3 days ago', type: 'club' },
            { action: 'Commented on a post', time: '4 days ago', type: 'comment' },
            { action: 'Left a review', time: '5 days ago', type: 'review' },
            { action: 'Updated account settings', time: '1 week ago', type: 'settings' },
            { action: 'Subscribed to Premium', time: '2 weeks ago', type: 'subscription' },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Activity className="w-4 h-4 text-[#007BFF] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#1e293b]">{activity.action}</p>
                <p className="text-xs text-[#64748b] mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}