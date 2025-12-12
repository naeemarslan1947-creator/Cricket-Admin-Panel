"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ClubInfoSection from '@/app/components/admin/club-management/id/ClubInfoSection';
import ClubAchievementsSection from '@/app/components/admin/club-management/id/ClubAchievementsSection';
import ClubPlayersSection from '@/app/components/admin/club-management/id/ClubPlayersSection';
import ClubActionsSection from '@/app/components/admin/club-management/id/ClubActionsSection';
import EditProfileModal from '@/app/components/admin/club-management/id/EditProfileModal';
import AchievementsModal from '@/app/components/admin/club-management/id/AchievementsModal';
import InviteModal from '@/app/components/admin/club-management/id/InviteModal';
import ViewPlayersModal from '@/app/components/admin/club-management/id/ViewPlayersModal';
import OverrideStatusModal from '@/app/components/admin/club-management/id/OverrideStatusModal';
import DeleteClubModal from '@/app/components/admin/club-management/id/DeleteClubModal';
import { Button } from '@/app/components/ui/button';

export interface Achievement {
  title: string;
  year: string;
  description?: string;
}

export interface Club {
  id: number;
  name: string;
  location: string;
  status: 'Verified' | 'Pending' | 'Hidden';
  rating: number;
  members: number;
  teams: number;
  verified: boolean;
  description: string;
  achievements?: Achievement[];
}

export const clubs: Club[] = [
  {
    id: 1,
    name: 'Mumbai Cricket Club',
    location: 'Mumbai, Maharashtra',
    status: 'Verified',
    rating: 4.8,
    members: 245,
    teams: 8,
    verified: true,
    description: 'Premier cricket club in Mumbai'
  },
  {
    id: 2,
    name: 'Delhi Sports Academy',
    location: 'New Delhi, Delhi',
    status: 'Verified',
    rating: 4.6,
    members: 189,
    teams: 6,
    verified: true,
    description: 'Professional sports training academy'
  },
  {
    id: 3,
    name: 'Bangalore Youth Cricket',
    location: 'Bangalore, Karnataka',
    status: 'Pending',
    rating: 4.2,
    members: 87,
    teams: 3,
    verified: false,
    description: 'Youth development cricket club'
  },
  {
    id: 4,
    name: 'Chennai Cricket Academy',
    location: 'Chennai, Tamil Nadu',
    status: 'Verified',
    rating: 4.9,
    members: 312,
    teams: 12,
    verified: true,
    description: 'Elite cricket training center'
  },
  {
    id: 5,
    name: 'Kolkata Cricket Club',
    location: 'Kolkata, West Bengal',
    status: 'Hidden',
    rating: 3.5,
    members: 45,
    teams: 2,
    verified: false,
    description: 'Local community cricket club'
  },
];

interface EditForm {
  name: string;
  location: string;
  description: string;
  rating: string;
}

export default function ClubProfilePage({ onBack }: { onBack: () => void }) {
  const params = useParams();
  const clubId = parseInt(params.id as string);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [inviteLinkOpen, setInviteLinkOpen] = useState(false);
  const [viewPlayersOpen, setViewPlayersOpen] = useState(false);
  const [overrideStatusOpen, setOverrideStatusOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form state
  const [editForm, setEditForm] = useState<EditForm>({ 
    name: '', 
    location: '', 
    description: '', 
    rating: '' 
  });

  useEffect(() => {
    // Simulate API fetch
    const fetchClub = () => {
      const foundClub = clubs.find(c => c.id === clubId);
      if (foundClub) {
        setClub(foundClub);
        setEditForm({
          name: foundClub.name,
          location: foundClub.location,
          description: foundClub.description,
          rating: foundClub.rating.toString()
        });
      }
      setLoading(false);
    };

    fetchClub();
  }, [clubId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading club data...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-700">Club not found</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl text-[#0f172a]">Club Profile</h1>
              <p className="text-sm text-[#64748b]">View and manage club details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <ClubInfoSection club={club} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <ClubAchievementsSection 
              club={club} 
              onAddAchievement={() => setAchievementsOpen(true)}
            />
            <ClubPlayersSection onViewAll={() => setViewPlayersOpen(true)} />
            <ClubActionsSection 
              onEditProfile={() => setEditProfileOpen(true)}
              onSendInvite={() => setInviteLinkOpen(true)}
              onManageAchievements={() => setAchievementsOpen(true)}
              onViewPlayers={() => setViewPlayersOpen(true)}
              onOverrideStatus={() => setOverrideStatusOpen(true)}
              onDeleteClub={() => setDeleteDialogOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        formData={editForm}
        onFormChange={setEditForm}
        onSave={() => setEditProfileOpen(false)}
      />

      <AchievementsModal
        open={achievementsOpen}
        onOpenChange={setAchievementsOpen}
      />

      <InviteModal
        open={inviteLinkOpen}
        onOpenChange={setInviteLinkOpen}
        clubId={clubId}
      />

      <ViewPlayersModal
        open={viewPlayersOpen}
        onOpenChange={setViewPlayersOpen}
      />

      <OverrideStatusModal
        open={overrideStatusOpen}
        onOpenChange={setOverrideStatusOpen}
        clubName={club.name}
      />

      <DeleteClubModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        clubName={club.name}
        onDelete={() => {
          setDeleteDialogOpen(false);
          onBack();
        }}
      />
    </div>
  );
}
