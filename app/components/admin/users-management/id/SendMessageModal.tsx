"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Mail } from "lucide-react";

interface SendMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageForm: {
    subject: string;
    message: string;
  };
  onMessageFormChange: (form: any) => void;
  onSend: () => void;
  selectedUser: any;
}

export default function SendMessageModal({
  open,
  onOpenChange,
  messageForm,
  onMessageFormChange,
  onSend,
  selectedUser
}: SendMessageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#007BFF]" />
            Send Message
          </DialogTitle>
          <DialogDescription>
            Send a direct message to {selectedUser?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={messageForm.subject}
              onChange={(e) => onMessageFormChange({ ...messageForm, subject: e.target.value })}
              placeholder="Enter message subject"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={messageForm.message}
              onChange={(e) => onMessageFormChange({ ...messageForm, message: e.target.value })}
              placeholder="Type your message here..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSend} className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
            <Mail className="w-4 h-4 mr-2" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}