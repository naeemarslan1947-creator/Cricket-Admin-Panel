import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { AlertCircle, Edit2, Lock, Trash2, UserPlus } from 'lucide-react'
import { Button } from '../../ui/button'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'

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

interface Permission {
  id: string
  name: string
  description: string
}

interface AdminUsersManagementProps {
  isSuperAdmin: string
  showAddAdmin: boolean
  setShowAddAdmin: React.Dispatch<React.SetStateAction<boolean>>
  adminUsers: AdminUser[]
  editingUser: string | null
  setEditingUser: React.Dispatch<React.SetStateAction<string | null>>
  allPermissions: Permission[]
}

const AdminUsersManagement: React.FC<AdminUsersManagementProps> = ({
  isSuperAdmin,
  setShowAddAdmin,
  showAddAdmin,
  adminUsers,
  setEditingUser,
  editingUser,
  allPermissions,
}) => {
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
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-email">Email Address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="admin@crickit.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-role">Role</Label>
                    <select
                      id="new-role"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option>Moderator</option>
                      <option>Support</option>
                      <option>Developer</option>
                      <option>Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="new-password">
                      Temporary Password
                    </Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-[#00C853] hover:bg-[#00a844] text-white">
                    Create Admin User
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddAdmin(false)}
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

                    <div className="flex gap-2">
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
                    </div>
                  </div>

                  {editingUser === user.id && isSuperAdmin && (
                    <div className="mt-4 pt-4 border-t border-[#e2e8f0] space-y-4">
                      <h5 className="text-sm text-[#1e293b]">
                        Edit Permissions
                      </h5>

                      <div className="grid grid-cols-2 gap-3">
                        {allPermissions.map((perm) => (
                          <div
                            key={perm.id}
                            className="flex items-start gap-2"
                          >
                            <input
                              type="checkbox"
                              id={`perm-${user.id}-${perm.id}`}
                              defaultChecked={
                                user.permissions.includes(perm.name) ||
                                user.role === 'Super Admin'
                              }
                              disabled={user.role === 'Super Admin'}
                              className="mt-1"
                            />
                            <label
                              htmlFor={`perm-${user.id}-${perm.id}`}
                              className="flex-1"
                            >
                              <span className="text-sm text-[#1e293b] block">
                                {perm.name}
                              </span>
                              <span className="text-xs text-[#64748b]">
                                {perm.description}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
                        >
                          Save Changes
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(null)}
                        >
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
    </div>
  )
}

export default AdminUsersManagement
