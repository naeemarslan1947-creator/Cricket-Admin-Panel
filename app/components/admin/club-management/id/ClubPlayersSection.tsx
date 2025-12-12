import { Users } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/app/components/ui/table';

interface ClubPlayersSectionProps {
  onViewAll: () => void;
}

const clubPlayers = [
  { id: 1, name: 'Joe Root', role: 'Player', joinDate: 'Jan 2024', status: 'Active' },
  { id: 2, name: 'Ben Stokes', role: 'Captain', joinDate: 'Feb 2024', status: 'Active' },
  { id: 3, name: 'James Anderson', role: 'Player', joinDate: 'Mar 2024', status: 'Active' },
  { id: 4, name: 'Jonny Bairstow', role: 'Wicket Keeper', joinDate: 'Jan 2024', status: 'Active' },
  { id: 5, name: 'Moeen Ali', role: 'Player', joinDate: 'Apr 2024', status: 'Active' },
];

export default function ClubPlayersSection({ onViewAll }: ClubPlayersSectionProps) {
  return (
    <Card className="border-slate-200  overflow-hidden">
      <div className="px-6 py-5 bg-linear-to-br from-blue-50 to-white border-b border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Club Members
            </h3>
            <p className="text-sm text-[#64748b] mt-1">Active players and team members</p>
          </div>
          <Button
            onClick={onViewAll}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            View All
          </Button>
        </div>
      </div>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-200 via-blue-100 to-white flex items-center justify-center text-blue-700 border border-blue-200">
                      {player.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-[#0f172a]">{player.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-[#64748b]">{player.role}</TableCell>
                <TableCell className="text-sm text-[#64748b]">{player.joinDate}</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">
                    {player.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}