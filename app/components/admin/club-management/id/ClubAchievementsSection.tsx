import { Trophy } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Plus } from 'lucide-react';

interface ClubAchievementsSectionProps {
  club: any;
  onAddAchievement: () => void;
}

export default function ClubAchievementsSection({ 
  club, 
  onAddAchievement 
}: ClubAchievementsSectionProps) {
  const achievements = club.achievements || [];

  return (
    <Card className="border-slate-200  overflow-hidden">
      <div className="px-6 py-5 bg-linear-to-br from-amber-50 to-white border-b border-amber-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              Achievements & Awards
            </h3>
            <p className="text-sm text-[#64748b] mt-1">Club accomplishments and recognition</p>
          </div>
          <Button
            onClick={onAddAchievement}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        {achievements.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-[#64748b]">No achievements added yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {achievements.map((achievement: any, index: number) => (
              <AchievementCard key={index} achievement={achievement} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AchievementCard({ achievement }: { achievement: any }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-linear-to-br from-amber-50 to-white rounded-xl border border-amber-100">
      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
        <Trophy className="w-6 h-6 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-[#0f172a] mb-1">{achievement.title}</h4>
            <p className="text-xs text-[#64748b] mb-2">{achievement.description}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-700">{achievement.year}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}