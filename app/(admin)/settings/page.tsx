"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { useState, useEffect } from 'react';
import AdminUsersManagement from '@/app/components/admin/settings/AdminUsersManagement';
import AdminRoles from '@/app/components/admin/settings/AdminRoles';
import EmailTemplates from '@/app/components/admin/settings/EmailTemplates';
import PrivacyData from '@/app/components/admin/settings/PrivacyData';
import Security2FA from '@/app/components/admin/settings/Security2FA';
import makeRequest from "@/Api's/apiHelper";
import { GetRolePermission, GetAllRoles } from "@/Api's/repo";

/* -------------------- Types -------------------- */

interface RolePermission {
  _id: string;
  name: string;
  action: string[];
  permission_type: string;
  action_type: number;
  updated_at: string;
  created_at: string;
  __v: number;
}

interface AdminUserData {
  _id: string;
  user_id: {
    _id: string;
    email: string;
    full_name?: string;
    action_type: number;
    updated_at: string;
    created_at: string;
    profile_pic?: string;
  };
  permission: {
    _id: string;
    name: string;
    action: string[];
    permission_type: string;
    action_type: number;
    updated_at: string;
    created_at: string;
    __v: number;
  };
  action_type: number;
  updated_at: string;
  created_at: string;
  __v: number;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  status: string;
  lastLogin: string;
  color: string;
}



export default function SystemSettings() {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  const fetchRolePermissions = async () => {
    setLoadingRoles(true);
    try {
      const response = await makeRequest<{ result: RolePermission[] }>({
        url: GetRolePermission,
        method: "GET",
      });
      console.log('GetRolePermission Response:', response);
      
      if (response.data?.result) {
        setRolePermissions(response.data.result);
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchAllRoles = async () => {
    try {
      const response = await makeRequest<{ result: AdminUserData[] }>({
        url: GetAllRoles,
        method: "GET",
      });
      console.log('GetAllRoles Response:', response);
      
      if (response.data?.result) {
        const mappedUsers: AdminUser[] = response.data.result.map((item: AdminUserData) => {
          // Determine status based on action_type
          let status = 'Active';
          let color = 'bg-gray-100 text-gray-700 border-gray-200';
          
          if (item.user_id.action_type === 3) {
            status = 'Deleted';
            color = 'bg-red-100 text-red-700 border-red-200';
          } else if (item.user_id.action_type === 4) {
            status = 'Suspended';
            color = 'bg-orange-100 text-orange-700 border-orange-200';
          } else if (item.user_id.action_type === 1 || item.user_id.action_type === 2) {
            color = 'bg-green-100 text-green-700 border-green-200';
          }
          
          return {
            id: item._id,
            email: item.user_id.email,
            name: item.user_id.full_name || 'Unknown',
            role: item.permission.name,
            permissions: item.permission.action,
            status: status,
            lastLogin: new Date(item.updated_at).toLocaleString(),
            color: color
          };
        });
        
        setAdminUsers(mappedUsers);
      }
    } catch (error) {
      console.error('Error fetching all roles:', error);
    }
  };

  useEffect(() => {
    fetchRolePermissions();
    fetchAllRoles();
  }, []);

const isSuperAdmin =
  "Super Admin"

  const allPermissions = [
    { id: 'all', name: 'All Permissions', description: 'Full system access' },
    { id: 'content_moderation', name: 'Content Moderation', description: 'Moderate user content' },
    { id: 'user_management', name: 'User Management', description: 'Manage user accounts' },
    { id: 'club_management', name: 'Club Management', description: 'Manage clubs' },
    { id: 'reports', name: 'Reports & Abuse', description: 'Handle reports' },
    { id: 'reviews', name: 'Reviews', description: 'Manage reviews' },
    { id: 'system_settings', name: 'System Settings', description: 'Configure system' },
    { id: 'audit_logs', name: 'Audit Logs', description: 'View activity logs' },
    { id: 'analytics', name: 'Analytics', description: 'View analytics' },
    { id: 'billing', name: 'Billing', description: 'Manage billing' },
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
          {/* <TabsTrigger value="privacy">Privacy & Data</TabsTrigger> */}
          {/* <TabsTrigger value="security">Security & 2FA</TabsTrigger> */}
        </TabsList>

        <TabsContent value="admins" className="space-y-4">
        <AdminUsersManagement 
            rolePermissions={rolePermissions}
            onRoleRefetch={fetchAllRoles}
         isSuperAdmin={isSuperAdmin}  setShowAddAdmin={setShowAddAdmin} showAddAdmin={showAddAdmin} adminUsers={adminUsers} setEditingUser={setEditingUser} editingUser={editingUser}  />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
         <AdminRoles 
            isSuperAdmin={isSuperAdmin} 
            rolePermissions={rolePermissions}
            loadingRoles={loadingRoles}
            allPermissions={allPermissions}
            onRoleRefetch={fetchRolePermissions}
          />
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
