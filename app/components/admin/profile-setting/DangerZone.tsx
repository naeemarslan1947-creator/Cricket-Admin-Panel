import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'

const DangerZone = () => {
  return (
              <Card className="border-red-200 ">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription className="text-[#64748b]">Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm text-[#1e293b]">Deactivate Account</p>
                  <p className="text-xs text-[#64748b]">Temporarily disable your account</p>
                </div>
                <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                  Deactivate
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm text-[#1e293b]">Delete Account</p>
                  <p className="text-xs text-[#64748b]">Permanently delete your account and data</p>
                </div>
                <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
  )
}

export default DangerZone