"use client";
import { useState } from 'react';
import { User, Mail, Phone, Bell, Lock, Upload, Camera, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';



export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Rahul Sharma',
    email:  'rahul.sharma@crickit.com',
    phone: '+91 98765 43210',
    role:  'Super Admin',
    department: 'Platform Operations',
    location: 'Mumbai, India',
    timezone: 'Asia/Kolkata (GMT+5:30)',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    securityAlerts: true,
    weeklyReports: true,
    systemUpdates: true,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    sessionTimeout: '30 minutes',
    lastPasswordChange: 'Nov 5, 2024',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field: string) => {
    setNotifications(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSave = () => {
    console.log('Saving profile settings:', formData);
    setIsEditing(false);
    // Here you would make an API call to save the data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      'Super Admin': 'bg-red-100 text-red-700',
      'Moderator': 'bg-blue-100 text-blue-700',
      'Support': 'bg-green-100 text-green-700',
      'Developer': 'bg-purple-100 text-purple-700',
    };
    return colors[roleName] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1e293b] mb-1">Profile Settings</h1>
          <p className="text-[#64748b]">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                className="border-[#e2e8f0]"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                className="bg-[#00C853] hover:bg-[#00A843] text-white"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture */}
        <div className="lg:col-span-1">
          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Profile Picture</CardTitle>
              <CardDescription className="text-[#64748b]">Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00C853] to-[#007BFF] flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-[#e2e8f0] flex items-center justify-center hover:bg-slate-50">
                    <Camera className="w-5 h-5 text-[#64748b]" />
                  </button>
                </div>
                <p className="text-sm text-[#64748b] mt-4 text-center">
                  JPG, PNG or GIF. Max size 2MB
                </p>
                <Button variant="outline" className="mt-4 border-[#e2e8f0]">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0]">
                <h4 className="text-sm text-[#1e293b] mb-3">Account Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Status</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Member Since</span>
                    <span className="text-sm text-[#1e293b]">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Last Login</span>
                    <span className="text-sm text-[#1e293b]">Today, 10:30 AM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Personal Information</CardTitle>
              <CardDescription className="text-[#64748b]">Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1e293b]">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 border-[#e2e8f0]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1e293b]">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 border-[#e2e8f0]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1e293b]">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 border-[#e2e8f0]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[#1e293b]">Role</Label>
                  <div className="flex items-center h-10">
                    <Badge className={`${getRoleColor(formData.role)} hover:${getRoleColor(formData.role)}`}>
                      {formData.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-[#1e293b]">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    disabled={!isEditing}
                    className="border-[#e2e8f0]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[#1e293b]">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="border-[#e2e8f0]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="timezone" className="text-[#1e293b]">Timezone</Label>
                  <Input
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    disabled={!isEditing}
                    className="border-[#e2e8f0]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b] flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-[#64748b]">Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Two-Factor Authentication</p>
                  <p className="text-xs text-[#64748b]">Add an extra layer of security</p>
                </div>
                <Badge className={security.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Password</p>
                  <p className="text-xs text-[#64748b]">Last changed: {security.lastPasswordChange}</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Session Timeout</p>
                  <p className="text-xs text-[#64748b]">Auto logout after: {security.sessionTimeout}</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Active Sessions</p>
                  <p className="text-xs text-[#64748b]">Manage your active login sessions</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                  View Sessions
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
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

          {/* Danger Zone */}
          <Card className="border-red-200 ">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription className="text-[#64748b]">Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm text-[#1e293b]">Deactivate Account</p>
                  <p className="text-xs text-[#64748b]">Temporarily disable your account</p>
                </div>
                <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                  Deactivate
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm text-[#1e293b]">Delete Account</p>
                  <p className="text-xs text-[#64748b]">Permanently delete your account and data</p>
                </div>
                <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
