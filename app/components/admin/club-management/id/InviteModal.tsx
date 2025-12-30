import { useState, useEffect } from 'react';
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
import makeRequest from '@/Api\'s/apiHelper';
import { GetInvitationLink, SendInvitationLink } from '@/Api\'s/repo';
import { toastSuccess, toastError } from '@/app/helper/toast';
import type { ApiResponse } from '@/Api\'s/types';

interface InviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId: number;
}

export default function InviteModal({ open, onOpenChange, clubId }: InviteModalProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  // Fetch invitation link when modal opens
  useEffect(() => {
    if (open && !inviteLink) {
      const fetchLink = async () => {
        try {
          setLoading(true);

          const response = await makeRequest<ApiResponse>({
            url: GetInvitationLink,
            method: 'GET',
            params: { user_id: clubId }
          });

          if (response.data?.success) {
            // API returns the link directly in result field as a string
            const link = (response.data?.result as string) || '';
            
            if (link && typeof link === 'string' && link.length > 0) {
              setInviteLink(link);
              toastSuccess('Invitation link loaded');
            } else {
              toastError('No invitation link found in response');
            }
          } else {
            toastError((response.data?.message as string) || 'Failed to load invitation link');
          }
        } catch (err) {
          console.error('Error fetching invitation link:', err);
          toastError('Failed to load invitation link. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchLink();
    }
  }, [open, inviteLink, clubId]);

  

  const handleCopyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      toastSuccess('Invite link copied to clipboard');
    }
  };

  const handleSendInviteEmail = async () => {
    if (!inviteEmail) {
      toastError('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toastError('Please enter a valid email address');
      return;
    }

    try {
      setSending(true);

      const response = await makeRequest<ApiResponse>({
        url: SendInvitationLink,
        method: 'POST',
        data: {
          user_id: clubId.toString(),
          email: inviteEmail,
        },
      });

      if (response.data?.success) {
        toastSuccess(`Invite sent to ${inviteEmail}`);
        setInviteEmail('');
      } else {
        toastError((response.data?.message as string) || 'Failed to send invitation');
      }
    } catch (err) {
      console.error('Error sending invitation:', err);
      toastError('Failed to send invitation. Please try again.');
    } finally {
      setSending(false);
    }
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-slate-600">Loading invitation link...</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={inviteLink || 'No invitation link available'}
                  readOnly
                  className="flex-1"
                />
                
              </div>
            )}
            {inviteLink && !loading && (
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
                disabled={sending}
              />
              <Button 
                onClick={handleSendInviteEmail} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={sending}
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Sending...' : 'Send'}
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