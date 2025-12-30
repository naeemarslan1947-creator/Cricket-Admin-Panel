import { useState } from 'react';
import { Trophy, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import makeRequest from '@/Api\'s/apiHelper';
import { PostClubMilestone } from '@/Api\'s/repo';
import { toastSuccess, toastError } from '@/app/helper/toast';
import type { ApiResponse } from '@/Api\'s/types';

interface Milestone {
  _id: string;
  club_id: string;
  title: string;
  season: string;
  description: string;
  action_type: number;
  updated_at: string;
  created_at: string;
  __v?: number;
  profile_pic?: string;
  cover_pic?: string;
  category?: string;
}

interface AchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clubId?: string;
  milestones?: Milestone[];
  onMilestoneAdded?: () => Promise<void>;
}


export default function AchievementsModal({ open, onOpenChange, clubId, milestones = [], onMilestoneAdded }: AchievementsModalProps) {
  const [achievements, setAchievements] = useState<Milestone[]>(milestones);
  
  const [newAchievement, setNewAchievement] = useState({ 
    title: '', 
    season: '', 
    description: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAddAchievement = async () => {
    if (!newAchievement.title || !newAchievement.season) {
      toastError('Please fill in required fields');
      return;
    }

    if (!clubId) {
      toastError('Club ID is missing');
      return;
    }

    try {
      setSubmitting(true);

      const response = await makeRequest<ApiResponse<Milestone>>({
        url: PostClubMilestone,
        method: 'POST',
        data: {
          club_id: clubId,
          title: newAchievement.title,
          season: newAchievement.season,
          description: newAchievement.description || '',
        },
      });

      if (response.data?.success) {
        toastSuccess('Achievement added successfully');
        const newMilestone: Milestone = {
          _id: (response.data.data as unknown as Milestone)?._id || '',
          club_id: clubId,
          title: newAchievement.title,
          season: newAchievement.season,
          description: newAchievement.description || '',
          action_type: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          __v: 0,
        };
        setAchievements([...achievements, newMilestone]);
        setNewAchievement({ title: '', season: '', description: '' });
        onOpenChange(false)
        
        // Refetch club details to update the detailed page in real time
        if (onMilestoneAdded) {
          await onMilestoneAdded();
        }
      } else {
        toastError((response.data?.message as string) || 'Failed to add achievement');
      }
    } catch (err) {
      console.error('Error adding achievement:', err);
      toastError('Failed to add achievement. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Manage Milestones
          </DialogTitle>
          <DialogDescription>
            Add or remove club Milestones and awards
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Add New Achievement */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-medium text-[#0f172a] mb-4">Add New Achievement</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    placeholder="e.g., State Champions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Season *</Label>
                  <Input
                    id="year"
                    value={newAchievement.season}
                    onChange={(e) => setNewAchievement({ ...newAchievement, season: e.target.value })}
                    placeholder="e.g., 2023-2024"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                  placeholder="Brief description of the achievement"
                  rows={2}
                />
              </div>
              <Button onClick={handleAddAchievement} className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={submitting}>
                <Plus className="w-4 h-4 mr-2" />
                {submitting ? 'Adding...' : 'Add Milestones'}
              </Button>
            </div>
          </div>

          {/* Current Achievements */}
          <div>
            <h4 className="text-sm font-medium text-[#0f172a] mb-3">Current Milestones ({achievements.length})</h4>
            {achievements.length === 0 ? (
              <p className="text-sm text-[#64748b] text-center py-8">No Milestones added yet</p>
            ) : (
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement._id} className="flex items-start justify-between p-4 bg-linear-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200 hover:border-amber-300 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-amber-600" />
                        <p className="text-sm font-semibold text-[#0f172a]">{achievement.title}</p>
                        <span className="inline-block px-2 py-0.5 bg-amber-200 text-amber-800 rounded text-xs font-medium">
                          {achievement.season}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748b] leading-relaxed ml-6">{achievement.description}</p>
                    </div>
                   
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}