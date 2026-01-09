"use client";

import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import Loader from "@/app/components/common/Loader";
import {
  CheckCircle,
  Mail,
  MessageSquare,
  Star,
  Flag,
  User,
  Shield,
  BarChart3,
  FileText,
  Activity,
  Edit,
  KeyRound,
  Zap,
  Ban,
  Trash2,
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Heart,
  Image,
  Bell,
  Eye,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import EditUserModal from "@/app/components/admin/users-management/id/EditUserModal";
import ResetPasswordModal from "@/app/components/admin/users-management/id/ResetPasswordModal";
import SendMessageModal from "@/app/components/admin/users-management/id/SendMessageModal";
import SuspendDialog from "@/app/components/admin/users-management/id/SuspendDialog";
import DeleteDialog from "@/app/components/admin/users-management/id/DeleteDialog";
import UpgradeDowngradeModal from "@/app/components/admin/users-management/id/UpgradeDowngradeModal";
import ViewActivityModal from "@/app/components/admin/users-management/id/ViewActivityModal";
import { Card, CardContent } from "@/app/components/ui/card";
import makeRequest from "@/Api's/apiHelper";
import {  GetUserById } from "@/Api's/repo";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  club: string;
  status: string;
  lastActive: string;
  joined: string;
  subscription?: string;
  bio?: string;
  dateOfBirth?: string;
  profilePic?: string;
  followers?: number;
  following?: number;
  posts?: number;
  comments?: number;
  reviews?: number;
  reports?: number;
  stories?: number;
  likes?: number;
  userLogs?: UserLog[];
};

type UserLog = {
  _id: string;
  action_taken: number;
  details: {
    request: {
      method: string;
      path: string;
      body?: Record<string, unknown>;
    };
    response: {
      statusCode: number;
      duration_ms?: number;
    };
  };
  created_at: string;
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = String(params.id); // Keep as string, not number

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [upgradeDowngradeOpen, setUpgradeDowngradeOpen] = useState(false);
  const [viewActivityOpen, setViewActivityOpen] = useState(false);
  const [upgradeAction, setUpgradeAction] = useState<"upgrade" | "downgrade">(
    "upgrade"
  );
  
  // State for fetched user data
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const fetchUserData = useCallback(async () => {
  if (!userId || userId === 'undefined') {
    console.warn("⚠️ userId is not available yet");
    return;
  }

  setIsLoading(true);
  try {
    
    const userUrl = `${GetUserById}?user_id=${userId}`;
    
    const userResponse = await makeRequest({
      url: userUrl,
      method: "GET",
    });

    const userApiData = userResponse?.data as Record<string, unknown> | undefined;

    if (userApiData?.success && userApiData?.result) {
      const resultData = userApiData.result as Record<string, unknown>;
      const userInfo = resultData?.user as Record<string, unknown> | undefined;
      const relatedData = resultData?.relatedData as Record<string, unknown> | undefined;

      const playerRole = (relatedData?.players as Array<Record<string, unknown>>)?.[0]?.player_role || 'Player';
      
      const mappedUser: User = {
        id: String(userInfo?._id || ''),
        name: String(userInfo?.full_name || userInfo?.user_name || ''),
        email: String(userInfo?.email || ''),
        role: String(playerRole),
        club: String(userInfo?.is_club ? 'Club' : 'Individual') || '',
        status: 'Active',
        lastActive: userInfo?.last_active
          ? new Date(userInfo.last_active as string).toLocaleDateString()
          : '-',
        joined: userInfo?.created_at
          ? new Date(userInfo.created_at as string).toLocaleDateString()
          : '-',
        subscription: 'Free',
        bio: String(userInfo?.bio || ''),
        dateOfBirth: userInfo?.date_of_birth
          ? new Date(userInfo.date_of_birth as string).toLocaleDateString()
          : '-',
        profilePic: String(userInfo?.profile_pic || ''),
        followers: (relatedData?.followers as Array<unknown>)?.length || 0,
        following: (relatedData?.following as Array<unknown>)?.length || 0,
        posts: (relatedData?.posts as Array<unknown>)?.length || 0,
        stories: (relatedData?.stories as Array<unknown>)?.length || 0,
        likes: (relatedData?.likes as Array<unknown>)?.length || 0,
        comments: (relatedData?.posts as Array<Record<string, unknown>>)?.reduce((acc, post) => {
          return acc + ((post?.comments as Array<unknown>)?.length || 0);
        }, 0) || 0,
        reviews: (relatedData?.player_ratings as Array<unknown>)?.length || 0,
        reports: 0,
        userLogs: (relatedData?.user_logs as UserLog[]) || [],
      };

      setUserData(mappedUser);
      setError(null);
    } else {
      setError("Failed to fetch user data");
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    setError("Error fetching user data");
  } finally {
    setIsLoading(false);
  }
}, [userId]);

useEffect(() => {
  if (userId) {
    fetchUserData();
  }
}, [userId, fetchUserData                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             ]);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "",
    subscription: "",
  });

  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
  });

  const [suspendReason, setSuspendReason] = useState("");

  const selectedUser = userData;

  if (!selectedUser && !isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">User Not Found</h1>
          <p className="text-slate-600 mt-2">
            The requested user does not exist.
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }



  const subscription = selectedUser?.subscription ?? "Premium";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100">
            Active
          </Badge>
        );
      case "Suspended":
        return (
          <Badge className="bg-red-50 text-red-600 border border-red-100">
            Suspended
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-50 text-amber-600 border border-amber-100">
            Pending
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      Player: "bg-blue-50 text-blue-700 border border-blue-100",
      "Club Admin": "bg-purple-50 text-purple-700 border border-purple-100",
      Youth: "bg-green-50 text-green-700 border border-green-100",
      Parent: "bg-orange-50 text-orange-700 border border-orange-100",
    };

    const colorClass =
      colors[role] || "bg-slate-50 text-slate-700 border border-slate-100";

    return <Badge className={colorClass}>{role}</Badge>;
  };

  const getSubscriptionBadge = (subscription?: string) => {
    const sub = subscription ?? "None";
    switch (sub) {
      case "Premium":
        return (
          <Badge className="bg-purple-50 text-purple-700 border border-purple-100">
            Premium
          </Badge>
        );
      case "Basic":
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
            Basic
          </Badge>
        );
      case "None":
        return (
          <Badge className="bg-slate-50 text-slate-600 border border-slate-100">
            None
          </Badge>
        );
      default:
        return <Badge>{sub}</Badge>;
    }
  };

  // Helper function to format user log actions
  const getActivityFromLog = (log: UserLog) => {
    const path = log.details?.request?.path || '';
    const actionType = log.action_taken;
    
    let action = '';
    let IconComponent = Activity;
    let colorClass = 'bg-blue-50 text-blue-600';

    // Map action_taken to activities
    switch (actionType) {
      case 1:
        if (path.includes('/comment')) {
          action = 'Commented on a post';
          IconComponent = MessageSquare;
          colorClass = 'bg-indigo-50 text-indigo-600';
        } else if (path.includes('/follow')) {
          action = 'Followed a user';
          IconComponent = User;
          colorClass = 'bg-purple-50 text-purple-600';
        } else if (path.includes('/posts')) {
          action = 'Created a post';
          IconComponent = FileText;
          colorClass = 'bg-blue-50 text-blue-600';
        } else if (path.includes('/stories')) {
          action = 'Posted a story';
          IconComponent = Image;
          colorClass = 'bg-pink-50 text-pink-600';
        } else {
          action = 'Performed an action';
          IconComponent = Activity;
          colorClass = 'bg-blue-50 text-blue-600';
        }
        break;
      case 2:
        if (path.includes('/notification')) {
          action = 'Marked notification as read';
          IconComponent = Bell;
          colorClass = 'bg-amber-50 text-amber-600';
        } else {
          action = 'Updated something';
          IconComponent = Edit;
          colorClass = 'bg-green-50 text-green-600';
        }
        break;
      case 3:
        action = 'Deleted content';
        IconComponent = Trash2;
        colorClass = 'bg-red-50 text-red-600';
        break;
      case 4:
        action = 'Reported content';
        IconComponent = Flag;
        colorClass = 'bg-orange-50 text-orange-600';
        break;
      case 5:
        action = 'Viewed notifications';
        IconComponent = Eye;
        colorClass = 'bg-slate-50 text-slate-600';
        break;
      default:
        action = 'Unknown action';
        IconComponent = Activity;
        colorClass = 'bg-gray-50 text-gray-600';
    }

    return { action, IconComponent, colorClass };
  };

  // Format time ago from date
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  // Handlers
  const handleEditUser = () => {
    setEditForm({
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      role: selectedUser?.role || "",
      subscription,
    });
    setEditModalOpen(true);
  };

  const handleSendMessage = () => {
    console.log("Message sent successfully");
  };

  const handleSuspendUser = () => {
    setSuspendDialogOpen(false);
    setSuspendReason("");
    router.push("/users-management");
  };

  const handleDeleteUser = () => {
    setDeleteDialogOpen(false);
    router.push("/users-management");
  };

  const handleUpgradeDowngrade = () => {
    console.log(`${upgradeAction} user:`, selectedUser?.name);
    setUpgradeDowngradeOpen(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleUserUpdated = () => {
    console.log("User updated successfully!");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error || !selectedUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">User Not Found</h1>
          <p className="text-slate-600 mt-2">
            {error || "The requested user does not exist."}
          </p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top breadcrumb / title like screenshot */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="hover:bg-slate-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl text-[#0f172a]">User Profile</h1>
              <p className="text-sm text-[#64748b]">View and manage user details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Card */}
            <Card className="border-slate-200  overflow-hidden">
              <div className="relative bg-linear-to-br from-slate-50 via-white to-blue-50/30 px-6 pt-8 pb-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="relative mb-4">
                    {selectedUser.profilePic ? (
                      <img
                        src={selectedUser.profilePic}
                        alt={selectedUser.name}
                        className="w-32 h-32 rounded-2xl object-cover border-2 border-white shadow-lg ring-1 ring-slate-200/50"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-linear-to-br from-slate-200 via-slate-100 to-white flex items-center justify-center text-slate-700 text-5xl border-2 border-white shadow-lg ring-1 ring-slate-200/50">
                        {selectedUser.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center border-2 border-white shadow-md">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Name & Email */}
                  <h2 className="text-2xl text-[#0f172a] mb-2 tracking-tight">
                    {selectedUser.name}
                  </h2>
                  <div className="flex items-center gap-2 text-[#64748b] text-sm mb-3">
                    <Mail className="w-4 h-4" />
                    {selectedUser.email}
                  </div>
                  <div className="text-xs text-[#64748b] mb-4">
                    ID: #{selectedUser.id.toString().padStart(4, '0')}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                    {getSubscriptionBadge(selectedUser.subscription)}
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Details Card */}
            <Card className="border-slate-200  overflow-hidden">
              <div className="px-5 py-4 bg-linear-to-br from-slate-50 to-white border-b border-slate-100">
                <h3 className="text-sm font-medium text-[#0f172a] flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-600" />
                  Account Details
                </h3>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748b] flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Account Type
                  </span>
                  <span className="text-sm font-medium text-[#0f172a]">{selectedUser.role}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-[#64748b] flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Subscription
                  </span>
                  <span className="text-sm font-medium text-[#0f172a]">{selectedUser.subscription}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-[#64748b] flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </span>
                  <span className="text-sm font-medium text-[#0f172a]">{selectedUser.joined}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-[#64748b] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Last Active
                  </span>
                  <span className="text-sm font-medium text-[#0f172a]">{selectedUser.lastActive}</span>
                </div>
              </CardContent>
            </Card>

            {/* Club Information Card */}
            <Card className="border-slate-200  overflow-hidden">
              <div className="px-5 py-4 bg-linear-to-br from-blue-50 to-white border-b border-blue-100">
                <h3 className="text-sm font-medium text-[#0f172a] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Club Information
                </h3>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748b] flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Linked Club
                  </span>
                  <span className="text-sm font-medium text-[#0f172a]">{selectedUser.club}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-[#64748b]">Status</span>
                  {getStatusBadge(selectedUser.status)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Engagement & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Engagement Analytics */}
            <Card className="border-slate-200  overflow-hidden">
              <div className="px-6 py-5 bg-linear-to-br from-emerald-50 to-white border-b border-emerald-100">
                <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                  Engagement Analytics
                </h3>
                <p className="text-sm text-[#64748b] mt-1">Performance metrics and user activity overview</p>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* Posts */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0f172a]">Posts Created</p>
                        <p className="text-xs text-[#64748b]">Total content published</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-[#0f172a]">{selectedUser.posts || 0}</span>
                  </div>
                </div>

                {/* Stories */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                        <Image className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0f172a]">Stories Posted</p>
                        <p className="text-xs text-[#64748b]">Temporary content shared</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-[#0f172a]">{selectedUser.stories || 0}</span>
                  </div>
                </div>

                {/* Likes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0f172a]">Likes Given</p>
                        <p className="text-xs text-[#64748b]">Content appreciated</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-[#0f172a]">{selectedUser.likes || 0}</span>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0f172a]">Comments Made</p>
                        <p className="text-xs text-[#64748b]">Engagement with community</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-[#0f172a]">{selectedUser.comments || 0}</span>
                  </div>
                </div>

                {/* Reviews */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0f172a]">Reviews Written</p>
                        <p className="text-xs text-[#64748b]">Feedback provided</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-[#0f172a]">{selectedUser.reviews || 0}</span>
                  </div>
                </div>

                {/* Reports */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Flag className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#0f172a]">Reports Submitted</p>
                        <p className="text-xs text-[#64748b]">Content moderation flags</p>
                      </div>
                    </div>
                    <span className="text-2xl font-semibold text-[#0f172a]">{selectedUser.reports || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Timeline */}
            <Card className="border-slate-200  overflow-hidden">
              <div className="px-6 py-5 bg-linear-to-br from-amber-50 to-white border-b border-amber-100">
                <h3 className="text-base font-medium text-[#0f172a] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-600" />
                  Recent Activity
                </h3>
                <p className="text-sm text-[#64748b] mt-1">Latest user actions and interactions</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {selectedUser?.userLogs && selectedUser.userLogs.length > 0 ? (
                    selectedUser.userLogs.slice(0, 10).map((log) => {
                      const { action, IconComponent, colorClass } = getActivityFromLog(log);
                      return (
                        <div key={log._id} className="flex items-start gap-4 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 pt-1">
                            <p className="text-sm font-medium text-[#0f172a]">{action}</p>
                            <p className="text-xs text-[#64748b] mt-1">{getTimeAgo(log.created_at)}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-[#64748b]">
                      <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No recent activity found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card className="border-slate-200  overflow-hidden">
              <div className="px-6 py-5 bg-white border-b border-slate-100">
                <h3 className="text-base font-medium text-[#0f172a]">Quick Actions</h3>
                <p className="text-sm text-[#64748b] mt-1">Manage user account and permissions</p>
              </div>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {/* Primary Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={handleEditUser}
                      className="h-12 bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button 
                      onClick={() => setSendMessageOpen(true)}
                      className="h-12 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      onClick={() => setResetPasswordOpen(true)}
                      variant="outline"
                      className="h-11 border-slate-200 hover:bg-slate-50"
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button 
                      onClick={() => {
                        setUpgradeAction('upgrade');
                        setUpgradeDowngradeOpen(true);
                      }}
                      variant="outline"
                      className="h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-xs text-[#64748b] mb-3 uppercase tracking-wider">Danger Zone</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => setSuspendDialogOpen(true)}
                        variant="outline"
                        className={selectedUser.status === "Suspended" ? "h-11 border-green-200 text-green-700 hover:bg-green-50" : "h-11 border-orange-200 text-orange-700 hover:bg-orange-50"}
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        {selectedUser.status === "Suspended" ? "Activate Account" : "Suspend Account"}
                      </Button>
                      <Button 
                        onClick={() => setDeleteDialogOpen(true)}
                        variant="outline"
                        className="h-11 border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <EditUserModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editForm={editForm}
        onEditFormChange={setEditForm}
        selectedUser={selectedUser}
        onUserUpdated={handleUserUpdated}
      />

      <ResetPasswordModal
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        selectedUser={selectedUser}
      />

      <SendMessageModal
        open={sendMessageOpen}
        onOpenChange={setSendMessageOpen}
        messageForm={messageForm}
        onMessageFormChange={setMessageForm}
        onSend={handleSendMessage}
        selectedUser={selectedUser}
      />

      <SuspendDialog
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        selectedUser={selectedUser}
        suspendReason={suspendReason}
        onSuccess={handleSuspendUser}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedUser={selectedUser}
        onSuccess={handleDeleteUser}
      />

      <UpgradeDowngradeModal
        open={upgradeDowngradeOpen}
        onOpenChange={setUpgradeDowngradeOpen}
        selectedUser={selectedUser}
        upgradeAction={upgradeAction}
        onConfirm={handleUpgradeDowngrade}
      />

      <ViewActivityModal
        open={viewActivityOpen}
        onOpenChange={setViewActivityOpen}
        selectedUser={selectedUser}
      />
    </div>
  );
}
