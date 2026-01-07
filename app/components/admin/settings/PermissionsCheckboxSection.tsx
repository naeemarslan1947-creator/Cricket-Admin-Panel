import React, { useState } from 'react'
import { Button } from '../../ui/button'

/* -------------------- Types -------------------- */

export interface Permission {
  id: string
  name: string
  description: string
}

interface PermissionsCheckboxSectionProps {
  permissions: Permission[]
  selectedPermissions: string[]
  roleName: string
  roleId: string
  isRoleSuperAdmin: boolean
  isSaving?: boolean
  onSave: (updatedPermissions: string[], roleId: string, roleName: string) => void
  onCancel: () => void
}

const PermissionsCheckboxSection: React.FC<PermissionsCheckboxSectionProps> = ({
  permissions,
  selectedPermissions,
  roleName,
  roleId,
  isRoleSuperAdmin,
  isSaving,
  onSave,
  onCancel,
}) => {
  console.log("📢[PermissionsCheckboxSection.tsx:33]: isRoleSuperAdmin: ", isRoleSuperAdmin);
  const [checkedPermissions, setCheckedPermissions] = useState<string[]>(selectedPermissions)

  // Check if "All Permissions" is in the list
  const allPermissionName = permissions.find(p => p.id === 'all')?.name

  const handleCheckboxChange = (permissionName: string, isChecked: boolean, isAllPermission: boolean) => {
    setCheckedPermissions(prev => {
      if (isChecked) {
        const updated = [...prev, permissionName]
        // If all permissions are now checked, also check "All Permissions"
        if (!isAllPermission && updated.length === permissions.length - 1 && allPermissionName) {
          return [...updated, allPermissionName]
        }
        return updated
      } else {
        const updated = prev.filter(perm => perm !== permissionName)
        // If unchecking an individual permission, also uncheck "All Permissions"
        if (!isAllPermission && allPermissionName) {
          return updated.filter(perm => perm !== allPermissionName)
        }
        return updated
      }
    })
  }

  const handleAllPermissionsChange = (isChecked: boolean) => {
    if (isChecked) {
      // Select all permissions including "All Permissions"
      setCheckedPermissions(permissions.map(p => p.name))
    } else {
      // Deselect all permissions except "All Permissions" (it will be unchecked too)
      setCheckedPermissions([])
    }
  }

  const handleSave = () => {
    onSave(checkedPermissions, roleId, roleName)
  }

  return (
    <div className="mt-4 pt-4 border-t border-[#e2e8f0] space-y-4">
      <h5 className="text-sm text-[#1e293b]">
        Edit Permissions - {roleName}
      </h5>

      <div className="grid grid-cols-2 gap-3">
        {permissions.map((perm) => (
          <div
            key={perm.id}
            className="flex items-start gap-2"
          >
            <input
              type="checkbox"
              id={`perm-${roleName}-${perm.id}`}
              checked={checkedPermissions.includes(perm.name)}
              // disabled={isRoleSuperAdmin}
              onChange={(e) => {
                if (perm.id === 'all') {
                  handleAllPermissionsChange(e.target.checked)
                } else {
                  handleCheckboxChange(perm.name, e.target.checked, perm.id === 'all')
                }
              }}
              className="mt-1"
            />
            <label
              htmlFor={`perm-${roleName}-${perm.id}`}
              className="flex-1 cursor-pointer"
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
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default PermissionsCheckboxSection

