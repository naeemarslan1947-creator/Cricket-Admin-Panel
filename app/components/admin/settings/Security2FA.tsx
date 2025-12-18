import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Input } from '../../ui/input'
import { Lock } from 'lucide-react'
import { Button } from '../../ui/button'

const Security2FA = () => {
  return (
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
  )
}

export default Security2FA