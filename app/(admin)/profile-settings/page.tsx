"use client";
import { useState } from 'react';
import ProfileHeader from '@/app/components/admin/profile-setting/ProfileHeader';
import ProfileSidebar from '@/app/components/admin/profile-setting/ProfileSidebar';
import PersonalInformation from '@/app/components/admin/profile-setting/PersonalInformation';
import SecuritySettings from '@/app/components/admin/profile-setting/SecuritySettings';
import NotificationPreferences from '@/app/components/admin/profile-setting/NotificationPreferences';
import DangerZone from '@/app/components/admin/profile-setting/DangerZone';



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
      <ProfileHeader isEditing={isEditing} setIsEditing={setIsEditing} handleSave={handleSave} handleCancel={handleCancel} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileSidebar />

        <div className="lg:col-span-2 space-y-6">
          <PersonalInformation isEditing={isEditing} formData={formData} handleInputChange={handleInputChange} getRoleColor={getRoleColor} />

          <SecuritySettings security={security} />

          <NotificationPreferences notifications={notifications} handleNotificationToggle={handleNotificationToggle} />

          <DangerZone />
        </div>
      </div>
    </div>
  );
}
