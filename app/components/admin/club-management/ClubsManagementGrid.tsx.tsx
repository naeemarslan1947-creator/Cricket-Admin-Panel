'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Star, Users, MapPin, Shield, AlertCircle, Lock,  Trophy, Target } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Skeleton } from '../../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import type { Club, ActionType } from '@/app/types/clubs';

interface ClubsManagementGridProps {
  clubs: Club[];
  isLoading?: boolean;
  onOverrideStatus?: (club: Club) => void;
  onRefresh?: () => void;
}

export default function ClubsManagementGrid({ clubs, isLoading = false, onOverrideStatus }: ClubsManagementGridProps) {
  const router = useRouter();

  


 

  const getStatusBadge = (status: string, actionType: ActionType) => {
    if (actionType === 4) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <Lock className="w-3 h-3 mr-1" />
          Suspended
        </Badge>
      );
    }

    // If action_type is 3 (DELETE), show as Deleted
    if (actionType === 3) {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Deleted
        </Badge>
      );
    }

    // Otherwise show the verification status
    switch (status) {
      case 'Verified':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Hidden':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Lock className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        );
      case 'Suspended':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <Lock className="w-3 h-3 mr-1" />
            Suspended
          </Badge>
        );
      case 'Deleted':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            <AlertCircle className="w-3 h-3 mr-1" />
            Deleted
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleRedirect = (clubId: number | string | undefined) => {
    if (clubId) {
      router.push(`/club-management/${clubId}`);
    }
  };

  // Loading skeleton
  if (isLoading && clubs.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-[#e2e8f0]">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Skeleton className="w-20 h-20 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-20 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (!isLoading && clubs.length === 0) {
    return (
      <Card className="border-[#e2e8f0]">
        <CardContent className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-[#cbd5e1]" />
          </div>
          <h3 className="text-lg font-semibold text-[#0f172a] mb-2">No clubs found</h3>
          <p className="text-[#64748b]">Try adjusting your search or filters to find what you&apos;re looking for.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club) => (
        <Card
          key={club._id}
          className="border-[#e2e8f0] hover:shadow-md transition-all cursor-pointer overflow-hidden"
          onClick={() => handleRedirect(club._id)}
        >
          <CardContent className="p-6">
            {/* Header - Logo, Name, Location, Status */}
            <div className="flex items-start gap-4 mb-6">
              {/* Club Logo */}
              <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-slate-800 to-slate-700 flex items-center justify-center shrink-0 shadow-md overflow-hidden relative">
                <Avatar className="w-full h-full rounded-2xl">
                  {club.profilePic && (
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${club.profilePic}`}
                      alt={club.name}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="rounded-2xl bg-transparent text-white text-xl font-bold">
                    {club.name ? club.name.split(' ').map((word: string) => word[0]).join('').slice(0, 2).toUpperCase() : 'C'}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[#0f172a] mb-1 leading-tight">
                  {club.name}
                </h3>
                <p className="text-xs text-[#64748b] mb-2">{club.clubType}</p>
                <div className="flex items-center gap-1.5 text-[#64748b] mb-3">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-sm">{club.location}</span>
                </div>
                {getStatusBadge(club.status, club.actionType)}
              </div>
            </div>

            {/* League Info & Stats */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[#64748b] mb-1">Division</p>
                  <p className="text-sm font-medium text-[#0f172a] truncate max-w-[150px]">
                    {club.division !== 'None' ? club.division : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-[#0f172a]">
                    {club.rating !== null && club.rating !== undefined ? Number(club.rating).toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-lg font-semibold text-[#0f172a]">{club.members}</p>
                  <p className="text-xs text-[#64748b]">Followers</p>
                </div>
              </div>

              {/* Match Stats from API */}
              {(club.matchesWon > 0 || club.matchesPlayed > 0 || club.finalsWon > 0 || club.finalsPlayed > 0) && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <Target className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">
                        {club.matchesWon}/{club.matchesPlayed}
                      </p>
                      <p className="text-xs text-[#64748b]">Matches</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-[#0f172a]">
                        {club.finalsWon}/{club.finalsPlayed}
                      </p>
                      <p className="text-xs text-[#64748b]">Finals</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex gap-3">
           
                <>
                  <Button
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      handleRedirect(club._id);
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Manage Club
                  </Button>
                  {onOverrideStatus && (
                    <Button
                      variant="outline"
                      className="h-12 px-4 border-orange-300 text-orange-600 hover:bg-orange-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOverrideStatus(club);
                      }}
                    >
                      Status
                    </Button>
                  )}
                </>
            </div>
          </CardContent>
        </Card>
      ))}
        </div>
  );
}
