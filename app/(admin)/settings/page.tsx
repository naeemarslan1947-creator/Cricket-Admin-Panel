"use client";

import { Shield, Mail, Lock, Users, Database, Edit2, Trash2, UserPlus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Badge } from '@/app/components/ui/badge';
import { useState } from 'react';



export default function SystemSettings() {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);


  // Check if current user is Super Admin
const isSuperAdmin =
  "Super Admin"
  // Admin users list (from LoginPage test users)
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

        {/* Admin Users Management */}
        <TabsContent value="admins" className="space-y-4">
          {!isSuperAdmin && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-amber-900 mb-1">Access Restricted</h4>
                    <p className="text-sm text-amber-700">
                      Only Super Administrators can manage admin users, roles, and permissions. You are currently logged in as <strong>Demo Admin</strong>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1e293b]">Admin Users</CardTitle>
                  <p className="text-sm text-[#64748b]">Manage administrative user accounts</p>
                </div>
                {isSuperAdmin && (
                  <Button 
                    className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
                    onClick={() => setShowAddAdmin(!showAddAdmin)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Admin User
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddAdmin && isSuperAdmin && (
                <Card className="border-[#007BFF] bg-blue-50">
                  <CardContent className="p-4 space-y-4">
                    <h4 className="text-[#1e293b]">Add New Admin User</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="new-name">Full Name</Label>
                        <Input id="new-name" placeholder="John Doe" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="new-email">Email Address</Label>
                        <Input id="new-email" type="email" placeholder="admin@crickit.com" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="new-role">Role</Label>
                        <select id="new-role" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg">
                          <option>Moderator</option>
                          <option>Support</option>
                          <option>Developer</option>
                          <option>Super Admin</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="new-password">Temporary Password</Label>
                        <Input id="new-password" type="password" placeholder="••••••••" className="mt-1" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-[#00C853] hover:bg-[#00a844] text-white">
                        Create Admin User
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddAdmin(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {adminUsers.map((user) => (
                  <Card key={user.id} className="border-[#e2e8f0]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#00C853] to-[#007BFF] flex items-center justify-center shadow-lg">
                            <span className="text-white">{user.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-[#1e293b]">{user.name}</h4>
                              <Badge className={`${user.color} border`}>{user.role}</Badge>
                              <Badge className="bg-green-100 text-green-700">{user.status}</Badge>
                            </div>
                            <p className="text-sm text-[#64748b] mb-2">{user.email}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {user.permissions.map((perm, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-[#94a3b8]">Last login: {user.lastLogin}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {isSuperAdmin ? (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                                className="border-[#e2e8f0]"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              {user.role !== 'Super Admin' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove
                                </Button>
                              )}
                            </>
                          ) : (
                            <Button variant="ghost" size="sm" disabled>
                              <Lock className="w-4 h-4 mr-2" />
                              Locked
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Edit Form */}
                      {editingUser === user.id && isSuperAdmin && (
                        <div className="mt-4 pt-4 border-t border-[#e2e8f0] space-y-4">
                          <h5 className="text-sm text-[#1e293b]">Edit Permissions</h5>
                          <div className="grid grid-cols-2 gap-3">
                            {allPermissions.map((perm) => (
                              <div key={perm.id} className="flex items-start gap-2">
                                <input
                                  type="checkbox"
                                  id={`perm-${user.id}-${perm.id}`}
                                  defaultChecked={user.permissions.includes(perm.name) || user.role === 'Super Admin'}
                                  disabled={user.role === 'Super Admin'}
                                  className="mt-1"
                                />
                                <label htmlFor={`perm-${user.id}-${perm.id}`} className="flex-1">
                                  <span className="text-sm text-[#1e293b] block">{perm.name}</span>
                                  <span className="text-xs text-[#64748b]">{perm.description}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
                              Save Changes
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingUser(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Roles */}
        <TabsContent value="roles" className="space-y-4">
          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Admin Roles & Permissions</CardTitle>
              <p className="text-sm text-[#64748b]">Manage administrative access levels and permissions</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isSuperAdmin && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-amber-900 mb-1">Super Admin Only</h4>
                      <p className="text-sm text-amber-700">
                        Only Super Administrators can modify role permissions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="text-[#1e293b]">Super Admin</h4>
                          <p className="text-sm text-[#64748b]">Full system access - All permissions</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled={!isSuperAdmin}>
                        {isSuperAdmin ? 'Manage' : <Lock className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-[#1e293b]">Moderator</h4>
                          <p className="text-sm text-[#64748b]">Content moderation, user management, reports</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled={!isSuperAdmin}>
                        {isSuperAdmin ? 'Manage' : <Lock className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-[#1e293b]">Support</h4>
                          <p className="text-sm text-[#64748b]">User support, reports, reviews</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled={!isSuperAdmin}>
                        {isSuperAdmin ? 'Manage' : <Lock className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="text-[#1e293b]">Developer</h4>
                          <p className="text-sm text-[#64748b]">System settings, audit logs, analytics</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled={!isSuperAdmin}>
                        {isSuperAdmin ? 'Manage' : <Lock className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="email" className="space-y-4">
          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Email & Notification Templates</CardTitle>
              <p className="text-sm text-[#64748b]">Customize automated email communications</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Welcome Email',
                  'Verification Confirmation',
                  'Password Reset',
                  'Subscription Renewal',
                  'Content Removal Notice',
                  'Youth Safety Alert'
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#007BFF]" />
                      <span className="text-[#1e293b]">{template}</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                      Edit Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Data */}
        <TabsContent value="privacy" className="space-y-4">
          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Privacy & Data Retention</CardTitle>
              <p className="text-sm text-[#64748b]">Configure data privacy and retention policies</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="gdpr">GDPR Compliance Mode</Label>
                    <p className="text-sm text-[#64748b]">Enable strict EU data protection</p>
                  </div>
                  <Switch id="gdpr" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Anonymous Analytics</Label>
                    <p className="text-sm text-[#64748b]">Collect anonymized usage data</p>
                  </div>
                  <Switch id="analytics" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="deletion">Auto-delete Inactive Accounts</Label>
                    <p className="text-sm text-[#64748b]">After 2 years of inactivity</p>
                  </div>
                  <Switch id="deletion" />
                </div>
              </div>
              <div className="pt-4 border-t border-[#e2e8f0]">
                <Label htmlFor="retention">Data Retention Period (days)</Label>
                <Input
                  id="retention"
                  type="number"
                  defaultValue="730"
                  className="mt-2 border-[#e2e8f0]"
                />
              </div>
              <Button className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white">
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security & 2FA */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Security & Two-Factor Authentication</CardTitle>
              <p className="text-sm text-[#64748b]">Configure security and authentication settings</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa-required">Require 2FA for Admins</Label>
                    <p className="text-sm text-[#64748b]">Mandatory two-factor authentication</p>
                  </div>
                  <Switch id="2fa-required" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="session">Session Timeout</Label>
                    <p className="text-sm text-[#64748b]">Auto-logout after inactivity</p>
                  </div>
                  <Switch id="session" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-[#64748b]">Notify on new device login</p>
                  </div>
                  <Switch id="login-alerts" defaultChecked />
                </div>
              </div>
              <div className="pt-4 border-t border-[#e2e8f0]">
                <Label htmlFor="timeout">Session Timeout (minutes)</Label>
                <Input
                  id="timeout"
                  type="number"
                  defaultValue="30"
                  className="mt-2 border-[#e2e8f0]"
                />
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-amber-900 mb-1">Security Recommendation</h4>
                    <p className="text-sm text-amber-700">
                      We recommend enabling 2FA for all admin accounts and setting a session timeout of 30 minutes or less.
                    </p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white">
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
