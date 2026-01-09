import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { AlertCircle, Edit2, Lock, Trash2, UserPlus } from 'lucide-react'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import makeRequest from "@/Api's/apiHelper"
import { AdminUserCreation, UpdateAdminProfile } from "@/Api's/repo"
import { toastSuccess, toastError } from '@/app/helper/toast'

/* -------------------- Types -------------------- */

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: string
  color: string
  permissions: string[]
  lastLogin: string
}

interface RolePermission {
  _id: string
  name: string
  action: string[]
  permission_type: string
  action_type: number
  updated_at: string
  created_at: string
  __v: number
}

interface AdminUsersManagementProps {
  isSuperAdmin: string
  showAddAdmin: boolean
  setShowAddAdmin: React.Dispatch<React.SetStateAction<boolean>>
  adminUsers: AdminUser[]
  editingUser: string | null
  setEditingUser: React.Dispatch<React.SetStateAction<string | null>>
  rolePermissions: RolePermission[]
  onRoleRefetch: () => Promise<void>
}

const AdminUsersManagement: React.FC<AdminUsersManagementProps> = ({
  isSuperAdmin,
  setShowAddAdmin,
  showAddAdmin,
  adminUsers,
  setEditingUser,
  editingUser,
  rolePermissions,
  onRoleRefetch,
}) => {
  console.log("📢[AdminUsersManagement.tsx:55]: rolePermissions: ", rolePermissions);
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRoleId, setNewUserRoleId] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  
  // Edit form state
  const [editUserName, setEditUserName] = useState('')
  const [editUserEmail, setEditUserEmail] = useState('')
  const [editUserRoleId, setEditUserRoleId] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCreateAdminUser = async () => {
    if (!newUserName || !newUserEmail || !newUserRoleId || !newUserPassword) {
      toastError('Please fill in all fields')
      return
    }

    setIsCreating(true)
    try {
      const body = {
        full_name: newUserName,
        email: newUserEmail,
        permission_id: newUserRoleId,
        password: newUserPassword,
        is_admin: true
      }

      const response = await makeRequest({
        url: AdminUserCreation,
        method: 'POST',
        data: body,
      })

      console.log("📢[AdminUsersManagement.tsx:85]: response: ", response)
      toastSuccess('Admin user created successfully')
      
      // Reset form and close
      setNewUserName('')
      setNewUserEmail('')
      setNewUserRoleId('')
      setNewUserPassword('')
      setShowAddAdmin(false)
      await onRoleRefetch()
    } catch (error) {
      toastError('Failed to create admin user')
      console.error('Error creating admin user:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateAdminUser = async () => {
    if (!editingUser || !editUserName || !editUserEmail || !editUserRoleId) {
      toastError('Please fill in all fields')
      return
    }

    setIsUpdating(true)
    try {
      // Create FormData for file uploads
      const formData = new FormData()
      formData.append('_id', editingUser)
      formData.append('full_name', editUserName)
      formData.append('email', editUserEmail)
      formData.append('permission_id', editUserRoleId)
      formData.append('is_admin', 'true')

      const response = await makeRequest({
        url: UpdateAdminProfile,
        method: 'POST',
        data: formData,
      })

      console.log("📢[AdminUsersManagement.tsx:112]: response: ", response)
      toastSuccess('Admin user updated successfully')
      
      // Reset edit form and close
      setEditUserName('')
      setEditUserEmail('')
      setEditUserRoleId('')
      setEditingUser(null)
      await onRoleRefetch()
    } catch (error) {
      toastError('Failed to update admin user')
      console.error('Error updating admin user:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const resetForm = () => {
    setNewUserName('')
    setNewUserEmail('')
    setNewUserRoleId('')
    setNewUserPassword('')
    setShowAddAdmin(false)
  }

  const resetEditForm = () => {
    setEditUserName('')
    setEditUserEmail('')
    setEditUserRoleId('')
    setEditingUser(null)
  }

  // Initialize edit form when editingUser changes
  React.useEffect(() => {
    if (editingUser) {
      const userToEdit = adminUsers.find(user => user.id === editingUser)
      if (userToEdit) {
        setEditUserName(userToEdit.name)
        setEditUserEmail(userToEdit.email)
        // Find the role permission that matches the role name
        const matchingRole = rolePermissions.find(rp => rp.name === userToEdit.role)
        if (matchingRole) {
          setEditUserRoleId(matchingRole._id)
        }
      }
    } else {
      resetEditForm()
    }
  }, [editingUser, adminUsers, rolePermissions])

  return (
    <div>
      {!isSuperAdmin && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm text-amber-900 mb-1">
                  Access Restricted
                </h4>
                <p className="text-sm text-amber-700">
                  Only Super Administrators can manage admin users, roles, and
                  permissions. You are currently logged in as{' '}
                  <strong>Demo Admin</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1e293b]">
                Admin Users
              </CardTitle>
              <p className="text-sm text-[#64748b]">
                Manage administrative user accounts
              </p>
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
                <h4 className="text-[#1e293b]">
                  Add New Admin User
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Full Name</Label>
                    <Input
                      id="new-name"
                      placeholder="John Doe"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-email">Email Address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="admin@crickit.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-role">Role</Label>
                    <select
                      id="new-role"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                      value={newUserRoleId}
                      onChange={(e) => setNewUserRoleId(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      {rolePermissions.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="new-password">
                      Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-[#00C853] hover:bg-[#00a844] text-white"
                    onClick={handleCreateAdminUser}
                    disabled={isCreating}
                  >
                    {isCreating ? 'Creating...' : 'Create Admin User'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={isCreating}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Admin User Form */}
          {editingUser && isSuperAdmin && (
            <Card className="border-[#FF9800] bg-orange-50">
              <CardContent className="p-4 space-y-4">
                <h4 className="text-[#1e293b]">
                  Edit Admin User
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      placeholder="John Doe"
                      value={editUserName}
                      onChange={(e) => setEditUserName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-email">Email Address</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      placeholder="admin@crickit.com"
                      value={editUserEmail}
                      onChange={(e) => setEditUserEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-role">Role</Label>
                    <select
                      id="edit-role"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                      value={editUserRoleId}
                      onChange={(e) => setEditUserRoleId(e.target.value)}
                    >
                      <option value="">Select Role</option>
                      {rolePermissions.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
                    onClick={handleUpdateAdminUser}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update Admin User'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetEditForm}
                    disabled={isUpdating}
                  >
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
                        <span className="text-white">
                          {user.name.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[#1e293b]">
                            {user.name}
                          </h4>
                          <Badge className={`${user.color} border`}>
                            {user.role}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700">
                            {user.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-[#64748b] mb-2">
                          {user.email}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {user.permissions.map((perm) => (
                            <Badge
                              key={perm}
                              variant="outline"
                              className="text-xs"
                            >
                              {perm}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-xs text-[#94a3b8]">
                          Last login: {user.lastLogin}
                        </p>
                      </div>
                    </div>

                    {/* <div className="flex gap-2">
                      {isSuperAdmin ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditingUser(
                                editingUser === user.id
                                  ? null
                                  : user.id
                              )
                            }
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
                    </div> */}
                  </div>

                 
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminUsersManagement
