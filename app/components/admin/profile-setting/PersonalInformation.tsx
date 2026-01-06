import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Label } from '../../ui/label'
import { Mail, Phone, User } from 'lucide-react'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'

interface FormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
}

interface PersonalInformationProps {
  formData: FormData;
  handleInputChange: (field: string, value: string) => void;
  isEditing: boolean;
  getRoleColor: (roleName: string) => string;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({formData, handleInputChange, isEditing, getRoleColor}) => {
  return (
    <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <CardTitle className="text-[#1e293b]">Personal Information</CardTitle>
              <CardDescription className="text-[#64748b]">Update your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1e293b]">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 border-[#e2e8f0]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1e293b]">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 border-[#e2e8f0]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1e293b]">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 border-[#e2e8f0]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[#1e293b]">Role</Label>
                  <div className="flex items-center h-10">
                    <Badge className={`${getRoleColor(formData.role)} hover:${getRoleColor(formData.role)}`}>
                      {formData.role}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-[#1e293b]">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    className="border-[#e2e8f0]"
                  />
                </div>

              </div>
            </CardContent>
          </Card>
  )
}

export default PersonalInformation