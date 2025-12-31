import { Users } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';

interface Player {
  _id: string;
  user_id?: {
    _id: string;
    full_name: string;
    user_name: string;
    email: string;
  } | string;
  matches_won?: number;
  mathes_played?: number;
}

interface Team {
  _id: string;
  name: string;
  category?: string;
  coach_name?: string;
  division?: string;
  players?: Player[];
}

interface ClubPlayersSectionProps {
  onViewAll: () => void;
  teams?: Team[];
}

const mockTeams = [
  { _id: '1', name: 'Elite XI', category: "Men's Team", coach_name: 'John Smith', division: 'International', players: [] },
  { _id: '2', name: 'Youth Squad', category: "Youth Team", coach_name: 'Mike Johnson', division: 'National', players: [] },
  { _id: '3', name: 'Women Warriors', category: "Women's Team", coach_name: 'Sarah Davis', division: 'State', players: [] },
  { _id: '4', name: 'Reserve Team', category: "Men's Team", coach_name: 'Tom Wilson', division: 'District', players: [] },
  { _id: '5', name: 'U-19 Squad', category: "Youth Team", coach_name: 'Chris Brown', division: 'State', players: [] },
];

export default function ClubPlayersSection({  teams }: ClubPlayersSectionProps) {
  const displayTeams = teams && teams.length > 0 ? teams.slice(0, 5) : mockTeams;
  return (
    <Card className="border-slate-200  overflow-hidden">
      <div className="px-6 py-5 bg-linear-to-br from-blue-50 to-white border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Teams
            </h3>
            <p className="text-sm text-[#64748b] mt-1">Club teams and squads</p>
          </div>
         
        </div>
      </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Coach</TableHead>
              <TableHead>Division</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {teams && teams.length === 0 ? (
    <TableRow>
      <TableCell colSpan={4}>
        <div className="py-10 text-center text-sm text-slate-500">
          No teams are currently available.
        </div>
      </TableCell>
    </TableRow>
  ) : (
    displayTeams.map((team: Team) => (
      <TableRow key={team._id}>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-200 via-blue-100 to-white flex items-center justify-center text-blue-700 border border-blue-200">
              {team.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-[#0f172a]">{team.name}</span>
          </div>
        </TableCell>
        <TableCell className="text-sm text-[#64748b]">{team.category}</TableCell>
        <TableCell className="text-sm text-[#64748b]">{team.coach_name}</TableCell>
        <TableCell>
          <Badge className="bg-blue-50 text-blue-700 border-blue-200 border">
            {team.division}
          </Badge>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

        </Table>
      </CardContent>
    </Card>
  );
}