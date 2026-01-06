"use client"
import { useState } from 'react';
import { Send, Clock, CheckCircle2, MessagesSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent} from '@/app/components/ui/card';
import PushNotification from '@/app/components/admin/communication-tool/PushNotification';
import InAppAnnouncements from '@/app/components/admin/communication-tool/InAppAnnouncements';
import ScheduledNotifications from '@/app/components/admin/communication-tool/ScheduledNotifications';
export default function CommunicationTools() {
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [showNewScheduled, setShowNewScheduled] = useState(false);

  const sentNotifications = [
    {
      id: '1',
      title: 'New Feature: Live Match Scoring',
      message: 'Check out our new live match scoring feature!',
      type: 'Global',
      status: 'Sent',
      recipients: 15234,
      sentDate: '2024-12-04 10:30 AM',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: '2',
      title: 'Premium Plan Discount',
      message: 'Get 30% off premium plans this week only!',
      type: 'Targeted - Premium Users',
      status: 'Sent',
      recipients: 3421,
      sentDate: '2024-12-03 02:15 PM',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: '3',
      title: 'System Maintenance Notice',
      message: 'Scheduled maintenance on Dec 5th, 2-4 AM',
      type: 'Global',
      status: 'Sent',
      recipients: 15234,
      sentDate: '2024-12-02 09:00 AM',
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  // Mock data for announcements
  const announcements = [
    {
      id: '1',
      title: 'Welcome to Crickit 2.0!',
      content: 'Explore new features and improved performance',
      displayLocation: 'Dashboard Banner',
      status: 'Active',
      views: 8543,
      startDate: '2024-12-01',
      endDate: '2024-12-15'
    },
    {
      id: '2',
      title: 'Holiday Tournament Registration',
      content: 'Register now for the annual holiday cricket tournament',
      displayLocation: 'Popup Modal',
      status: 'Scheduled',
      views: 0,
      startDate: '2024-12-10',
      endDate: '2024-12-20'
    }
  ];

  // Mock data for scheduled notifications
  const scheduledNotifications = [
    {
      id: '1',
      title: 'Premium Expiry Reminder',
      message: 'Your premium subscription expires in 30 days',
      trigger: 'Premium expires in 30 days',
      targetAudience: 'Premium Users',
      status: 'Active',
      sentCount: 234,
      lastTriggered: '2024-12-04 08:00 AM'
    },
    {
      id: '2',
      title: 'Welcome New Users',
      message: 'Welcome to Crickit! Complete your profile to get started',
      trigger: 'New user registration',
      targetAudience: 'New Users (0-24 hours)',
      status: 'Active',
      sentCount: 456,
      lastTriggered: '2024-12-04 11:45 AM'
    },
    {
      id: '3',
      title: 'Inactive User Re-engagement',
      message: 'We miss you! Come back and see what\'s new',
      trigger: 'No activity for 30 days',
      targetAudience: 'Inactive Users',
      status: 'Paused',
      sentCount: 123,
      lastTriggered: '2024-12-01 06:00 AM'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-[#1e293b] mb-1">Communication Tools</h1>
        <p className="text-[#64748b]">Manage push notifications, announcements, and automated messaging</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Total Sent</p>
                <h3 className="text-2xl text-[#1e293b]">18,655</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-[#007BFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Active Announcements</p>
                <h3 className="text-2xl text-[#1e293b]">1</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessagesSquare className="w-6 h-6 text-[#00C853]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Scheduled Rules</p>
                <h3 className="text-2xl text-[#1e293b]">2</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Delivery Rate</p>
                <h3 className="text-2xl text-[#1e293b]">98.2%</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="push" className="space-y-4">
        <TabsList>
          <TabsTrigger value="push">Push Notifications</TabsTrigger>
          <TabsTrigger value="announcements">In-App Announcements</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="push" className="space-y-4">
         <PushNotification sentNotifications={sentNotifications} setShowNewNotification={setShowNewNotification} showNewNotification={showNewNotification}/>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
         <InAppAnnouncements setShowNewAnnouncement={setShowNewAnnouncement} announcements={announcements} showNewAnnouncement={showNewAnnouncement}/>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <ScheduledNotifications scheduledNotifications={scheduledNotifications} setShowNewScheduled={setShowNewScheduled} showNewScheduled={showNewScheduled}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}