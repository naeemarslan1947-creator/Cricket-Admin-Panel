import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Button } from '../../ui/button';

interface UsersManagementFiltersProps {
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function UsersManagementFilters({ roleFilter, setRoleFilter, searchQuery, setSearchQuery }: UsersManagementFiltersProps) {
  return (
    <Card className="border-[#e2e8f0]">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <Input
                placeholder="Search by name, email, or club..."
                className="pl-10 bg-white border-[#e2e8f0]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="player">Player</SelectItem>
              <SelectItem value="club-admin">Club Admin</SelectItem>
              <SelectItem value="youth">Youth</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
            </SelectContent>
          </Select>
          {/* <Button className="bg-[#91C137] hover:bg-[#91C137] text-white">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
