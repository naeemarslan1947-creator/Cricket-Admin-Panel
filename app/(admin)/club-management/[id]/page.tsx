"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import makeRequest from '@/Api\'s/apiHelper';
import { GetClubById } from '@/Api\'s/repo';
import { ClubDetail, mapGetClubByIdResponseToDetail, GetClubByIdResponse } from '@/app/types/clubs';
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

interface EditForm {
  name: string;
  location: string;
  description: string;
  rating: string;
}

export default function ClubProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.id as string;
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    const fetchClubDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await makeRequest<GetClubByIdResponse>({
          url: GetClubById,
          method: 'GET',
          params: { user_id: clubId }
        });

        if (response.data && response.data.success && response.data.result) {
          // Map API response to ClubDetail
          const clubDetail = mapGetClubByIdResponseToDetail(response.data);
          setClub(clubDetail);

          setEditForm({
            name: clubDetail.clubName,
            location: clubDetail.location,
            description: clubDetail.bio,
            rating: clubDetail.rating.toString()
          });
        } else {
          setError('Failed to load club details');
        }
      } catch (err) {
        console.error('Error fetching club details:', err);
        setError('Failed to load club details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClubDetails();
    }
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

  if (!club || error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-700">{error || 'Club not found'}</p>
          <Button onClick={() => router.back()} className="mt-4">
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
              onClick={() => router.back()}
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
        clubId={clubId as unknown as number}
      />

      <ViewPlayersModal
        open={viewPlayersOpen}
        onOpenChange={setViewPlayersOpen}
      />

      <OverrideStatusModal
        open={overrideStatusOpen}
        onOpenChange={setOverrideStatusOpen}
        clubName={club.clubName}
      />

      <DeleteClubModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        clubName={club.clubName}
        onDelete={() => {
          setDeleteDialogOpen(false);
          router.back();
        }}
      />
    </div>
  );
}
