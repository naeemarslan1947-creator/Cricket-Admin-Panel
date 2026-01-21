"use client"
import { useState, useEffect, useCallback, useRef } from 'react';
import { Send, Clock, CheckCircle2, MessagesSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent} from '@/app/components/ui/card';
import PushNotification from '@/app/components/admin/communication-tool/PushNotification';
import InAppAnnouncements from '@/app/components/admin/communication-tool/InAppAnnouncements';
import ScheduledNotifications from '@/app/components/admin/communication-tool/ScheduledNotifications';
import { TargetedAudience, GetCommunicationHeader, GetNotification } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";
import { useAuth } from '@/app/hooks/useAuth';
import Loader from '@/app/components/common/Loader';

interface AudienceOption {
  value: string
  label: string
}

interface AudienceData {
  userTypeOptions: AudienceOption[]
  subscriptionTypeOptions: AudienceOption[]
}

interface CommunicationHeaderData {
  total_notifications: number
  notifications_today: number
  notifications_this_month: number
  scheduled_notifications: number
}

interface Notification {
  _id: string
  notification_ids: string[]
  user_type: string
  title: string
  body: string
  type: string
  user_subscription_type: string
  created_by: string
  created_at: string
  __v?: number
  // Mapped fields for display
  id: string
  message: string
  status: string
  recipients: number
  sentDate: string
  color: string
}

interface Announcement {
  _id: string
  notification_ids: string[]
  user_type: string
  title: string
  body: string
  type: string
  user_subscription_type: string
  created_by: string
  created_at: string
  __v?: number
  // Mapped fields for display
  id: string
  content: string
  displayLocation: string
  status: string
  views: number
  startDate: string
  endDate: string
}

interface ScheduledNotification {
  _id: string
  notification_ids: string[]
  user_type: string
  title: string
  body: string
  type: string
  user_subscription_type: string
  created_by: string
  scheduled_at: string
  created_at: string
  __v?: number
  // Mapped fields for display
  id: string
  message: string
  trigger: string
  targetAudience: string
  status: string
  sentCount: number
  lastTriggered: string
}

interface RawNotificationResponse {
  _id: string
  notification_ids: string[]
  user_type: string
  title: string
  body: string
  type: string
  user_subscription_type: string
  created_by: string
  scheduled_at?: string
  created_at: string
  __v?: number
}

interface NotificationApiResponse {
  response_code?: number
  success?: boolean
  status_code?: number
  message?: string
  error_message?: string | null
  result?: RawNotificationResponse[] | Announcement[] | ScheduledNotification[]
  misc_data?: unknown
}

export default function CommunicationTools() {
  const { user } = useAuth();
  const [showNewNotification, setShowNewNotification] = useState(false);
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [showNewScheduled, setShowNewScheduled] = useState(false);
  const [audienceData, setAudienceData] = useState<AudienceData>({
    userTypeOptions: [],
    subscriptionTypeOptions: []
  });
  const [loadingAudience, setLoadingAudience] = useState(true);
  const [communicationHeader, setCommunicationHeader] = useState<CommunicationHeaderData | null>(null);
  const [loadingCommunicationHeader, setLoadingCommunicationHeader] = useState(true);
  
  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [currentTab, setCurrentTab] = useState('push');
  
  // Cache and refetch flags
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
  const shouldRefetchRef = useRef(false);

  // Fetch audience data on mount
  useEffect(() => {
    const fetchAudienceData = async () => {
      try {
        const response = await makeRequest<{
          result: {
            users: { user_types: string[]; subscription_types: string[] }
            admins: { user_types: string[]; subscription_types: string[] }
            clubs: { user_types: string[]; subscription_types: string[] }
          }
        }>({
          url: TargetedAudience,
          method: "GET",
        })

        const result = response.data?.result
        if (result) {
          const userTypes: AudienceOption[] = []
          const subTypes: AudienceOption[] = []

          // Add Users user_types
          result.users.user_types.forEach((type: string) => {
            userTypes.push({ value: `user_type_${type}`, label: `${type} Users` })
          })

          // Add Admins user_types
          result.admins.user_types.forEach((type: string) => {
            userTypes.push({ value: `admin_type_${type}`, label: `${type} Admins` })
          })

          // Add Clubs user_types
          result.clubs.user_types.forEach((type: string) => {
            userTypes.push({ value: `club_type_${type}`, label: `${type} Clubs` })
          })

          // Add subscription types from all categories
          const allSubscriptionTypes = new Set<string>()
          result.users.subscription_types.forEach((type: string) => allSubscriptionTypes.add(type))
          result.admins.subscription_types.forEach((type: string) => allSubscriptionTypes.add(type))
          result.clubs.subscription_types.forEach((type: string) => allSubscriptionTypes.add(type))

          allSubscriptionTypes.forEach((type: string) => {
            subTypes.push({ value: `sub_${type}`, label: `${type.charAt(0).toUpperCase() + type.slice(1)}` })
          })

          setAudienceData({
            userTypeOptions: userTypes,
            subscriptionTypeOptions: subTypes
          })
        }
      } catch (error) {
        console.error("Error fetching audience data:", error)
      } finally {
        setLoadingAudience(false)
      }
    }

    fetchAudienceData()
  }, [])

  // Fetch communication header data
  useEffect(() => {
    const fetchCommunicationHeader = async () => {
      try {
        const response = await makeRequest<{
          result: CommunicationHeaderData
        }>({
          url: GetCommunicationHeader,
          method: "GET",
        })
        
        console.log("Communication Header Response:", response);
        if (response.data?.result) {
          setCommunicationHeader(response.data.result);
        }
      } catch (error) {
        console.error("Error fetching communication header:", error);
      } finally {
        setLoadingCommunicationHeader(false);
      }
    };

  fetchCommunicationHeader();
  }, []);

  // Fetch notifications based on type
  const fetchNotifications = useCallback(async (type: string) => {
    if (!user?._id) return;
    
    setLoadingNotifications(true);
    try {
      const response = await makeRequest<NotificationApiResponse>({
        url: GetNotification,
        method: "GET",
        params: {
          type: type,
          created_by: user._id
        }
      });
      
      console.log(`${type} Response:`, response);
      
      if (response.data?.result) {
        // Map API response to Notification interface
        const mappedNotifications: Notification[] = (response.data.result as RawNotificationResponse[]).map(item => ({
          _id: item._id,
          notification_ids: item.notification_ids || [],
          user_type: item.user_type,
          title: item.title,
          body: item.body,
          type: item.type,
          user_subscription_type: item.user_subscription_type,
          created_by: item.created_by,
          created_at: item.created_at,
          __v: item.__v,
          // Mapped display fields
          id: item._id,
          message: item.body,
          status: 'Sent',
          recipients: 0,
          sentDate: new Date(item.created_at).toLocaleString(),
          color: getNotificationColor(item.user_type)
        }));

        if (type === 'adminNotification') {
          setNotifications(mappedNotifications);
          
          // Also filter and set scheduled notifications from the same response
          const scheduledItems = (response.data.result as RawNotificationResponse[]).filter(item => item.scheduled_at);
          const mappedScheduled: ScheduledNotification[] = scheduledItems.map(item => ({
            _id: item._id,
            notification_ids: item.notification_ids || [],
            user_type: item.user_type,
            title: item.title,
            body: item.body,
            type: item.type,
            user_subscription_type: item.user_subscription_type,
            created_by: item.created_by,
            scheduled_at: item.scheduled_at!,
            created_at: item.created_at,
            __v: item.__v,
            // Mapped display fields
            id: item._id,
            message: item.body,
            trigger: 'Scheduled Notification',
            targetAudience: item.user_type === 'all-users' ? 'All Users' : `${item.user_type} Users`,
            status: 'Scheduled',
            sentCount: 0,
            lastTriggered: '-'
          }));
          setScheduledNotifications(mappedScheduled);
        } else if (type === 'adminAnnouncement') {
          // Map API response to Announcement interface
          const mappedAnnouncements: Announcement[] = (response.data.result as RawNotificationResponse[]).map(item => ({
            _id: item._id,
            notification_ids: item.notification_ids || [],
            user_type: item.user_type,
            title: item.title,
            body: item.body,
            type: item.type,
            user_subscription_type: item.user_subscription_type,
            created_by: item.created_by,
            created_at: item.created_at,
            __v: item.__v,
            // Mapped display fields
            id: item._id,
            content: item.body,
            displayLocation: 'Dashboard Banner',
            status: 'Active',
            views: 0,
            startDate: new Date(item.created_at).toISOString().split('T')[0],
            endDate: new Date(new Date(item.created_at).setMonth(new Date(item.created_at).getMonth() + 1)).toISOString().split('T')[0]
          }));
          setAnnouncements(mappedAnnouncements);
        } 
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user]);

  // Helper function to get notification color based on user type
  const getNotificationColor = (userType: string): string => {
    const colorMap: Record<string, string> = {
      'all-users': 'bg-blue-100 text-blue-700',
      'premium': 'bg-purple-100 text-purple-700',
      'free': 'bg-green-100 text-green-700',
      'admin': 'bg-red-100 text-red-700'
    };
    return colorMap[userType] || 'bg-gray-100 text-gray-700';
  };

  // Fetch notifications when tab changes - with caching
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    if (value === 'push') {
      // Only fetch if not loaded or refetch is needed
      if (!notificationsLoaded || shouldRefetchRef.current) {
        fetchNotifications('adminNotification');
        setNotificationsLoaded(true);
      }
    } else if (value === 'announcements') {
      if (!announcementsLoaded || shouldRefetchRef.current) {
        fetchNotifications('adminAnnouncement');
        setAnnouncementsLoaded(true);
      }
    } else if (value === 'scheduled') {
      // Scheduled uses same data as push, just filtered
      if (!notificationsLoaded || shouldRefetchRef.current) {
        fetchNotifications('adminNotification');
        setNotificationsLoaded(true);
      }
    }
  };

  // Function to trigger refetch when a new notification/announcement is created
  const triggerRefetch = useCallback(async () => {
    shouldRefetchRef.current = true;
    setNotificationsLoaded(false);
    setAnnouncementsLoaded(false);
    
    // Fetch notifications and announcements in parallel
    await Promise.all([
      fetchNotifications('adminNotification'),
      fetchNotifications('adminAnnouncement')
    ]);
    
    // Also refetch the communication header to update stats in real-time
    try {
      const headerResponse = await makeRequest<{
        result: CommunicationHeaderData
      }>({
        url: GetCommunicationHeader,
        method: "GET",
      })
      
      if (headerResponse.data?.result) {
        setCommunicationHeader(headerResponse.data.result);
      }
    } catch (error) {
      console.error("Error refetching communication header:", error);
    }
    
    setNotificationsLoaded(true);
    setAnnouncementsLoaded(true);
    shouldRefetchRef.current = false;
  }, [fetchNotifications]);

  // Initial fetch for push notifications on mount
  useEffect(() => {
    fetchNotifications('adminNotification');
    setNotificationsLoaded(true);
  }, [fetchNotifications]);

  return (
    <div className="space-y-6">
      {loadingNotifications && <Loader />}
      
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
                <h3 className="text-2xl text-[#1e293b]">
                  {loadingCommunicationHeader ? '-' : communicationHeader?.total_notifications ?? 0}
                </h3>
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
                <p className="text-sm text-[#64748b] mb-1">Notifications Today</p>
                <h3 className="text-2xl text-[#1e293b]">
                  {loadingCommunicationHeader ? '-' : communicationHeader?.notifications_today ?? 0}
                </h3>
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
                <p className="text-sm text-[#64748b] mb-1">This Month</p>
                <h3 className="text-2xl text-[#1e293b]">
                  {loadingCommunicationHeader ? '-' : communicationHeader?.notifications_this_month ?? 0}
                </h3>
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
                <p className="text-sm text-[#64748b] mb-1">Scheduled</p>
                <h3 className="text-2xl text-[#1e293b]">
                  {loadingCommunicationHeader ? '-' : communicationHeader?.scheduled_notifications ?? 0}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#00C853]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="push" className="space-y-4" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="push">Push Notifications</TabsTrigger>
          <TabsTrigger value="announcements">In-App Announcements</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="push" className="space-y-4">
          {loadingNotifications ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : (
            <PushNotification 
              sentNotifications={notifications} 
              setShowNewNotification={setShowNewNotification} 
              showNewNotification={showNewNotification}
              userTypeOptions={audienceData.userTypeOptions}
              subscriptionTypeOptions={audienceData.subscriptionTypeOptions}
              loadingAudience={loadingAudience}
              triggerRefetch={triggerRefetch}
            />
          )}
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          {loadingNotifications ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) : (
            <InAppAnnouncements 
              setShowNewAnnouncement={setShowNewAnnouncement} 
              announcements={announcements} 
              showNewAnnouncement={showNewAnnouncement}
              userTypeOptions={audienceData.userTypeOptions}
              subscriptionTypeOptions={audienceData.subscriptionTypeOptions}
              loadingAudience={loadingAudience}
              triggerRefetch={triggerRefetch}
            />
          )}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {loadingNotifications ? (
            <div className="flex items-center justify-center py-12">
              <Loader />
            </div>
          ) :  (
            <ScheduledNotifications 
              scheduledNotifications={scheduledNotifications} 
              setShowNewScheduled={setShowNewScheduled} 
              showNewScheduled={showNewScheduled}
              userTypeOptions={audienceData.userTypeOptions}
              subscriptionTypeOptions={audienceData.subscriptionTypeOptions}
              loadingAudience={loadingAudience}
              triggerRefetch={triggerRefetch}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

