
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { AlertCircle, Clock, Edit2, Plus, Send, Target, Trash2 } from 'lucide-react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'

interface ScheduledNotification {
  id: string
  title: string
  message: string
  trigger: string
  targetAudience: string
  status: string
  sentCount: number
  lastTriggered: string
}

interface ScheduledNotificationsProps {
  scheduledNotifications: ScheduledNotification[]
  setShowNewScheduled: (show: boolean) => void
  showNewScheduled: boolean
}

const ScheduledNotifications: React.FC<ScheduledNotificationsProps> = ({scheduledNotifications, setShowNewScheduled, showNewScheduled}) => {
  return (
    <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1e293b]">Automated & Scheduled Notifications</CardTitle>
                  <p className="text-sm text-[#64748b]">Set up trigger-based notifications (e.g., premium expires in 30 days)</p>
                </div>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => setShowNewScheduled(!showNewScheduled)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Info Box */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-blue-900 mb-1">About Scheduled Notifications</h4>
                    <p className="text-sm text-blue-700">
                      Create automated notification rules that trigger based on user behavior or time-based events. These run automatically in the background.
                    </p>
                  </div>
                </div>
              </div>

              {/* New Scheduled Notification Form */}
              {showNewScheduled && (
                <Card className="border-purple-600 bg-purple-50">
                  <CardContent className="p-4 space-y-4">
                    <h4 className="text-[#1e293b]">Create Scheduled Notification Rule</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="sched-name">Rule Name</Label>
                        <Input 
                          id="sched-name" 
                          placeholder="e.g., Premium Expiry Reminder" 
                          className="mt-1"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label htmlFor="sched-trigger">Trigger Condition</Label>
                        <select id="sched-trigger" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="">Select trigger event...</option>
                          <option value="premium-30">Premium expires in 30 days</option>
                          <option value="premium-7">Premium expires in 7 days</option>
                          <option value="premium-1">Premium expires in 1 day</option>
                          <option value="new-user">New user registration</option>
                          <option value="inactive-7">No activity for 7 days</option>
                          <option value="inactive-30">No activity for 30 days</option>
                          <option value="match-reminder">Match starts in 1 hour</option>
                          <option value="birthday">User birthday</option>
                          <option value="milestone">Reached milestone (custom)</option>
                        </select>
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="sched-title">Notification Title</Label>
                        <Input 
                          id="sched-title" 
                          placeholder="e.g., Your premium expires soon!" 
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor="sched-message">Message</Label>
                        <textarea 
                          id="sched-message" 
                          placeholder="Use {name}, {days}, {date} for dynamic values" 
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                        />
                      </div>

                      <div>
                        <Label htmlFor="sched-audience">Target Audience</Label>
                        <select id="sched-audience" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="premium">Premium Users</option>
                          <option value="free">Free Users</option>
                          <option value="all">All Users</option>
                          <option value="club-owners">Club Owners</option>
                          <option value="players">Players</option>
                          <option value="new">New Users</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="sched-time">Send Time</Label>
                        <select id="sched-time" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="immediate">Immediately</option>
                          <option value="morning">9:00 AM</option>
                          <option value="afternoon">2:00 PM</option>
                          <option value="evening">6:00 PM</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="sched-active" className="rounded" defaultChecked />
                        <Label htmlFor="sched-active">Active (start sending immediately)</Label>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Create Rule
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewScheduled(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Rules */}
              <div>
                <h4 className="text-[#1e293b] mb-3">Active Notification Rules</h4>
                <div className="space-y-3">
                  {scheduledNotifications.map((scheduled) => (
                    <Card key={scheduled.id} className="border-[#e2e8f0]">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-[#1e293b]">{scheduled.title}</h4>
                              <Badge className={scheduled.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                                {scheduled.status}
                              </Badge>
                              <Badge variant="outline">{scheduled.targetAudience}</Badge>
                            </div>
                            <p className="text-sm text-[#64748b] mb-2">{scheduled.message}</p>
                            <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                Trigger: {scheduled.trigger}
                              </span>
                              <span className="flex items-center gap-1">
                                <Send className="w-3 h-3" />
                                Sent {scheduled.sentCount} times
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Last: {scheduled.lastTriggered}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            {scheduled.status === 'Active' ? (
                              <Button variant="outline" size="sm" className="border-orange-200 text-orange-600">
                                Pause
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" className="border-green-200 text-green-600">
                                Activate
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="border-red-200 text-red-600">
                              <Trash2 className="w-4 h-4" />
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

export default ScheduledNotifications