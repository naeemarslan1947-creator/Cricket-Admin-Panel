
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Plus, Send } from 'lucide-react'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { toastError, toastSuccess } from '@/app/helper/toast'
import makeRequest from '@/Api\'s/apiHelper'
import { PostCommunicationNotification } from '@/Api\'s/repo'
import { useAuth } from '@/app/hooks/useAuth'

interface Announcement {
  id: string
  title: string
  content: string
  displayLocation: string
  status: string
  views: number
  startDate: string
  endDate: string
}

interface AudienceOption {
  value: string
  label: string
}
interface AnnouncementApiResponse {
  response_code?: number
  success?: boolean
  status_code?: number
  message?: string
  error_message?: string | null
  token?: string | null
  result?: unknown
  misc_data?: unknown
}

interface InAppAnnouncementsProps {
  announcements: Announcement[]
  setShowNewAnnouncement: (show: boolean) => void
  showNewAnnouncement: boolean
  userTypeOptions: AudienceOption[]
  subscriptionTypeOptions: AudienceOption[]
  loadingAudience: boolean
  triggerRefetch?: () => void
}

const InAppAnnouncements: React.FC<InAppAnnouncementsProps> = ({
  announcements,
  setShowNewAnnouncement,
  showNewAnnouncement,
  userTypeOptions,
  // subscriptionTypeOptions,
  loadingAudience,
  triggerRefetch
}) => {
  const {user} = useAuth()
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
        // if (!selectedSubscriptionType) {
        //   toastError('Please select a subscription type')
        //   return
        // }
    
        setIsSending(true)
        try {
          const response = await makeRequest<AnnouncementApiResponse>({
            url: PostCommunicationNotification,
            method: 'POST',
            data: {
          created_by: user?._id || '',
              title: title.trim(),
              body: message.trim(),
              user_type: extractValue(selectedUserType),
              // user_subscription_type: extractValue(selectedSubscriptionType),
              type: "adminAnnouncement"
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
            setShowNewAnnouncement(false)
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
                  <CardTitle className="text-[#1e293b]">In-App Announcements</CardTitle>
                  <p className="text-sm text-[#64748b]">Display banners and modals within the app</p>
                </div>
                <Button 
                  className="bg-[#00C853] hover:bg-[#00a844] text-white"
                  onClick={() => setShowNewAnnouncement(!showNewAnnouncement)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Announcement Form */}
              {showNewAnnouncement && (
                <Card className="border-[#00C853] bg-green-50">
                  <CardContent className="p-4 space-y-4">
                    <h4 className="text-[#1e293b]">Create In-App Announcement</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="ann-title">Announcement Title</Label>
                        <Input 
                          id="ann-title" 
                          placeholder="e.g., Welcome to Crickit!" 
                          className="mt-1"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="col-span-2">ann
                        <Label htmlFor="ann-message">Message</Label>
                        <textarea 
                          id="ann-message" 
                          placeholder="Enter your message here..." 
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="ann-user-type">User Type</Label>
                        <select 
                          id="ann-user-type" 
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
                        <Label htmlFor="ann-subscription-type">Subscription Type</Label>
                        <select 
                          id="ann-subscription-type" 
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
                     
                      <Button variant="outline" onClick={() => setShowNewAnnouncement(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Active Announcements */}
              <div>
                <h4 className="text-[#1e293b] mb-3">Active & Scheduled Announcements</h4>
                {announcements.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#64748b] mb-2">No announcements found</p>
                    <p className="text-sm text-[#94a3b8] mb-4">There are no in-app announcements to display.</p>
                   
                  </div>
                ) : (
                  <div className="space-y-3">
                    {announcements.map((announcement) => (
                      <Card key={announcement.id} className="border-[#e2e8f0]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-[#1e293b]">{announcement.title}</h4>
                                <Badge className={announcement.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                                  {announcement.status}
                                </Badge>
                                <Badge variant="outline">{announcement.displayLocation}</Badge>
                              </div>
                              <p className="text-sm text-[#64748b] mb-2">{announcement.content}</p>
                              <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                                <span>{announcement.views.toLocaleString()} views</span>
                                <span>{announcement.startDate} - {announcement.endDate}</span>
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

export default InAppAnnouncements