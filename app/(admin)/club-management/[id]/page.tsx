"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import makeRequest from '@/Api\'s/apiHelper';
import { GetClubById, updateClubProfile } from '@/Api\'s/repo';
import { toastSuccess, toastError } from '@/app/helper/toast';
import type { ApiResponse } from '@/Api\'s/types';
import { ClubDetail, mapGetClubByIdResponseToDetail, GetClubByIdResponse } from '@/app/types/clubs';
import ClubInfoSection from '@/app/components/admin/club-management/id/ClubInfoSection';
import ClubMilestonesSection from '@/app/components/admin/club-management/id/ClubAchievementsSection';
import ClubPlayersSection from '@/app/components/admin/club-management/id/ClubPlayersSection';
import ClubActionsSection from '@/app/components/admin/club-management/id/ClubActionsSection';
import EditProfileModal from '@/app/components/admin/club-management/id/EditProfileModal';
import AchievementsModal from '@/app/components/admin/club-management/id/AchievementsModal';
import InviteModal from '@/app/components/admin/club-management/id/InviteModal';
import ViewPlayersModal from '@/app/components/admin/club-management/id/ViewPlayersModal';
import OverrideStatusModal from '@/app/components/admin/club-management/id/OverrideStatusModal';
import DeleteClubModal from '@/app/components/admin/club-management/id/DeleteClubModal';
import VerifyClubModal from '@/app/components/admin/club-management/id/VerifyClubModal';
import { Button } from '@/app/components/ui/button';

interface EditForm {
  name: string;
  address: string;
  description: string;
  division: string;
}

export default function ClubProfilePage() {
  const params = useParams();
  const router = useRouter();
  const clubId = params.id as string;
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [inviteLinkOpen, setInviteLinkOpen] = useState(false);
  const [viewPlayersOpen, setViewPlayersOpen] = useState(false);
  const [overrideStatusOpen, setOverrideStatusOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [verifyClubOpen, setVerifyClubOpen] = useState(false);

  // Form state
  const [editForm, setEditForm] = useState<EditForm>({ 
    name: '', 
    address: '', 
    description: '', 
    division: ''
  });
  const [deleting, setDeleting] = useState(false);
  const [overridingStatus, setOverridingStatus] = useState(false);
  const [verifying, setVerifying] = useState(false);

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
          address: clubDetail.address,
          description: clubDetail.bio,
          division: clubDetail.division,
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

  const handleDeleteClub = async () => {
    if (!club) return;

    try {
      setDeleting(true);
      
      const response = await makeRequest<ApiResponse>({
        url: updateClubProfile,
        method: 'POST',
        data: {
          user_id: clubId,
          action_type: 3,
        },
      });

      if (response.data?.success) {
        toastSuccess('Club deleted successfully');
        setDeleteDialogOpen(false);
        router.back();
      } else {
        toastError((response.data?.message as string) || 'Failed to delete club');
      }
    } catch (err) {
      console.error('Error deleting club:', err);
      toastError('Failed to delete club. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleOverrideStatus = async (status: 'active' | 'suspended') => {
    if (!club) return;

    try {
      setOverridingStatus(true);
      
      const actionType = status === 'active' ? 1 : 4;
      
      const response = await makeRequest<ApiResponse>({
        url: updateClubProfile,
        method: 'POST',
        data: {
          user_id: clubId,
          action_type: actionType,
        },
      });

      if (response.data?.success) {
        const statusText = status === 'active' ? 'activated' : 'suspended';
        toastSuccess(`Club ${statusText} successfully`);
        setOverrideStatusOpen(false);
        // Refresh club details to show updated status
        await fetchClubDetails();
      } else {
        toastError((response.data?.message as string) || `Failed to ${status} club`);
      }
    } catch (err) {
      console.error('Error updating club status:', err);
      toastError('Failed to update club status. Please try again.');
    } finally {
      setOverridingStatus(false);
    }
  };

  const handleUpdateClubProfile = async () => {
    if (!club) return;

    try {
      setUpdating(true);
      
      const response = await makeRequest<ApiResponse>({
        url: updateClubProfile,
        method: 'POST',
        data: {
          user_id: clubId,
          club_name: editForm.name,
          address: editForm.address,
          division: editForm.division,
          bio: editForm.description,
        },
      });

      if (response.data?.success) {
        toastSuccess('Club profile updated successfully');
        setEditProfileOpen(false);
        // Refresh club details to show updated information
        await fetchClubDetails();
      } else {
        toastError((response.data?.message as string) || 'Failed to update club profile');
      }
    } catch (err) {
      console.error('Error updating club profile:', err);
      toastError('Failed to update club profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyClub = async () => {
    if (!club) return;

    try {
      setVerifying(true);
      
      const response = await makeRequest<ApiResponse>({
        url: updateClubProfile,
        method: 'POST',
        data: {
          user_id: clubId,
          is_club_verified: true,
        },
      });

      if (response.data?.success) {
        toastSuccess('Club verified successfully');
        // Refresh club details to show updated verification status
        await fetchClubDetails();
      } else {
        toastError((response.data?.message as string) || 'Failed to verify club');
      }
    } catch (err) {
      console.error('Error verifying club:', err);
      toastError('Failed to verify club. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (clubId) {
      fetchClubDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <ClubMilestonesSection 
              club={club}
              onAddMilestone={() => setAchievementsOpen(true)}
            />
            <ClubPlayersSection 
              onViewAll={() => setViewPlayersOpen(true)}
              teams={club?.teams}
            />
            <ClubActionsSection 
              onEditProfile={() => setEditProfileOpen(true)}
              onSendInvite={() => setInviteLinkOpen(true)}
              onManageAchievements={() => setAchievementsOpen(true)}
              onViewPlayers={() => setViewPlayersOpen(true)}
              onOverrideStatus={() => setOverrideStatusOpen(true)}
              onDeleteClub={() => setDeleteDialogOpen(true)}
              onVerifyClub={() => setVerifyClubOpen(true)}
              isClubVerified={club.isClubVerified}
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
        onSave={handleUpdateClubProfile}
        isLoading={updating}
      />

      <AchievementsModal
        milestones={club.milestones}
        open={achievementsOpen}
        onOpenChange={setAchievementsOpen}
        clubId={clubId}
        onMilestoneAdded={fetchClubDetails}
      />

      <InviteModal
        open={inviteLinkOpen}
        onOpenChange={setInviteLinkOpen}
        clubId={clubId as unknown as number}
      />

      <ViewPlayersModal
        open={viewPlayersOpen}
        onOpenChange={setViewPlayersOpen}
        players={club?.players}
      />

      <OverrideStatusModal
        open={overrideStatusOpen}
        onOpenChange={setOverrideStatusOpen}
        clubName={club.clubName}
        onStatusChange={handleOverrideStatus}
        isLoading={overridingStatus}
      />

      <DeleteClubModal
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        clubName={club.clubName}
        onDelete={handleDeleteClub}
        isLoading={deleting}
      />

      <VerifyClubModal
        open={verifyClubOpen}
        onOpenChange={setVerifyClubOpen}
        clubName={club.clubName}
        onVerify={handleVerifyClub}
        isLoading={verifying}
      />
    </div>
  );
}
