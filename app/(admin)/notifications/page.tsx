"use client";

import { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCircle, Trash2, AlertCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import makeRequest from "@/Api's/apiHelper";
import { GetNotificationByUser, MarkAsReadNotification, DeleteNotification } from "@/Api's/repo";
import { useAuth } from '@/app/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { setNotificationCount } from '@/redux/actions';

interface Notification {
  _id: string;
  title: string;
  body: string;
  type: string;
  category?: string;
  read: boolean;
  isUrgent?: boolean;
  isMention?: boolean;
  created_at: string;
  data?: Record<string, unknown>;
}

interface NotificationApiResponse {
  response_code?: number;
  success?: boolean;
  message?: string;
  result?: Notification[];
}

export default function Notifications() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await makeRequest<NotificationApiResponse>({
        url: GetNotificationByUser,
        method: "GET",
        params: {
          user_id: user._id,
        },
      });

      if (response.data?.result) {
        setNotifications(response.data.result);
        // Update notification count in Redux (only count unread)
        const unreadCount = response.data.result.filter((n: Notification) => !n.read).length;
        dispatch(setNotificationCount(unreadCount));
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
      // Keep existing notifications on error
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    const wasUnread = notifications.find(n => n._id === id && !n.read);
  

    // Update notification count
    const currentUnreadCount = notifications.filter(n => !n.read).length;
 

    try {
      await makeRequest({
        url: MarkAsReadNotification,
        method: "POST",
        data: { id },
      });
      // Re-fetch notifications for real-time update
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
      // Revert on error
      if (wasUnread) {
        dispatch(setNotificationCount(currentUnreadCount));
      }
      setNotifications(notifications.map(n =>
        n._id === id ? { ...n, read: false } : n
      ));
    }
  };


  const deleteNotification = async (id: string) => {
    // Store the notification for potential rollback
    const notificationToDelete = notifications.find(n => n._id === id);
    const wasUnread = notificationToDelete && !notificationToDelete.read;
    

   
    try {
      await makeRequest({
        url: DeleteNotification,
        method: "POST",
        data: { id },
      });
      // Re-fetch notifications for real-time update
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
      // Revert on error
      if (wasUnread && notificationToDelete) {
        const revertedUnreadCount = notifications.filter(n => !n.read).length;
        dispatch(setNotificationCount(revertedUnreadCount + 1));
      }
      if (notificationToDelete) {
        setNotifications(prev => [...prev, notificationToDelete]);
      }
    }
  };

  
  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'urgent':
        return notifications.filter(n => n.isUrgent);
      case 'mentions':
        return notifications.filter(n => n.isMention);
      case 'archived':
        return notifications.filter(n => n.read);
      default:
        return notifications;
    }
  };

  const getIconComponent = (notificationType: string) => {
    switch (notificationType) {
      case 'success':
        return { icon: CheckCircle, bg: 'bg-green-100', color: 'text-green-600' };
      case 'warning':
        return { icon: AlertTriangle, bg: 'bg-amber-100', color: 'text-amber-600' };
      case 'error':
        return { icon: AlertCircle, bg: 'bg-red-100', color: 'text-red-600' };
      case 'info':
        return { icon: Info, bg: 'bg-blue-100', color: 'text-blue-600' };
      default:
        return { icon: Bell, bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Club Management': 'bg-green-100 text-green-700',
      'Content Moderation': 'bg-orange-100 text-orange-700',
      'Analytics': 'bg-purple-100 text-purple-700',
      'Youth Safety': 'bg-red-100 text-red-700',
      'User Management': 'bg-blue-100 text-blue-700',
      'Billing': 'bg-amber-100 text-amber-700',
      'System': 'bg-slate-100 text-slate-700',
      'Reviews': 'bg-teal-100 text-teal-700',
      'Reports & Abuse': 'bg-amber-100 text-amber-700',
      'Audit': 'bg-indigo-100 text-indigo-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.isUrgent).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1e293b] mb-1">Notifications</h1>
          <p className="text-[#64748b]">Stay updated with important platform activities</p>
        </div>
        {/* <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#e2e8f0]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-[#e2e8f0]">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Unread</p>
                <p className="text-3xl text-[#1e293b]">{loading ? '-' : unreadCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Today</p>
                <p className="text-3xl text-[#1e293b]">
                  {loading ? '-' : notifications.filter(n => {
                    const date = new Date(n.created_at);
                    const today = new Date();
                    return date.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">This week</p>
                <p className="text-3xl text-[#1e293b]">
                  {loading ? '-' : notifications.filter(n => {
                    const date = new Date(n.created_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date >= weekAgo;
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Urgent</p>
                <p className="text-3xl text-[#1e293b]">{loading ? '-' : urgentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="border-[#e2e8f0]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#1e293b]">All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#007BFF]" />
              <span className="ml-2 text-[#64748b]">Loading notifications...</span>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-[#64748b] mb-4">{error}</p>
              <Button variant="outline" onClick={fetchNotifications}>
                Retry
              </Button>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-6 bg-slate-100">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">
                  Unread
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-0">
                {filteredNotifications.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell className="w-12 h-12 text-[#cbd5e1] mx-auto mb-4" />
                    <p className="text-[#64748b]">
                      {activeTab === 'archived' 
                        ? 'No archived notifications' 
                        : 'No notifications to display'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0 divide-y divide-[#e2e8f0]">
                    {filteredNotifications.map((notification) => {
                      const { icon: IconComponent, bg, color } = getIconComponent(notification.type);
                      
                      return (
                        <div
                          key={notification._id}
                          className={`p-5 hover:bg-slate-50 transition-colors ${
                            !notification.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                              <IconComponent className={`w-5 h-5 ${color}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-[#1e293b]">
                                    {notification.title}
                                  </h3>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-[#007BFF] rounded-full" />
                                  )}
                                </div>
                                <span className="text-sm text-[#64748b] whitespace-nowrap">
                                  {formatTime(notification.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-[#64748b] mb-3">
                                {notification.body}
                              </p>
                              <Badge className={`${getCategoryColor(notification.category || notification.type)} hover:${getCategoryColor(notification.category || notification.type)} text-xs`}>
                                {notification.category || notification.type}
                              </Badge>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-[#64748b] hover:text-[#00C853] hover:bg-green-50"
                                  onClick={() => markAsRead(notification._id)}
                                  title="Mark as read"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#64748b] hover:text-[#ef4444] hover:bg-red-50"
                                onClick={() => deleteNotification(notification._id)}
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
