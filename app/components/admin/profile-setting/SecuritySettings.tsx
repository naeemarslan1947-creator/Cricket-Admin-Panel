import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Lock, Eye, EyeOff, X } from 'lucide-react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'

import makeRequest from "@/Api's/apiHelper";
import { UpdatePassword } from "@/Api's/repo";
import { toastSuccess, toastError } from "@/app/helper/toast";


interface PasswordFormData {
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const SecuritySettings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<PasswordFormData>({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const getUserEmail = (): string => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const user = JSON.parse(storedUser)
      return user.email || ''
    }
    return ''
  }

  const handleOpenModal = () => {
    setFormData({
      email: getUserEmail(),
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setShowPasswordModal(true)
  }

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toastError("New password and confirm password do not match.")
      return
    }
    
    setIsLoading(true)
    try {
      const payload = {
        email: formData.email,
        old_password: formData.currentPassword,
        new_password: formData.newPassword,
      }

      await makeRequest({
        method: "POST",
        url: UpdatePassword,
        data: payload,
      })

      toastSuccess("Password changed successfully!")
      setShowPasswordModal(false)
      setFormData({
        email: getUserEmail(),
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      console.error('Failed to change password:', error)
      toastError("Failed to change password. Please check your current password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="border-[#e2e8f0]">
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
            <Badge className= 'bg-green-100 text-green-700'>
              Enabled
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-[#1e293b]">Password</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-[#e2e8f0]"
              onClick={handleOpenModal}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
              <h3 className="text-lg font-semibold text-[#1e293b]">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 hover:bg-[#F8FAFC] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#64748b]" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">
                  Email
                </label>
                <Input
                  type="email"
                  disabled
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="border-[#e2e8f0] focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20"
                />
              </div>

              {/* Current Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">
                  Current Password
                </label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                    className="border-[#e2e8f0] pr-10 focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1e293b] transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    className="border-[#e2e8f0] pr-10 focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1e293b] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-[#64748b]">
                  Password must be at least 8 characters with numbers and special characters
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1e293b]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    className="border-[#e2e8f0] pr-10 focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1e293b] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e2e8f0] bg-[#F8FAFC]">
              <Button
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
                className="border-[#e2e8f0]"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !formData.email || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                className="bg-[#007BFF] hover:bg-[#0056b3]"
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SecuritySettings
