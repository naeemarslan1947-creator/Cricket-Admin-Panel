
import React from 'react'
import { Switch } from '../../ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Bell } from 'lucide-react'

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsAlerts: boolean
  securityAlerts: boolean
  weeklyReports: boolean
  systemUpdates: boolean
}

interface NotificationPreferencesProps {
  notifications: NotificationSettings
  handleNotificationToggle: (key: keyof NotificationSettings) => void
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({notifications, handleNotificationToggle}) => {
  return (
    <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b] flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-[#64748b]">Choose what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Email Notifications</p>
                  <p className="text-xs text-[#64748b]">Receive notifications via email</p>
                </div>
                <Switch 
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Push Notifications</p>
                  <p className="text-xs text-[#64748b]">Receive browser push notifications</p>
                </div>
                <Switch 
                  checked={notifications.pushNotifications}
                  onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">SMS Alerts</p>
                  <p className="text-xs text-[#64748b]">Receive important alerts via SMS</p>
                </div>
                <Switch 
                  checked={notifications.smsAlerts}
                  onCheckedChange={() => handleNotificationToggle('smsAlerts')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Security Alerts</p>
                  <p className="text-xs text-[#64748b]">Critical security notifications</p>
                </div>
                <Switch 
                  checked={notifications.securityAlerts}
                  onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Weekly Reports</p>
                  <p className="text-xs text-[#64748b]">Weekly summary of platform activity</p>
                </div>
                <Switch 
                  checked={notifications.weeklyReports}
                  onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">System Updates</p>
                  <p className="text-xs text-[#64748b]">Platform updates and maintenance</p>
                </div>
                <Switch 
                  checked={notifications.systemUpdates}
                  onCheckedChange={() => handleNotificationToggle('systemUpdates')}
                />
              </div>
            </CardContent>
          </Card>
  )
}

export default NotificationPreferences