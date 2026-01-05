"use client"
import { useState } from 'react';
import { Send, Clock, MessagesSquare, Edit2, Users, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
export default function CommunicationTools() {
  const [showNewNotification, setShowNewNotification] = useState(false);

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


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-[#1e293b] mb-1">Communication Tools</h1>
        <p className="text-[#64748b]">Manage push notifications, announcements, and automated messaging</p>
      </div>

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
                <p className="text-sm text-[#64748b] mb-1">Today Announcements</p>
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
                <p className="text-sm text-[#64748b] mb-1">Last Month Announcements</p>
                <h3 className="text-2xl text-[#1e293b]">2</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1e293b]">Send Push Notification</CardTitle>
                  <p className="text-sm text-[#64748b]">Send global or targeted push notifications to users</p>
                </div>
                <Button 
                  className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
                  onClick={() => setShowNewNotification(!showNewNotification)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Notification
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Notification Form */}
              {showNewNotification && (
                <Card className="border-[#007BFF] bg-blue-50">
                  <CardContent className="p-4 space-y-4">
                    <h4 className="text-[#1e293b]">Create Push Notification</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="notif-title">Notification Title</Label>
                        <Input 
                          id="notif-title" 
                          placeholder="e.g., New Feature Available" 
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="notif-message">Message</Label>
                        <textarea 
                          id="notif-message" 
                          placeholder="Enter your message here..." 
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="notif-type">Target Audience</Label>
                        <select id="notif-type" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="global">Global - All Users (15,234)</option>
                          <option value="premium">Premium Users (3,421)</option>
                          <option value="free">Free Users (11,813)</option>
                          <option value="club-owners">Club Owners (1,234)</option>
                          <option value="players">Players (8,567)</option>
                          <option value="coaches">Coaches (2,145)</option>
                          <option value="inactive">Inactive Users (30+ days)</option>
                        </select>
                      </div>

                    </div>

                    <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
                      <Button className="bg-[#00C853] hover:bg-[#00a844] text-white">
                        <Send className="w-4 h-4 mr-2" />
                        Send Now
                      </Button>
                      <Button variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule for Later
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewNotification(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sent Notifications History */}
              <div>
                <h4 className="text-[#1e293b] mb-3">Recent Notifications</h4>
                <div className="space-y-3">
                  {sentNotifications.map((notification) => (
                    <Card key={notification.id} className="border-[#e2e8f0]">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-[#1e293b]">{notification.title}</h4>
                              <Badge className={notification.color}>{notification.type}</Badge>
                              <Badge className="bg-green-100 text-green-700">{notification.status}</Badge>
                            </div>
                            <p className="text-sm text-[#64748b] mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {notification.recipients.toLocaleString()} recipients
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.sentDate}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                              <Edit2 className="w-4 h-4 mr-1" />
                              Resend
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
    </div>
  );
}
