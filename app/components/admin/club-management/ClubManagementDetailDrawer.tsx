import { CheckCircle, Edit, EyeOff, Star } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../ui/sheet';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

interface Club {
  id: number;
  name: string;
  location: string;
  status: 'Verified' | 'Pending' | 'Hidden';
  rating: number;
  members: number;
  teams: number;
  verified: boolean;
  description: string;
}

interface ClubManagementDetailDrawerProps {
  club: Club | null;
  onClose: () => void;
}

export default function ClubManagementDetailDrawer({ club, onClose }: ClubManagementDetailDrawerProps) {
  if (!club) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Pending
          </Badge>
        );
      case 'Hidden':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Hidden
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const reviews = [
    { user: 'Rajesh Kumar', rating: 5, comment: 'Excellent facilities and coaching' },
    { user: 'Anita Sharma', rating: 4, comment: 'Great environment for learning' },
    { user: 'Mike Johnson', rating: 5, comment: 'Best cricket club in the area' }
  ];

  return (
    <Sheet open={!!club} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-start justify-between mb-4">
            <div>
              <SheetTitle className="text-[#1e293b]">{club.name}</SheetTitle>
              <p className="text-sm text-[#64748b] mt-1">{club.location}</p>
            </div>
            {getStatusBadge(club.status)}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Club Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-[#F8FAFC] rounded-lg text-center">
              <p className="text-2xl text-[#1e293b] mb-1">{club.members}</p>
              <p className="text-xs text-[#64748b]">Members</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-lg text-center">
              <p className="text-2xl text-[#1e293b] mb-1">{club.teams}</p>
              <p className="text-xs text-[#64748b]">Teams</p>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-lg text-center">
              <p className="text-2xl text-[#1e293b] mb-1">{club.rating}</p>
              <p className="text-xs text-[#64748b]">Rating</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm text-[#1e293b] mb-2">Description</h3>
            <p className="text-sm text-[#64748b]">{club.description}</p>
          </div>

          {/* Recent Reviews */}
          <div>
            <h3 className="text-sm text-[#1e293b] mb-3">Recent Reviews</h3>
            <div className="space-y-2">
              {reviews.map((review, i) => (
                <div key={i} className="p-3 bg-[#F8FAFC] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#1e293b]">{review.user}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-[#64748b]">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#64748b]">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {club.status === 'Pending' && (
              <Button className="w-full bg-[#00C853] hover:bg-[#00a844] text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Club
              </Button>
            )}
            <Button className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white">
              <Edit className="w-4 h-4 mr-2" />
              Edit Club Details
            </Button>
            <Button variant="outline" className="w-full border-[#e2e8f0]">
              Manage Teams
            </Button>
            <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Club
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}