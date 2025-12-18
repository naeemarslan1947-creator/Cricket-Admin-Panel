import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Database, Lock, Shield, Users } from 'lucide-react'
import { Button } from '../../ui/button'

interface AdminRolesProps {
  isSuperAdmin: string
}

const AdminRoles: React.FC<AdminRolesProps> = ({ isSuperAdmin }) => {
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
  )
}

export default AdminRoles