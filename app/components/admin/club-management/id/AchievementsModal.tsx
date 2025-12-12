import { useState } from 'react';
import { Trophy, Plus, Trash2 } from 'lucide-react';
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

interface AchievementsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
interface Achievement {
  title: string;
  year: string;
  description?: string; // optional
}


export default function AchievementsModal({ open, onOpenChange }: AchievementsModalProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([
    { title: 'State Champions', year: '2023', description: 'Won state-level tournament' },
    { title: 'Best Cricket Academy', year: '2022', description: 'Awarded by Sports Authority' },
  ]);
  
  const [newAchievement, setNewAchievement] = useState({ 
    title: '', 
    year: '', 
    description: '' 
  });

  const handleAddAchievement = () => {
    if (!newAchievement.title || !newAchievement.year) {
      // toast.error('Please fill in required fields');
      return;
    }
    setAchievements([...achievements, newAchievement]);
    setNewAchievement({ title: '', year: '', description: '' });
    // toast.success('Achievement added successfully');
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
    // toast.success('Achievement removed');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Manage Achievements
          </DialogTitle>
          <DialogDescription>
            Add or remove club achievements and awards
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
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    value={newAchievement.year}
                    onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}
                    placeholder="e.g., 2024"
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
              <Button onClick={handleAddAchievement} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </div>
          </div>

          {/* Current Achievements */}
          <div>
            <h4 className="text-sm font-medium text-[#0f172a] mb-3">Current Achievements</h4>
            {achievements.length === 0 ? (
              <p className="text-sm text-[#64748b] text-center py-4">No achievements added</p>
            ) : (
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0f172a]">{achievement.title}</p>
                      <p className="text-xs text-[#64748b]">{achievement.year} • {achievement.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAchievement(index)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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