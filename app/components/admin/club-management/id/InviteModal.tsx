import { useState } from 'react';
import { Link2, Send, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId: number;
}

export default function InviteModal({ open, onOpenChange, clubId }: InviteModalProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');

  const handleGenerateInviteLink = () => {
    const link = `https://crickit.app/invite/${clubId}/${Math.random().toString(36).substring(7)}`;
    setInviteLink(link);
  };

  const handleCopyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      // toast.success('Invite link copied to clipboard');
    }
  };

  const handleSendInviteEmail = () => {
    if (!inviteEmail) {
      // toast.error('Please enter an email address');
      return;
    }
    // toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#007BFF]" />
            Send Club Invite
          </DialogTitle>
          <DialogDescription>
            Generate an invite link or send invitation via email
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Invite Link</Label>
            <div className="flex gap-2">
              <Input
                value={inviteLink || 'Click generate to create invite link'}
                readOnly
                className="flex-1"
              />
              <Button onClick={handleGenerateInviteLink} variant="outline">
                Generate
              </Button>
            </div>
            {inviteLink && (
              <Button onClick={handleCopyInviteLink} variant="outline" className="w-full" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-email">Send via Email</Label>
            <div className="flex gap-2">
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="player@example.com"
                className="flex-1"
              />
              <Button onClick={handleSendInviteEmail} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}