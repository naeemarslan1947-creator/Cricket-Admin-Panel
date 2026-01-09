
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import {  Clock, Edit2, Plus, Send, Users } from 'lucide-react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { PostCommunicationNotification } from "@/Api's/repo"
import makeRequest from "@/Api's/apiHelper"
import { toastError, toastSuccess } from '@/app/helper/toast'
import { useAuth } from '@/app/hooks/useAuth'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  status: string
  recipients: number
  sentDate: string
  color: string
}

interface NotificationApiResponse {
  response_code?: number
  success?: boolean
  status_code?: number
  message?: string
  error_message?: string | null
  token?: string | null
  result?: unknown
  misc_data?: unknown
}

interface AudienceOption {
  value: string
  label: string
}

interface PushNotificationProps {
  showNewNotification: boolean
  setShowNewNotification: (show: boolean) => void
  sentNotifications: Notification[]
  userTypeOptions: AudienceOption[]
  subscriptionTypeOptions: AudienceOption[]
  loadingAudience: boolean
  triggerRefetch?: () => void
}

const PushNotification: React.FC<PushNotificationProps> = ({
  showNewNotification,
  setShowNewNotification,
  sentNotifications,
  userTypeOptions,
  subscriptionTypeOptions,
  loadingAudience,
  triggerRefetch
}) => {
 const {user} = useAuth();
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [selectedUserType, setSelectedUserType] = useState('')
  const [selectedSubscriptionType, setSelectedSubscriptionType] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Helper to extract clean value from option value
  const extractValue = (optionValue: string): string => {
    if (optionValue.startsWith('user_type_')) return optionValue.replace('user_type_', '')
    if (optionValue.startsWith('admin_type_')) return optionValue.replace('admin_type_', '')
    if (optionValue.startsWith('club_type_')) return optionValue.replace('club_type_', '')
    if (optionValue.startsWith('sub_')) return optionValue.replace('sub_', '')
    return optionValue
  }

  // Handle form submission
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

    setIsSending(true)
    try {
      const response = await makeRequest<NotificationApiResponse>({
        url: PostCommunicationNotification,
        method: 'POST',
        data: {
          created_by: user?._id || '',
          title: title.trim(),
          body: message.trim(),
          user_type: extractValue(selectedUserType),
          user_subscription_type: extractValue(selectedSubscriptionType),
          type: "adminNotification"
        },
      })

      // Check both HTTP status and API response_code for success
      const isApiSuccess = response.data?.response_code === 200 || response.data?.success === true
      if ((response.status === 200 || response.status === 201) && isApiSuccess) {
        toastSuccess('Notification sent successfully!')
        // Reset form
        setTitle('')
        setMessage('')
        setSelectedUserType('')
        setSelectedSubscriptionType('')
        setShowNewNotification(false)
        // Trigger refetch to update the list
        triggerRefetch?.()
      } else {
        toastError(response.data?.message || 'Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      const axiosError = error as { response?: { data?: { message?: string } } }
      toastError(axiosError?.response?.data?.message || 'Failed to send notification')
    } finally {
      setIsSending(false)
    }
  }
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
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="col-span-2">
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

                      <div>
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
                      </div>

                   
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
                      <Button 
                        className="bg-[#00C853] hover:bg-[#00a844] text-white"
                        onClick={handleSubmit}
                        disabled={isSending}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isSending ? 'Sending...' : 'Send Now'}
                      </Button>
                     
                      <Button variant="outline" onClick={() => setShowNewNotification(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                          {/* <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                              <Edit2 className="w-4 h-4 mr-1" />
                              Resend
                            </Button>
                          </div> */}
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