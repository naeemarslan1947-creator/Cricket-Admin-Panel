"use client";

import { Edit, MoreVertical, Star, Trash2, Ban } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Badge } from '../../ui/badge';
import { User } from '../../../types/users'; 
import { useRouter } from "next/navigation";
import { useState } from 'react';
import SuspendDialog from '../users-management/id/SuspendDialog';
import DeleteDialog from '../users-management/id/DeleteDialog';
import Pagination from '../../common/Pagination';

interface UsersManagementTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;
  onUserUpdated?: () => void;
}

export default function UsersManagementTable({ 
  users, 
  currentPage, 
  totalPages, 
  totalRecords, 
  limit, 
  onPageChange,
  onUserUpdated,
}: UsersManagementTableProps) {
  const router = useRouter();
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'Suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      case 'Deleted':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Deleted</Badge>;
      case 'Pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Deleted</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  const getSubscriptionBadge = (subscription: string) => {
    return subscription === 'Premium' ? (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 border hover:bg-amber-50">
        <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
        Premium
      </Badge>
    ) : (
      <Badge className="bg-slate-50 text-slate-600 border-slate-200 border hover:bg-slate-50">
        Free
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'Player': 'bg-blue-100 text-blue-800',
      'Club Admin': 'bg-purple-100 text-purple-800',
      'Youth': 'bg-green-100 text-green-800',
      'Parent': 'bg-orange-100 text-orange-800',
    };
    
    const colorClass = colors[role] || 'bg-gray-100 text-gray-800';
    
    return <Badge className={`${colorClass} hover:${colorClass.split(' ')[0]}`}>{role}</Badge>;
  };

  const isUserAccessible = (user: User) => {
    return user.status !== 'Deleted' && user.status !== 'Suspended';
  };

  const handleSuspend = (user: User) => {
    setSelectedUser(user);
    setSuspendDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <Card className="border-[#e2e8f0] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">All Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow 
                  key={user.id} 
                  className={isUserAccessible(user) ? "cursor-pointer hover:bg-slate-50" : "cursor-not-allowed opacity-60 hover:bg-slate-50"}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center text-slate-700 border border-slate-200">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[#1e293b]">{user.name}</div>
                        <div className="text-sm text-[#64748b]">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getSubscriptionBadge(user.subscription)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-[#64748b]">{user.club}</TableCell>
                  <TableCell className="text-[#64748b]">{user.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isUserAccessible(user) ? (
                          <DropdownMenuItem onClick={() => router.push(`/users-management/${user.id}`)}>        
                            <Edit className="w-4 h-4 mr-2" />
                            View Detail
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>        
                            <Edit className="w-4 h-4 mr-2" />
                            View Detail (Unavailable)
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.status === "Suspended" ? (
                          <DropdownMenuItem 
                            className="text-green-600"
                            onClick={() => handleSuspend(user)}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Activate Account
                          </DropdownMenuItem>
                        ) : user.status === "Deleted" ? (
                          <DropdownMenuItem disabled>
                            <Ban className="w-4 h-4 mr-2" />
                            Cannot Modify (Deleted)
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="text-orange-600"
                            onClick={() => handleSuspend(user)}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {user.status !== "Deleted" && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalRecords > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              limit={limit}
              onPageChange={onPageChange}
            />
          )}
        </CardContent>
      </Card>
      
      {selectedUser && (
        <>
          <SuspendDialog
            open={suspendDialogOpen}
            onOpenChange={setSuspendDialogOpen}
            selectedUser={selectedUser}
            suspendReason=""
            onSuccess={onUserUpdated}
          />
          <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            selectedUser={selectedUser}
            onSuccess={onUserUpdated}
          />
        </>
      )}
    </>
  );
}
