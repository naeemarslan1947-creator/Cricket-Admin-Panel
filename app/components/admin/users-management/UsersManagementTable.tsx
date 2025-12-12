"use client";

import { Edit, MoreVertical, Star, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Badge } from '../../ui/badge';
import { User } from '../../../types/users'; 
import { useRouter } from "next/navigation";

interface UsersManagementTableProps {
  users: User[];
}

export default function UsersManagementTable({ users }: UsersManagementTableProps) {
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'Suspended':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>;
      case 'Pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
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

  return (
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
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => router.push(`/users-management/${user.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center text-slate-700 border border-slate-200">
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
                         <DropdownMenuItem onClick={() => router.push(`/users-management/${user.id}`)}>        
                          <Edit className="w-4 h-4 mr-2" />
                           View Detail
                          </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    // <Card className="border-[#e2e8f0]">
    //   <CardHeader>
    //     <CardTitle className="text-[#1e293b]">All Users</CardTitle>
    //     <p className="text-sm text-[#64748b]">Showing 5 of 24,583 users</p>
    //   </CardHeader>

    //   <CardContent>
    //     <Table>
    //       <TableHeader>
    //         <TableRow>
    //           <TableHead>Name</TableHead>
    //           <TableHead>Email</TableHead>
    //           <TableHead>Account Type</TableHead>
    //           <TableHead>Linked Club</TableHead>
    //           <TableHead>Status</TableHead>
    //           <TableHead>Last Active</TableHead>
    //           <TableHead className="text-right">Actions</TableHead>
    //         </TableRow>
    //       </TableHeader>

    //       <TableBody>
    //         {users.map((user) => (
    //           <TableRow key={user.id} className="hover:bg-[#F8FAFC]">
    //             <TableCell>
    //               <div className="flex items-center gap-3">
    //                 <div className="w-8 h-8 rounded-full from-[#00C853] to-[#007BFF] flex items-center justify-center text-white text-sm">
    //                   {user.name.charAt(0)}
    //                 </div>
    //                 <span className="text-[#1e293b]">{user.name}</span>
    //               </div>
    //             </TableCell>

    //             <TableCell className="text-[#64748b]">{user.email}</TableCell>

    //             <TableCell>{getRoleBadge(user.role)}</TableCell>

    //             <TableCell className="text-[#64748b]">{user.club}</TableCell>

    //             <TableCell>{getStatusBadge(user.status)}</TableCell>

    //             <TableCell className="text-[#64748b]">{user.lastActive}</TableCell>

    //             <TableCell className="text-right">
    //               <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                   <Button variant="ghost" size="icon">
    //                     <MoreVertical className="w-4 h-4" />
    //                   </Button>
    //                 </DropdownMenuTrigger>

    //                 <DropdownMenuContent align="end">
    //                   <DropdownMenuItem onClick={() => router.push(`/users-management/${user.id}`)}>
    //                     View Profile
    //                   </DropdownMenuItem>

    //                   <DropdownMenuItem>
    //                     Suspend User
    //                   </DropdownMenuItem>

    //                   <DropdownMenuItem>
    //                     Reset Password
    //                   </DropdownMenuItem>

    //                   <DropdownMenuItem className="text-red-600">
    //                     Ban User
    //                   </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //               </DropdownMenu>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>

    //     </Table>
    //   </CardContent>
    // </Card>
  );
}
