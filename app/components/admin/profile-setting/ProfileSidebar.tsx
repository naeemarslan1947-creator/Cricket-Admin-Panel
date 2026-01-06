import React, { RefObject } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Camera, Upload, User } from 'lucide-react'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'

// Base URL for API images
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface UserData {
  _id?: string;
  full_name?: string;
  name?: string;
  user_name?: string;
  email?: string;
  phone_number?: string;
  role?: { name?: string } | string | unknown[];
  profile_pic?: string;
  address?: string;
  is_admin?: boolean;
  created_at?: string;
  last_active?: string;
}

interface ProfileSidebarProps {
  userData: UserData | null;
  avatarUrl: string | null;
  isEditing: boolean;
  onProfilePicChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef?: RefObject<HTMLInputElement | null>;
}

// Helper function to get full image URL
const getFullImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // If it's already an absolute URL or a blob URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url;
  }
  
  // If it's a relative path, prepend BASE_URL
  return `${BASE_URL}${url}`;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  userData, 
  avatarUrl, 
  isEditing,
  fileInputRef
}) => {
  // Handle camera click to trigger file input
  const handleCameraClick = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();
    }
  };


  // Get full image URL with BASE_URL
  const fullAvatarUrl = getFullImageUrl(avatarUrl);

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
                  {fullAvatarUrl ? (
                    <img 
                      src={fullAvatarUrl} 
                      alt={userData?.full_name || userData?.name || 'User'}
                      className="w-32 h-32 rounded-full object-cover bg-linear-to-br from-[#00C853] to-[#007BFF]"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-linear-to-br from-[#00C853] to-[#007BFF] flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                  {isEditing && (
                    <button 
                      className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-[#e2e8f0] flex items-center justify-center hover:bg-slate-50"
                      onClick={handleCameraClick}
                    >
                      <Camera className="w-5 h-5 text-[#64748b]" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-[#64748b] mt-4 text-center">
                  JPG, PNG or GIF. Max size 2MB
                </p>
                {isEditing && (
                  <Button 
                    variant="outline" 
                    className="mt-4 border-[#e2e8f0]"
                    onClick={handleCameraClick}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                )}
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
                    <span className="text-sm text-[#1e293b]">
                      {userData?.created_at 
                        ? new Date(userData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748b]">Last Login</span>
                    <span className="text-sm text-[#1e293b]">
                       {userData?.last_active 
                        ? new Date(userData.last_active).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
  )
}

export default ProfileSidebar

