"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/app/components/ui/sheet";
import { CheckCircle, Mail, TrendingUp, MessageSquare, Star, Flag, User, Shield, BarChart3, FileText, Activity, Edit, KeyRound, Zap, Ban, Trash2 } from "lucide-react";


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  club: string;
  status: string;
  lastActive: string;
  joined: string;
  subscription: string;
}

interface UserProfileDrawerProps {
  selectedUser: User;
  editModalOpen: boolean;
  resetPasswordOpen: boolean;
  sendMessageOpen: boolean;
  suspendDialogOpen: boolean;
  deleteDialogOpen: boolean;
  upgradeDowngradeOpen: boolean;
  viewActivityOpen: boolean;
  onEditUser: () => void;
  onOpenSendMessage: () => void;
  onOpenResetPassword: () => void;
  onOpenViewActivity: () => void;
  onOpenUpgrade: () => void;
  onOpenSuspend: () => void;
  onOpenDelete: () => void;
  onClose: () => void;
}

export default function UserProfileDrawer({
  selectedUser,
  editModalOpen,
  resetPasswordOpen,
  sendMessageOpen,
  suspendDialogOpen,
  deleteDialogOpen,
  upgradeDowngradeOpen,
  viewActivityOpen,
  onClose,
}: UserProfileDrawerProps) {
  
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

  const getSubscriptionBadge = (subscription: string) => {
    switch (subscription) {
      case 'Premium':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Premium</Badge>;
      case 'Basic':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Basic</Badge>;
      case 'None':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">None</Badge>;
      default:
        return <Badge>{subscription}</Badge>;
    }
  };

  return (
    <Sheet open={!!selectedUser && !editModalOpen && !resetPasswordOpen && !sendMessageOpen && !suspendDialogOpen && !deleteDialogOpen && !upgradeDowngradeOpen && !viewActivityOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0">
          {selectedUser && (
            <div className="flex flex-col h-full bg-slate-50">
              {/* Premium Header Section */}
              <div className="relative bg-white border-b border-slate-200">
                {/* Subtle gradient background accent */}
                <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-white to-blue-50/30" />
                
                <div className="relative px-8 pt-8 pb-6">
                  <SheetHeader>
                    <div className="flex items-start gap-6 mb-6">
                      {/* Avatar with premium design */}
                      <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center text-slate-700 text-4xl border-2 border-white shadow-lg ring-1 ring-slate-200/50">
                          {selectedUser.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-white shadow-md">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 pt-1">
                        <SheetTitle className="text-3xl text-[#0f172a] mb-2 tracking-tight">
                          {selectedUser.name}
                        </SheetTitle>
                        <div className="flex items-center gap-3 mb-4">
                          <SheetDescription className="text-[#64748b] text-base flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {selectedUser.email}
                          </SheetDescription>
                          <span className="text-slate-300">•</span>
                          <span className="text-sm text-[#64748b]">ID: #{selectedUser.id.toString().padStart(4, '0')}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getRoleBadge(selectedUser.role)}
                          {getStatusBadge(selectedUser.status)}
                          {getSubscriptionBadge(selectedUser.subscription)}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                      <div className="group">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-medium text-[#0f172a]">142</span>
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <p className="text-xs text-[#64748b] mt-0.5">Total Posts</p>
                      </div>
                      <div className="group">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-medium text-[#0f172a]">89</span>
                          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <p className="text-xs text-[#64748b] mt-0.5">Comments</p>
                      </div>
                      <div className="group">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-medium text-[#0f172a]">23</span>
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                        <p className="text-xs text-[#64748b] mt-0.5">Reviews</p>
                      </div>
                      <div className="group">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-medium text-[#0f172a]">2</span>
                          <Flag className="w-3.5 h-3.5 text-red-500" />
                        </div>
                        <p className="text-xs text-[#64748b] mt-0.5">Reports</p>
                      </div>
                    </div>
                  </SheetHeader>
                </div>
              </div>

              {/* Content Section with Premium Cards */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-8 py-6 space-y-5">
                  
                  {/* Account Overview - 2 Column Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Account Details Card */}
                    <div className="bg-white rounded-xl border border-slate-200  overflow-hidden">
                      <div className="px-5 py-4 bg-linear-to-br from-slate-50 to-white border-b border-slate-100">
                        <h3 className="text-sm font-medium text-[#0f172a] flex items-center gap-2">
                          <User className="w-4 h-4 text-slate-600" />
                          Account Details
                        </h3>
                      </div>
                      <div className="p-5 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#64748b]">Account Type</span>
                          <span className="text-sm font-medium text-[#0f172a]">{selectedUser.role}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                          <span className="text-sm text-[#64748b]">Subscription</span>
                          <span className="text-sm font-medium text-[#0f172a]">{selectedUser.subscription}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                          <span className="text-sm text-[#64748b]">Member Since</span>
                          <span className="text-sm font-medium text-[#0f172a]">{selectedUser.joined}</span>
                        </div>
                      </div>
                    </div>

                    {/* Linked Club Card */}
                    <div className="bg-white rounded-xl border border-slate-200  overflow-hidden">
                      <div className="px-5 py-4 bg-linear-to-br from-blue-50 to-white border-b border-blue-100">
                        <h3 className="text-sm font-medium text-[#0f172a] flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-600" />
                          Club Information
                        </h3>
                      </div>
                      <div className="p-5 space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#64748b]">Linked Club</span>
                          <span className="text-sm font-medium text-[#0f172a]">{selectedUser.club}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                          <span className="text-sm text-[#64748b]">Last Active</span>
                          <span className="text-sm font-medium text-[#0f172a]">{selectedUser.lastActive}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
                          <span className="text-sm text-[#64748b]">Status</span>
                          {getStatusBadge(selectedUser.status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Overview with Progress Bars */}
                  <div className="bg-white rounded-xl border border-slate-200  overflow-hidden">
                    <div className="px-5 py-4 bg-linear-to-br from-emerald-50 to-white border-b border-emerald-100">
                      <h3 className="text-sm font-medium text-[#0f172a] flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-600" />
                        Engagement Analytics
                      </h3>
                    </div>
                    <div className="p-5 space-y-5">
                      {/* Posts */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm text-[#0f172a] font-medium">Posts Created</span>
                          </div>
                          <span className="text-lg font-semibold text-[#0f172a]">142</span>
                        </div>
                        <Progress value={85} className="h-1.5" />
                        <p className="text-xs text-[#64748b]">85% more than average user</p>
                      </div>

                      {/* Comments */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm text-[#0f172a] font-medium">Comments Made</span>
                          </div>
                          <span className="text-lg font-semibold text-[#0f172a]">89</span>
                        </div>
                        <Progress value={65} className="h-1.5" />
                        <p className="text-xs text-[#64748b]">65% more than average user</p>
                      </div>

                      {/* Reviews */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                              <Star className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm text-[#0f172a] font-medium">Reviews Written</span>
                          </div>
                          <span className="text-lg font-semibold text-[#0f172a]">23</span>
                        </div>
                        <Progress value={45} className="h-1.5" />
                        <p className="text-xs text-[#64748b]">45% more than average user</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="bg-white rounded-xl border border-slate-200  overflow-hidden">
                    <div className="px-5 py-4 bg-linear-to-br from-amber-50 to-white border-b border-amber-100">
                      <h3 className="text-sm font-medium text-[#0f172a] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-amber-600" />
                        Recent Activity
                      </h3>
                    </div>
                    <div className="p-5">
                      <div className="space-y-4">
                        {[
                          { action: 'Logged in from Mumbai, India', time: '2 hours ago', icon: Activity, color: 'bg-blue-50 text-blue-600' },
                          { action: 'Updated profile picture', time: '1 day ago', icon: User, color: 'bg-green-50 text-green-600' },
                          { action: 'Joined Mumbai Cricket Club', time: '3 days ago', icon: Shield, color: 'bg-purple-50 text-purple-600' },
                          { action: 'Posted match score update', time: '5 days ago', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
                        ].map((activity, i) => (
                          <div key={i} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activity.color}`}>
                              <activity.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 pt-0.5">
                              <p className="text-sm font-medium text-[#0f172a]">{activity.action}</p>
                              <p className="text-xs text-[#64748b] mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Premium Action Footer */}
              <div className="bg-white border-t border-slate-200 px-8 py-5">
                <div className="space-y-2.5">
                  {/* Primary Actions */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <Button 
                    //   onClick={handleEditUser}
                      className="h-11 bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                    //   onClick={() => setSendMessageOpen(true)}
                      className="h-11 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <Button 
                    //   onClick={() => setResetPasswordOpen(true)}
                      variant="outline"
                      className="h-10 border-slate-200 hover:bg-slate-50"
                    >
                      <KeyRound className="w-4 h-4 mr-1.5" />
                      Reset
                    </Button>
                    <Button 
                    //   onClick={() => setViewActivityOpen(true)}
                      variant="outline"
                      className="h-10 border-slate-200 hover:bg-slate-50"
                    >
                      <Activity className="w-4 h-4 mr-1.5" />
                      Activity
                    </Button>
                    <Button 
                      onClick={() => {
                        // setUpgradeAction('upgrade');
                        // setUpgradeDowngradeOpen(true);
                      }}
                      variant="outline"
                      className="h-10 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Zap className="w-4 h-4 mr-1.5" />
                      Upgrade
                    </Button>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2.5">
                    <Button 
                    //   onClick={() => setSuspendDialogOpen(true)}
                      variant="outline"
                      className="h-10 border-orange-200 text-orange-700 hover:bg-orange-50"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Suspend Account
                    </Button>
                    <Button 
                    //   onClick={() => setDeleteDialogOpen(true)}
                      variant="outline"
                      className="h-10 border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
  );
}