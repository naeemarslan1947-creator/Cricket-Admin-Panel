'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Star, Users, MapPin, Shield } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
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

interface ClubsManagementGridProps {
  clubs: Club[];
}

export default function ClubsManagementGrid({ clubs }: ClubsManagementGridProps) {
  const router = useRouter();

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

  const handleRedirect = (clubId: number) => {
    router.push(`/club-management/${clubId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club) => (
        <Card
          key={club.id}
          className="border-[#e2e8f0]  hover:shadow-md transition-all cursor-pointer overflow-hidden"
          onClick={() => handleRedirect(club.id)}
        >
          <CardContent className="p-6">
            {/* Header - Logo, Name, Location, Status */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-slate-800 to-slate-700 flex items-center justify-center shrink-0 shadow-md">
                <Shield className="w-10 h-10 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[#0f172a] mb-2 leading-tight">
                  {club.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[#64748b] mb-3">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{club.location}</span>
                </div>
                {getStatusBadge(club.status)}
              </div>
            </div>

            {/* League Info & Stats */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[#64748b] mb-1">League Tier</p>
                  <p className="text-sm font-medium text-[#0f172a]">Regional League</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-[#0f172a]">{club.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-lg font-semibold text-[#0f172a]">{club.members} Players</p>
                  <p className="text-xs text-[#64748b]">Members</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.stopPropagation(); // prevent card click
                handleRedirect(club.id);
              }}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Manage Club
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
