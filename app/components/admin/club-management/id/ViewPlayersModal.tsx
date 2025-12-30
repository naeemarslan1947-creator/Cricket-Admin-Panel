import { useState } from 'react';
import { Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
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

interface ViewPlayersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players?: Player[];
}

const mockPlayers = [
  { id: 1, name: 'Joe Root', role: 'Player', joinDate: 'Jan 2024', status: 'Active' },
  { id: 2, name: 'Ben Stokes', role: 'Captain', joinDate: 'Feb 2024', status: 'Active' },
  { id: 3, name: 'James Anderson', role: 'Player', joinDate: 'Mar 2024', status: 'Active' },
  { id: 4, name: 'Jonny Bairstow', role: 'Wicket Keeper', joinDate: 'Jan 2024', status: 'Active' },
  { id: 5, name: 'Moeen Ali', role: 'Player', joinDate: 'Apr 2024', status: 'Active' },
  { id: 6, name: 'Jos Buttler', role: 'Wicket Keeper', joinDate: 'Feb 2024', status: 'Active' },
  { id: 7, name: 'Stuart Broad', role: 'Player', joinDate: 'Mar 2024', status: 'Active' },
  { id: 8, name: 'Jofra Archer', role: 'Player', joinDate: 'Jan 2024', status: 'Active' },
  { id: 9, name: 'Mark Wood', role: 'Player', joinDate: 'Apr 2024', status: 'Active' },
  { id: 10, name: 'Jason Roy', role: 'Player', joinDate: 'May 2024', status: 'Active' },
  { id: 11, name: 'Chris Woakes', role: 'Player', joinDate: 'Feb 2024', status: 'Active' },
  { id: 12, name: 'Adil Rashid', role: 'Player', joinDate: 'Mar 2024', status: 'Active' },
  { id: 13, name: 'Sam Curran', role: 'Player', joinDate: 'Apr 2024', status: 'Active' },
  { id: 14, name: 'Dawid Malan', role: 'Player', joinDate: 'Jan 2024', status: 'Active' },
  { id: 15, name: 'Ollie Pope', role: 'Player', joinDate: 'May 2024', status: 'Active' },
  { id: 16, name: 'Liam Livingstone', role: 'Player', joinDate: 'Feb 2024', status: 'Active' },
  { id: 17, name: 'Tom Curran', role: 'Player', joinDate: 'Mar 2024', status: 'Active' },
  { id: 18, name: 'Harry Brook', role: 'Player', joinDate: 'Apr 2024', status: 'Active' },
  { id: 19, name: 'Reece Topley', role: 'Player', joinDate: 'Jan 2024', status: 'Active' },
  { id: 20, name: 'Phil Salt', role: 'Player', joinDate: 'May 2024', status: 'Active' },
];

export default function ViewPlayersModal({ open, onOpenChange, players }: ViewPlayersModalProps) {
  const [playerSearch, setPlayerSearch] = useState('');
  const [playerCurrentPage, setPlayerCurrentPage] = useState(1);
  const playersPerPage = 10;

  // Get player name from nested structure
  const getPlayerName = (player: any): string => {
    if (typeof player.name === 'string') {
      return player.name;
    }
    if (typeof player.user_id === 'object' && player.user_id?.full_name) {
      return player.user_id.full_name;
    }
    return 'Unknown Player';
  };

  // Determine which data to display
  const displayPlayers = players && players.length > 0 ? players : mockPlayers;

  // Filter and paginate players
  const filteredPlayers = displayPlayers.filter(player =>
    getPlayerName(player).toLowerCase().includes(playerSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = (playerCurrentPage - 1) * playersPerPage;
  const endIndex = startIndex + playersPerPage;
  const paginatedPlayers = filteredPlayers.slice(startIndex, endIndex);

  const handlePlayerPageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPlayerCurrentPage(newPage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Club Members
          </DialogTitle>
          <DialogDescription>
            All registered players and team members
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="player-search"
                value={playerSearch}
                onChange={(e) => {
                  setPlayerSearch(e.target.value);
                  setPlayerCurrentPage(1); // Reset to first page on search
                }}
                placeholder="Search by name or role..."
                className="pl-10"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Matches Played</TableHead>
                <TableHead>Matches Won</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlayers.map((player: any) => (
                <TableRow key={player.id || player._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 via-blue-100 to-white flex items-center justify-center text-blue-700 border border-blue-200">
                        {getPlayerName(player).charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium">{getPlayerName(player)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-[#64748b]">{player.mathes_played || 0}</TableCell>
                  <TableCell className="text-sm text-[#64748b]">{player.matches_won || 0}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <Button
              onClick={() => handlePlayerPageChange(playerCurrentPage - 1)}
              disabled={playerCurrentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <div className="text-sm text-[#64748b]">
              Page {playerCurrentPage} of {totalPages}
            </div>
            <Button
              onClick={() => handlePlayerPageChange(playerCurrentPage + 1)}
              disabled={playerCurrentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}