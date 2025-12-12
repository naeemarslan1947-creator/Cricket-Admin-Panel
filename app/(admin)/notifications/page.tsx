"use client";

import { useState } from 'react';
import { Bell, CheckCircle, Trash2, Settings, Filter, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface Notification {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  icon: 'success' | 'warning' | 'info' | 'error';
  time: string;
  isRead: boolean;
  isUrgent: boolean;
  isMention: boolean;
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Club verification approved',
      description: 'Mumbai Cricket Club has been successfully verified and is now live on the platform',
      category: 'Club Management',
      categoryColor: 'bg-green-100 text-green-700',
      icon: 'success',
      time: '2 minutes ago',
      isRead: false,
      isUrgent: false,
      isMention: false,
    },
    {
      id: 2,
      title: '3 content reports awaiting review',
      description: 'Multiple users have reported inappropriate content. Review required within 24 hours',
      category: 'Content Moderation',
      categoryColor: 'bg-orange-100 text-orange-700',
      icon: 'warning',
      time: '15 minutes ago',
      isRead: false,
      isUrgent: true,
      isMention: false,
    },
    {
      id: 3,
      title: 'Monthly analytics report ready',
      description: 'Your November 2024 analytics report has been generated and is ready for download',
      category: 'Analytics',
      categoryColor: 'bg-purple-100 text-purple-700',
      icon: 'info',
      time: '1 hour ago',
      isRead: true,
      isUrgent: false,
      isMention: false,
    },
    {
      id: 4,
      title: 'High priority safety alert',
      description: 'Potential youth safety violation detected in chat conversation. Immediate review required',
      category: 'Youth Safety',
      categoryColor: 'bg-red-100 text-red-700',
      icon: 'error',
      time: '2 hours ago',
      isRead: true,
      isUrgent: true,
      isMention: false,
    },
    {
      id: 5,
      title: 'New user registration spike',
      description: '150+ new users registered today - 25% increase from daily average',
      category: 'User Management',
      categoryColor: 'bg-blue-100 text-blue-700',
      icon: 'success',
      time: '2 hours ago',
      isRead: true,
      isUrgent: false,
      isMention: false,
    },
    {
      id: 6,
      title: 'Payment failed for subscription',
      description: 'Premium Cricket Club subscription payment failed. Club notified and subscription suspended',
      category: 'Billing',
      categoryColor: 'bg-amber-100 text-amber-700',
      icon: 'warning',
      time: '5 hours ago',
      isRead: true,
      isUrgent: false,
      isMention: false,
    },
    {
      id: 7,
      title: 'System maintenance scheduled',
      description: 'Platform maintenance scheduled for Nov 20, 2024 from 2:00 AM to 4:00 AM IST',
      category: 'System',
      categoryColor: 'bg-slate-100 text-slate-700',
      icon: 'info',
      time: '1 day ago',
      isRead: true,
      isUrgent: false,
      isMention: false,
    },
    {
      id: 8,
      title: '25 new reviews submitted',
      description: 'Clubs received 25 new reviews today. Average rating: 4.6/5.0',
      category: 'Reviews',
      categoryColor: 'bg-teal-100 text-teal-700',
      icon: 'success',
      time: '1 day ago',
      isRead: true,
      isUrgent: false,
      isMention: false,
    },
    {
      id: 9,
      title: 'Spam report threshold exceeded',
      description: 'User account @cricket_fan_2024 has received 3 spam reports. Account flagged for review',
      category: 'Reports & Abuse',
      categoryColor: 'bg-amber-100 text-amber-700',
      icon: 'warning',
      time: '2 days ago',
      isRead: true,
      isUrgent: false,
      isMention: false,
    },
    {
      id: 10,
      title: 'Weekly audit summary',
      description: '647 admin actions logged this week. Export report available in Audit Logs',
      category: 'Audit',
      categoryColor: 'bg-indigo-100 text-indigo-700',
      icon: 'info',
      time: '3 days ago',
      isRead: true,
      isUrgent: false,
      isMention: false,
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearReadNotifications = () => {
    setNotifications(notifications.filter(n => !n.isRead));
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'urgent':
        return notifications.filter(n => n.isUrgent);
      case 'mentions':
        return notifications.filter(n => n.isMention);
      case 'archived':
        return [];
      default:
        return notifications;
    }
  };

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
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

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const todayCount = notifications.filter(n => 
    n.time.includes('minutes') || n.time.includes('hour') && !n.time.includes('hours')
  ).length;
  const weekCount = notifications.filter(n => 
    n.time.includes('minutes') || n.time.includes('hour') || n.time.includes('day')
  ).length;
  const urgentCount = notifications.filter(n => n.isUrgent).length;
  const mentionsCount = notifications.filter(n => n.isMention).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1e293b] mb-1">Notifications</h1>
          <p className="text-[#64748b]">Stay updated with important platform activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-[#e2e8f0]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-[#e2e8f0]">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Unread</p>
                <p className="text-3xl text-[#1e293b]">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Today</p>
                <p className="text-3xl text-[#1e293b]">{todayCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">This week</p>
                <p className="text-3xl text-[#1e293b]">{weekCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Urgent</p>
                <p className="text-3xl text-[#1e293b]">{urgentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button 
          className="bg-[#00C853] hover:bg-[#00A843] text-white"
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark All as Read
        </Button>
        <Button 
          variant="outline" 
          className="border-[#e2e8f0]"
          onClick={clearReadNotifications}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Read Notifications
        </Button>
        <Button variant="outline" className="border-[#e2e8f0]">
          <Bell className="w-4 h-4 mr-2" />
          Notification Preferences
        </Button>
      </div>

      {/* Notifications List */}
      <Card className="border-[#e2e8f0] ">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#1e293b]">All Notifications</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6 bg-slate-100">
              <TabsTrigger value="all" className="flex-1">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="urgent" className="flex-1">
                Urgent ({urgentCount})
              </TabsTrigger>
              <TabsTrigger value="mentions" className="flex-1">
                Mentions ({mentionsCount})
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">
                Archived (0)
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-0">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <Bell className="w-12 h-12 text-[#cbd5e1] mx-auto mb-4" />
                  <p className="text-[#64748b]">No notifications to display</p>
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-[#e2e8f0]">
                  {filteredNotifications.map((notification) => {
                    const { icon: IconComponent, bg, color } = getIconComponent(notification.icon);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`p-5 hover:bg-slate-50 transition-colors ${
                          !notification.isRead ? 'bg-blue-50/40' : ''
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
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-[#007BFF] rounded-full" />
                                )}
                              </div>
                              <span className="text-sm text-[#64748b] whitespace-nowrap">{notification.time}</span>
                            </div>
                            <p className="text-sm text-[#64748b] mb-3">
                              {notification.description}
                            </p>
                            <Badge className={`${notification.categoryColor} hover:${notification.categoryColor} text-xs`}>
                              {notification.category}
                            </Badge>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-[#64748b] hover:text-[#00C853] hover:bg-green-50"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="w-5 h-5" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-[#64748b] hover:text-[#ef4444] hover:bg-red-50"
                              onClick={() => deleteNotification(notification.id)}
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
        </CardContent>
      </Card>
    </div>
  );
}