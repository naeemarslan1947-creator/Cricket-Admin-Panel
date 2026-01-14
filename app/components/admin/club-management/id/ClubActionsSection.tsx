import { 
  Edit, 
  Link2, 
  Trophy, 
  Users, 
  AlertTriangle, 
  Trash2,
  ShieldCheck 
} from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

interface ClubActionsSectionProps {
  onEditProfile: () => void;
  onSendInvite: () => void;
  onManageAchievements: () => void;
  onViewPlayers: () => void;
  onOverrideStatus: () => void;
  onDeleteClub: () => void;
  onVerifyClub?: () => void;
  isClubVerified?: boolean;
}

export default function ClubActionsSection({
  onEditProfile,
  onSendInvite,
  onManageAchievements,
  onViewPlayers,
  onOverrideStatus,
  onDeleteClub,
  onVerifyClub,
  isClubVerified = false,
}: ClubActionsSectionProps) {
  return (
    <Card className="border-slate-200  overflow-hidden">
      <div className="px-6 py-5 bg-white border-b border-slate-100">
        <h3 className="text-base font-medium text-[#0f172a]">Quick Actions</h3>
        <p className="text-sm text-[#64748b] mt-1">Manage club settings and permissions</p>
      </div>
      <CardContent className="p-6">
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={onEditProfile}
              className="h-12 bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              onClick={onSendInvite}
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link2 className="w-4 h-4 mr-2" />
              Send Invite
            </Button>
          </div>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={onManageAchievements}
              variant="outline"
              className="h-11 border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Manage Achievements
            </Button>
            <Button 
              onClick={onViewPlayers}
              variant="outline"
              className="h-11 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Users className="w-4 h-4 mr-2" />
              View Players
            </Button>
          </div>

          {!isClubVerified && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onVerifyClub}
                variant="outline"
                className="h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verify Club
              </Button>
            </div>
          )}

          {/* Danger Zone */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-[#64748b] mb-3 uppercase tracking-wider">Danger Zone</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onOverrideStatus}
                variant="outline"
                className="h-11 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Override Status
              </Button>
              <Button 
                onClick={onDeleteClub}
                variant="outline"
                className="h-11 border-red-200 text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Club
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}