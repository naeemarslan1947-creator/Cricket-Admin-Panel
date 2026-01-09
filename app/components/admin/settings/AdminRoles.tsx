import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Database, Lock, Shield, Users, Settings} from 'lucide-react'
import { Button } from '../../ui/button'
import PermissionsCheckboxSection, { Permission } from './PermissionsCheckboxSection'
import Loader from '../../common/Loader'
import makeRequest from "@/Api's/apiHelper"
import { UpdateRolePermission } from "@/Api's/repo"
import { toastSuccess, toastError } from '@/app/helper/toast'


/* -------------------- Types -------------------- */

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

interface AdminRolesProps {
  isSuperAdmin: string
  allPermissions: Permission[]
  rolePermissions: RolePermission[]
  loadingRoles: boolean
  onRoleUpdate?: () => void
  onRoleRefetch?: () => Promise<void>
}

/* -------------------- Dynamic Helper Functions -------------------- */

// Map API permission names to display names
const getPermissionDisplayName = (apiPermission: string): string => {
  const permissionMap: Record<string, string> = {
    'all': 'All Permissions',
    'content_moderation': 'Content Moderation',
    'user_management': 'User Management',
    'club_management': 'Club Management',
    'reports_and_abuse': 'Reports & Abuse',
    'reports_&_abuse': 'Reports & Abuse',
    'reviews_and_ratings': 'Reviews',
    'reviews': 'Reviews',
    'system_settings': 'System Settings',
    'audit_logs': 'Audit Logs',
    'analytics_and_insights': 'Analytics',
    'analytics': 'Analytics',
    'billing': 'Billing',
  }
  
  return permissionMap[apiPermission] || apiPermission
}

// Get role icon dynamically based on role name
const getRoleIcon = (roleName: string): React.ElementType => {
  const normalizedName = roleName.toLowerCase().replace(' ', '-').replace('_', '-')
  
  if (normalizedName.includes('super') || normalizedName.includes('admin')) {
    return Shield
  }
  if (normalizedName.includes('moderator') || normalizedName.includes('moderation')) {
    return Shield
  }
  if (normalizedName.includes('support') || normalizedName.includes('help')) {
    return Users
  }
  if (normalizedName.includes('developer') || normalizedName.includes('dev') || normalizedName.includes('system')) {
    return Database
  }

  return Settings
}

// Map display permission names back to API permission names
const getPermissionApiName = (displayPermission: string): string => {
  const permissionMap: Record<string, string> = {
    'All Permissions': 'all',
    'Content Moderation': 'content_moderation',
    'User Management': 'user_management',
    'Club Management': 'club_management',
    'Reports & Abuse': 'reports_and_abuse',
    'Reports': 'reviews',
    'System Settings': 'system_settings',
    'Audit Logs': 'audit_logs',
    'Analytics': 'analytics',
    'Billing': 'billing',
  }
  
  return permissionMap[displayPermission] || displayPermission
}

// Map API permissions to display permissions, expanding "all" to all permissions
const getDisplayPermissionsFromApi = (apiPermissions: string[], allDisplayPermissions: string[]): string[] => {
  if (apiPermissions.includes('all') || apiPermissions.includes('all_permissions')) {
    return allDisplayPermissions
  }
  return apiPermissions.map(getPermissionDisplayName)
}

// Get role color dynamically based on role name and permissions
const getRoleColor = (roleName: string, permissions: string[]): string => {
  const normalizedName = roleName.toLowerCase().replace(' ', '-').replace('_', '-')
  
  // Check for all permissions (Super Admin)
  if (permissions.includes('all') || permissions.includes('all_permissions')) {
    return 'border-red-200 bg-red-50'
  }
  
  if (normalizedName.includes('super') || normalizedName.includes('admin')) {
    return 'border-red-200 bg-red-50'
  }
  if (normalizedName.includes('moderator') || normalizedName.includes('moderation')) {
    return 'border-blue-200 bg-blue-50'
  }
  if (normalizedName.includes('support') || normalizedName.includes('help')) {
    return 'border-green-200 bg-green-50'
  }
  if (normalizedName.includes('developer') || normalizedName.includes('dev')) {
    return 'border-purple-200 bg-purple-50'
  }
 
  
  return 'border-[#e2e8f0]'
}

// Get role description dynamically based on permissions
const getRoleDescription = (permissions: string[]): string => {
  // If has all permissions
  if (permissions.includes('all') || permissions.includes('all_permissions')) {
    return 'Full system access - All permissions'
  }
  
  const permDescriptions: string[] = []
  
  if (permissions.includes('content_moderation')) {
    permDescriptions.push('Content Moderation')
  }
  if (permissions.includes('user_management')) {
    permDescriptions.push('User Management')
  }
  if (permissions.includes('club_management')) {
    permDescriptions.push('Club Management')
  }
  if (permissions.includes('reports_and_abuse') || permissions.includes('reports') || permissions.includes('reports_&_abuse')) {
    permDescriptions.push('Reports & Abuse')
  }
  if (permissions.includes('reviews_and_ratings') || permissions.includes('reviews')) {
    permDescriptions.push('Reviews')
  }

  if (permissions.includes('system_settings')) {
    permDescriptions.push('System Settings')
  }
  if (permissions.includes('audit_logs')) {
    permDescriptions.push('Audit Logs')
  }
  if (permissions.includes('analytics_and_insights') || permissions.includes('analytics')) {
    permDescriptions.push('Analytics')
  }
  if (permissions.includes('billing')) {
    permDescriptions.push('Billing')
  }
 
  
  if (permDescriptions.length > 0) {
    // Return first 3 permissions as description
    return permDescriptions.slice(0, 3).join(', ') + (permDescriptions.length > 3 ? '...' : '')
  }
  
  return 'Custom role with assigned permissions'
}


const AdminRoles: React.FC<AdminRolesProps> = ({ 
  isSuperAdmin, 
  allPermissions, 
  rolePermissions, 
  loadingRoles,
  onRoleUpdate,
  onRoleRefetch
}) => {
  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [savingRole, setSavingRole] = useState<string | null>(null)

  // Separate function to handle role permission update
  const handleUpdateRolePermissions = async (
    updatedPermissions: string[],
    roleId: string,
    roleName: string
  ): Promise<void> => {
    setSavingRole(roleId)
    try {
      // Convert display permission names back to API permission names
      const apiPermissions = updatedPermissions.map(getPermissionApiName)
      
      // If "All Permissions" is selected, only send "all"
      const finalAction = apiPermissions.includes('all') ? ['all'] : apiPermissions
      
      const body = {
        _id: roleId,
        name: roleName,
        action: finalAction
      }
      
     const response = await makeRequest({
        url: UpdateRolePermission,
        method: 'POST',
        data: body,
      });

      console.log("📢[AdminRoles.tsx:180]: response: ", response);
      toastSuccess('Role permissions updated successfully')
      setEditingRole(null)
      onRoleUpdate?.()
      await onRoleRefetch?.()
    } catch (error) {
      toastError('Failed to update role permissions')
      console.error('Error updating role permissions:', error)
    } finally {
      setSavingRole(null)
    }
  }

  const processedRoles = useMemo(() => {
    const roleMap = new Map<string, RolePermission>()
    
    rolePermissions.forEach(role => {
      const normalizedName = role.name.toLowerCase().replace(' ', '-').replace('_', '-')
      const existing = roleMap.get(normalizedName)
      
      if (!existing || (role.action.length > existing.action.length)) {
        roleMap.set(normalizedName, role)
      }
    })
    
    return Array.from(roleMap.values())
  }, [rolePermissions])

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.includes('all') || permissions.includes('all_permissions')
  }

  return (
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

        {loadingRoles ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : processedRoles.length > 0 ? (
          <div className="space-y-3">
            {processedRoles.map((role) => {
              const Icon = getRoleIcon(role.name)
              const isEditing = editingRole === role._id
              const roleColor = getRoleColor(role.name, role.action)
              const roleDescription = getRoleDescription(role.action)
              const isSuperAdminRole = hasAllPermissions(role.action)

              return (
                <Card key={role._id} className={`border-[#e2e8f0] ${roleColor}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          !isSuperAdminRole ? 'bg-red-100' :
                          roleColor.includes('blue') ? 'bg-blue-100' :
                          roleColor.includes('green') ? 'bg-green-100' :
                          roleColor.includes('purple') ? 'bg-purple-100' :
                          roleColor.includes('indigo') ? 'bg-indigo-100' :
                          roleColor.includes('orange') ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isSuperAdminRole ? 'text-red-600' :
                            roleColor.includes('blue') ? 'text-blue-600' :
                            roleColor.includes('green') ? 'text-green-600' :
                            roleColor.includes('purple') ? 'text-purple-600' :
                            roleColor.includes('indigo') ? 'text-indigo-600' :
                            roleColor.includes('orange') ? 'text-orange-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="text-[#1e293b]">{role.name}</h4>
                          <p className="text-sm text-[#64748b]">{roleDescription}</p>
                          <p className="text-xs text-[#64748b] mt-1">
                            {role.action.length} permission{role.action.length !== 1 ? 's' : ''} assigned
                          </p>
                        </div>
                      </div>
                     {role.name !== "Super-Admin" && <Button
                        variant="outline"
                        size="sm"
                        disabled={!isSuperAdmin}
                        onClick={() => setEditingRole(isEditing ? null : role._id)}
                      >
                        {isSuperAdmin ? (isEditing ? 'Close' : 'Manage') : <Lock className="w-4 h-4" />}
                      </Button>}
                    </div>

                    {isEditing && isSuperAdmin && (
                      <PermissionsCheckboxSection
                        permissions={allPermissions}
                        selectedPermissions={getDisplayPermissionsFromApi(role.action, allPermissions.map(p => p.name))}
                        roleName={role.name}
                        roleId={role._id}
                        isRoleSuperAdmin={isSuperAdminRole}
                        isSaving={savingRole === role._id}
                        onSave={handleUpdateRolePermissions}
                        onCancel={() => setEditingRole(null)}
                      />
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-[#64748b]">
            No roles found. Please try again.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminRoles
