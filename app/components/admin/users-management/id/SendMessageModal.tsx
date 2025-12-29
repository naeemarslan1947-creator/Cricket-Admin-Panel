"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Mail } from "lucide-react";
import { toastError, toastSuccess } from "@/app/helper/toast";
import { SendUserMessages } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";

interface SendMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  messageForm: {
    subject: string;
    message: string;
  };
  onMessageFormChange: (form: any) => void;
  onSend: () => void;
  selectedUser: {
    id: string | number;
    [key: string]: unknown;
  };
}

export default function SendMessageModal({
  open,
  onOpenChange,
  messageForm,
  onMessageFormChange,
  onSend,
  selectedUser
}: SendMessageModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!selectedUser?.id) {
      toastError("User ID is missing");
      return;
    }

    if (!messageForm.subject.trim()) {
      toastError("Subject is required");
      return;
    }

    if (!messageForm.message.trim()) {
      toastError("Message is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await makeRequest({
        url: SendUserMessages,
        method: "POST",
        data: {
          user_id: selectedUser.id,
          title: messageForm.subject,
          body: messageForm.message,
        },
      });

      if (response.status === 200) {
        toastSuccess("Message sent successfully!");
        onOpenChange(false);
        onMessageFormChange({ subject: "", message: "" });
        onSend?.();
      } else {
        toastError(response.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while sending the message";
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSendMessage} 
            className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 mr-2" />
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
