
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { AlertCircle, Clock,  Plus, Send, Target } from 'lucide-react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { toastError, toastSuccess } from '@/app/helper/toast'
import { PostCommunicationNotification } from '@/Api\'s/repo'
import makeRequest from '@/Api\'s/apiHelper'
import { useAuth } from '@/app/hooks/useAuth'

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

interface AudienceOption {
  value: string
  label: string
}
interface ScheduledNotificationApiResponse {
  response_code?: number
  success?: boolean
  status_code?: number
  message?: string
  error_message?: string | null
  token?: string | null
  result?: unknown
  misc_data?: unknown
}


interface ScheduledNotificationsProps {
  scheduledNotifications: ScheduledNotification[]
  setShowNewScheduled: (show: boolean) => void
  showNewScheduled: boolean
  userTypeOptions: AudienceOption[]
  subscriptionTypeOptions: AudienceOption[]
  loadingAudience: boolean
  triggerRefetch?: () => void
}

const ScheduledNotifications: React.FC<ScheduledNotificationsProps> = ({
  scheduledNotifications,
  setShowNewScheduled,
  showNewScheduled,
  userTypeOptions,
  // subscriptionTypeOptions,
  loadingAudience,
  triggerRefetch
}) => {
     const {user}= useAuth()
     const [title, setTitle] = useState('')
      const [message, setMessage] = useState('')
      const [selectedUserType, setSelectedUserType] = useState('')
      const [selectedSubscriptionType, setSelectedSubscriptionType] = useState('')
      const [scheduledAt, setScheduledAt] = useState('')
      const [isSending, setIsSending] = useState(false)
    
      // Helper to extract clean value from option value
      const extractValue = (optionValue: string): string => {
        if (optionValue.startsWith('user_type_')) return optionValue.replace('user_type_', '')
        if (optionValue.startsWith('admin_type_')) return optionValue.replace('admin_type_', '')
        if (optionValue.startsWith('club_type_')) return optionValue.replace('club_type_', '')
        if (optionValue.startsWith('sub_')) return optionValue.replace('sub_', '')
        return optionValue
      }
  
      const handleSubmit = async () => {
          // Validation
          if (!title.trim()) {
            toastError('Please enter a notification title')
            return
          }
          if (!message.trim()) {
            toastError('Please enter a notification message')
            return
          }
          if (!selectedUserType) {
            toastError('Please select a user type')
            return
          }
          if (!selectedSubscriptionType) {
            toastError('Please select a subscription type')
            return
          }
          // if (!scheduledAt) {
          //   toastError('Please select a scheduled date and time')
          //   return
          // }
      
          setIsSending(true)
          try {
            // Convert datetime-local to ISO 8601 format
            const scheduledAtISO = scheduledAt ? new Date(scheduledAt).toISOString() : ''
            
            const response = await makeRequest<ScheduledNotificationApiResponse>({
              url: PostCommunicationNotification,
              method: 'POST',
              data: {
                created_by: user?._id || '',
                title: title.trim(),
                body: message.trim(),
                user_type: extractValue(selectedUserType),
                // user_subscription_type: extractValue(selectedSubscriptionType),
                scheduled_at: scheduledAtISO,
                type: "adminNotification"
              },
            })
      
            // Check both HTTP status and API response_code for success
            const isApiSuccess = response.data?.response_code === 200 || response.data?.success === true
            if ((response.status === 200 || response.status === 201) && isApiSuccess) {
              toastSuccess('Notification scheduled successfully!')
              // Reset form
              setTitle('')
              setMessage('')
              setSelectedUserType('')
              setSelectedSubscriptionType('')
              setScheduledAt('')
              setShowNewScheduled(false)
              // Trigger refetch to update the list
              triggerRefetch?.()
            } else {
              toastError(response.data?.message || 'Failed to schedule notification')
            }
          } catch (error) {
            console.error('Error scheduling notification:', error)
            const axiosError = error as { response?: { data?: { message?: string } } }
            toastError(axiosError?.response?.data?.message || 'Failed to schedule notification')
          } finally {
            setIsSending(false)
          }
        }
  return (
    <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1e293b]">Automated & Scheduled Notifications</CardTitle>
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
                                         value={title}
                                         onChange={(e) => setTitle(e.target.value)}
                                       />
                                     </div>
                                     
                                     <div className="col-span-2">ann
                                       <Label htmlFor="notif-message">Message</Label>
                                       <textarea 
                                         id="notif-message" 
                                         placeholder="Enter your message here..." 
                                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                                         value={message}
                                         onChange={(e) => setMessage(e.target.value)}
                                       />
                                     </div>
               
                                     <div>
                                       <Label htmlFor="notif-user-type">User Type</Label>
                                       <select 
                                         id="notif-user-type" 
                                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                                         disabled={loadingAudience}
                                         value={selectedUserType}
                                         onChange={(e) => setSelectedUserType(e.target.value)}
                                       >
                                         {loadingAudience ? (
                                           <option>Loading...</option>
                                         ) : userTypeOptions.length > 0 ? (
                                           <>
                                             <option value="">Select User Type</option>
                                             {userTypeOptions.map((option) => (
                                               <option key={option.value} value={option.value}>
                                                 {option.label}
                                               </option>
                                             ))}
                                           </>
                                         ) : (
                                           <option value="">No options available</option>
                                         )}
                                       </select>
                                     </div>
               
                                     {/* <div>
                                       <Label htmlFor="notif-subscription-type">Subscription Type</Label>
                                       <select 
                                         id="notif-subscription-type" 
                                         className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                                         disabled={loadingAudience}
                                         value={selectedSubscriptionType}
                                         onChange={(e) => setSelectedSubscriptionType(e.target.value)}
                                       >
                                         {loadingAudience ? (
                                           <option>Loading...</option>
                                         ) : subscriptionTypeOptions.length > 0 ? (
                                           <>
                                             <option value="">All Subscriptions</option>
                                             {subscriptionTypeOptions.map((option) => (
                                               <option key={option.value} value={option.value}>
                                                 {option.label}
                                               </option>
                                             ))}
                                           </>
                                         ) : (
                                           <option value="">No options available</option>
                                         )}
                                       </select>
                                     </div> */}

                                     <div>
                                       <Label htmlFor="scheduled-at">Scheduled Date & Time</Label>
                                       <Input 
                                         id="scheduled-at" 
                                         type="datetime-local" 
                                         className="mt-1"
                                         value={scheduledAt}
                                         onChange={(e) => setScheduledAt(e.target.value)}
                                       />
                                     </div>
               
                                  
                                   </div>
               
                                   <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
                                     <Button 
                                       className="bg-purple-600 hover:bg-purple-700 text-white"
                                       onClick={handleSubmit}
                                       disabled={isSending}
                                     >
                                       <Send className="w-4 h-4 mr-2" />
                                       {isSending ? 'Sending...' : 'Send Now'}
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
                {scheduledNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#64748b] mb-2">No scheduled notifications found</p>
                    <p className="text-sm text-[#94a3b8] mb-4">There are no scheduled notification rules to display.</p>
                  </div>
                ) : (
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
  )
}

export default ScheduledNotifications