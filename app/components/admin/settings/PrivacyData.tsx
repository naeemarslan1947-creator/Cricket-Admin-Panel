import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Label } from '../../ui/label'
import { Switch } from '../../ui/switch'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

const PrivacyData = () => {
  return (
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
  )
}

export default PrivacyData