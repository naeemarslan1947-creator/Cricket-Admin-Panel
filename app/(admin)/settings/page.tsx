"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useState } from 'react';
import AdminUsersManagement from '@/app/components/admin/settings/AdminUsersManagement';
import AdminRoles from '@/app/components/admin/settings/AdminRoles';
import EmailTemplates from '@/app/components/admin/settings/EmailTemplates';
import PrivacyData from '@/app/components/admin/settings/PrivacyData';
import Security2FA from '@/app/components/admin/settings/Security2FA';

export default function SystemSettings() {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);

const isSuperAdmin =
  "Super Admin"
  const adminUsers = [
    {
      id: '1',
      email: 'superadmin@crickit.com',
      name: 'John Smith',
      role: 'Super Admin',
      permissions: ['All Permissions'],
      status: 'Active',
      lastLogin: '2024-12-04 10:30 AM',
      color: 'bg-red-100 text-red-700 border-red-200'
    },
    {
      id: '2',
      email: 'moderator@crickit.com',
      name: 'Sarah Wilson',
      role: 'Moderator',
      permissions: ['Content Moderation', 'User Management', 'Reports'],
      status: 'Active',
      lastLogin: '2024-12-04 09:15 AM',
      color: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: '3',
      email: 'support@crickit.com',
      name: 'Mike Johnson',
      role: 'Support',
      permissions: ['Reports', 'User Support', 'Reviews'],
      status: 'Active',
      lastLogin: '2024-12-03 05:20 PM',
      color: 'bg-green-100 text-green-700 border-green-200'
    },
    {
      id: '4',
      email: 'developer@crickit.com',
      name: 'Emma Davis',
      role: 'Developer',
      permissions: ['System Settings', 'Audit Logs', 'Analytics'],
      status: 'Active',
      lastLogin: '2024-12-03 03:10 PM',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ];

  const allPermissions = [
    { id: 'all', name: 'All Permissions', description: 'Full system access' },
    { id: 'content_moderation', name: 'Content Moderation', description: 'Moderate user content' },
    { id: 'user_management', name: 'User Management', description: 'Manage user accounts' },
    { id: 'club_management', name: 'Club Management', description: 'Manage clubs' },
    { id: 'reports', name: 'Reports & Abuse', description: 'Handle reports' },
    { id: 'reviews', name: 'Reviews', description: 'Manage reviews' },
    { id: 'user_support', name: 'User Support', description: 'Support tickets' },
    { id: 'system_settings', name: 'System Settings', description: 'Configure system' },
    { id: 'audit_logs', name: 'Audit Logs', description: 'View activity logs' },
    { id: 'analytics', name: 'Analytics', description: 'View analytics' },
    { id: 'billing', name: 'Billing', description: 'Manage billing' },
    { id: 'youth_safety', name: 'Youth Safety', description: 'Safety controls' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-[#1e293b] mb-1">System Settings</h1>
        <p className="text-[#64748b]">Configure platform settings and administrative controls</p>
      </div>

      <Tabs defaultValue="admins" className="space-y-4">
        <TabsList>
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
          <TabsTrigger value="roles">Admin Roles</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
          <TabsTrigger value="security">Security & 2FA</TabsTrigger>
        </TabsList>

        <TabsContent value="admins" className="space-y-4">
        <AdminUsersManagement isSuperAdmin={isSuperAdmin} setShowAddAdmin={setShowAddAdmin} showAddAdmin={showAddAdmin} adminUsers={adminUsers} setEditingUser={setEditingUser} editingUser={editingUser} allPermissions={allPermissions}  />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
         <AdminRoles isSuperAdmin={isSuperAdmin} />
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <EmailTemplates />
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
         <PrivacyData />  
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Security2FA />
        </TabsContent>
      </Tabs>
    </div>
  );
}
