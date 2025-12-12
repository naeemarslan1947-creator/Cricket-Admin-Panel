import { MapPin, CheckCircle, Star, Shield, BarChart3 } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';

interface ClubInfoSectionProps {
  club: any;
}

export default function ClubInfoSection({ club }: ClubInfoSectionProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Verified':
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border hover:bg-emerald-50">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            {status}
          </Badge>
        );
      case 'Pending':
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 border hover:bg-amber-50">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            {status}
          </Badge>
        );
      case 'Hidden':
        return (
          <Badge className="bg-slate-50 text-slate-600 border-slate-200 border hover:bg-slate-50">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5" />
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      {/* Club Card */}
      <Card className="border-slate-200  overflow-hidden">
        <div className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50/30 px-6 pt-8 pb-6">
          <div className="flex flex-col items-center text-center">
            {/* Club Logo/Icon */}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-200 via-emerald-100 to-white flex items-center justify-center text-emerald-700 text-5xl border-2 border-white shadow-lg ring-1 ring-emerald-200/50">
                {club.name.charAt(0)}
              </div>
              {club.verified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center border-2 border-white shadow-md">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Name & Location */}
            <h2 className="text-2xl text-[#0f172a] mb-2 tracking-tight">
              {club.name}
            </h2>
            <div className="flex items-center gap-2 text-[#64748b] text-sm mb-3">
              <MapPin className="w-4 h-4" />
              {club.location}
            </div>
            <div className="text-xs text-[#64748b] mb-4">
              ID: #{club.id.toString().padStart(4, '0')}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {getStatusBadge(club.status)}
              {club.verified && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 border hover:bg-blue-50">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-xl font-semibold text-[#0f172a]">{club.rating}</span>
              <span className="text-sm text-[#64748b]">/5.0</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-px bg-slate-200 border-t border-slate-200">
          <div className="bg-white px-4 py-4 text-center">
            <div className="text-2xl font-medium text-[#0f172a] mb-1">{club.members}</div>
            <div className="text-xs text-[#64748b]">Members</div>
          </div>
          <div className="bg-white px-4 py-4 text-center">
            <div className="text-2xl font-medium text-[#0f172a] mb-1">{club.teams}</div>
            <div className="text-xs text-[#64748b]">Teams</div>
          </div>
        </div>
      </Card>

      {/* Description Card */}
      <Card className="border-slate-200  overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
          <h3 className="text-sm font-medium text-[#0f172a] flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-600" />
            About Club
          </h3>
        </div>
        <CardContent className="p-5">
          <p className="text-sm text-[#64748b] leading-relaxed">
            {club.description}
          </p>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card className="border-slate-200  overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-br from-purple-50 to-white border-b border-purple-100">
          <h3 className="text-sm font-medium text-[#0f172a] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            Performance Metrics
          </h3>
        </div>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b]">Member Growth</span>
              <span className="text-sm font-medium text-emerald-600">+24%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b]">Engagement Rate</span>
              <span className="text-sm font-medium text-blue-600">82%</span>
            </div>
            <Progress value={82} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#64748b]">Activity Level</span>
              <span className="text-sm font-medium text-purple-600">High</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </>
  );
}