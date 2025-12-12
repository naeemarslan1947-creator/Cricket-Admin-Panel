import { Download, Filter } from 'lucide-react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Button } from '@/app/components/ui/button';

export function Filters() {
  return (
    <Card className="border-[#e2e8f0] ">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="superadmin">Super Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-actions">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-actions">All Actions</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="navigation">Navigation</SelectItem>
              <SelectItem value="club">Club Management</SelectItem>
              <SelectItem value="user">User Management</SelectItem>
              <SelectItem value="content">Content Moderation</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="7d">
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" className="border-[#e2e8f0]">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}