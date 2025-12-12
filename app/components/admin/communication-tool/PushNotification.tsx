import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Calendar, Clock, Edit2, Plus, Send, Users } from 'lucide-react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'

const PushNotification = ({showNewNotification,setShowNewNotification,sentNotifications}) => {
  return (
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

                      <div>
                        <Label htmlFor="notif-icon">Icon</Label>
                        <select id="notif-icon" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="bell">Bell</option>
                          <option value="star">Star</option>
                          <option value="alert">Alert</option>
                          <option value="info">Info</option>
                          <option value="trophy">Trophy</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="notif-link">Action Link (Optional)</Label>
                        <Input 
                          id="notif-link" 
                          placeholder="/dashboard" 
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="notif-silent" className="rounded" />
                        <Label htmlFor="notif-silent">Silent notification (no sound)</Label>
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
                            <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                              View Stats
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
  )
}

export default PushNotification