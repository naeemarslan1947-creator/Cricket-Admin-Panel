import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Plus } from 'lucide-react';
import { ClubDetail, ClubMilestone } from '@/app/types/clubs';

interface ClubMilestonesSectionProps {
  club: ClubDetail;
  onAddMilestone: () => void;
}

export default function ClubMilestonesSection({ 
  club, 
  onAddMilestone 
}: ClubMilestonesSectionProps) {
  const milestones = club.milestones || [];

  return (
    <Card className="border-slate-200  overflow-hidden">
      <div className="px-6 py-5 bg-linear-to-br from-amber-50 to-white border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Milestones & Achievements
            </h3>
            <p className="text-sm text-[#64748b] mt-1">Club accomplishments and recognition</p>
          </div>
          <Button
            onClick={onAddMilestone}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        {milestones.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-[#64748b]">No milestones added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone: ClubMilestone, index: number) => (
              <MilestoneCard key={milestone._id || index} milestone={milestone} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MilestoneCard({ milestone }: { milestone: ClubMilestone }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-linear-to-br from-amber-50 to-white rounded-xl border border-amber-100">
      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
        <Trophy className="w-6 h-6 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-[#0f172a] mb-1">{milestone.title}</h4>
            <p className="text-xs text-[#64748b] mb-2">{milestone.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-700">{milestone.season}</span>
              {milestone.category && (
                <>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-600">{milestone.category}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}