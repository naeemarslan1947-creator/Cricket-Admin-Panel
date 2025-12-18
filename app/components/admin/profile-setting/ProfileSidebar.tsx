import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Camera, Upload, User } from 'lucide-react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'

const ProfileSidebar = () => {
  return (
    <div className="lg:col-span-1">
          <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Profile Picture</CardTitle>
              <CardDescription className="text-[#64748b]">Update your profile photo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#00C853] to-[#007BFF] flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-[#e2e8f0] flex items-center justify-center hover:bg-slate-50">
                    <Camera className="w-5 h-5 text-[#64748b]" />
                  </button>
                </div>
                <p className="text-sm text-[#64748b] mt-4 text-center">
                  JPG, PNG or GIF. Max size 2MB
                </p>
                <Button variant="outline" className="mt-4 border-[#e2e8f0]">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0]">
                <h4 className="text-sm text-[#1e293b] mb-3">Account Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Status</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Member Since</span>
                    <span className="text-sm text-[#1e293b]">Jan 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Last Login</span>
                    <span className="text-sm text-[#1e293b]">Today, 10:30 AM</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
  )
}

export default ProfileSidebar