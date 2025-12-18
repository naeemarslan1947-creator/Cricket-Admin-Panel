import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Lock } from 'lucide-react'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'

interface SecurityData {
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  lastPasswordChange: string;
}

interface SecuritySettingsProps {
  security: SecurityData;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({security}) => {
  return (
    <Card className="border-[#e2e8f0] ">
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
                <Badge className={security.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Password</p>
                  <p className="text-xs text-[#64748b]">Last changed: {security.lastPasswordChange}</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                  Change Password
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Session Timeout</p>
                  <p className="text-xs text-[#64748b]">Auto logout after: {security.sessionTimeout}</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-[#1e293b]">Active Sessions</p>
                  <p className="text-xs text-[#64748b]">Manage your active login sessions</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                  View Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
  )
}

export default SecuritySettings