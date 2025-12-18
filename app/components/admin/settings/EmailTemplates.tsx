import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Mail } from 'lucide-react'
import { Button } from '../../ui/button'

const EmailTemplates = () => {
  return (
    <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Email & Notification Templates</CardTitle>
              <p className="text-sm text-[#64748b]">Customize automated email communications</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  'Welcome Email',
                  'Verification Confirmation',
                  'Password Reset',
                  'Subscription Renewal',
                  'Content Removal Notice',
                  'Youth Safety Alert'
                ].map((template, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#007BFF]" />
                      <span className="text-[#1e293b]">{template}</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                      Edit Template
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
  )
}

export default EmailTemplates