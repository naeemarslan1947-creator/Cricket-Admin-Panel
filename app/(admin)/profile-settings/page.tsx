"use client";
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import ProfileHeader from '@/app/components/admin/profile-setting/ProfileHeader';
import ProfileSidebar from '@/app/components/admin/profile-setting/ProfileSidebar';
import PersonalInformation from '@/app/components/admin/profile-setting/PersonalInformation';
import SecuritySettings from '@/app/components/admin/profile-setting/SecuritySettings';
// import NotificationPreferences from '@/app/components/admin/profile-setting/NotificationPreferences';
import DangerZone from '@/app/components/admin/profile-setting/DangerZone';
import makeRequest from "@/Api's/apiHelper";
import { UserGetById, UpdateAdminProfile } from "@/Api's/repo";
import { toastSuccess, toastError } from "@/app/helper/toast";
import { setUser } from "@/redux/actions";

interface RolePermission {
  _id?: string;
  name?: string;
  action?: string[];
  permission_type?: string;
  action_type?: number;
  updated_at?: string;
  created_at?: string;
  __v?: number;
}

interface UserRoleData {
  _id?: string;
  user_id?: string;
  permission?: RolePermission;
  action_type?: number;
  updated_at?: string;
  created_at?: string;
  __v?: number;
}

interface UserResponseData {
  _id?: string;
  user_name?: string;
  full_name?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  profile_pic?: string;
  address?: string;
  is_admin?: boolean;
  action_type?: number;
  last_active?: string;
  __v?: number;
  is_user_verified?: boolean;
  is_club?: boolean;
  is_club_verified?: boolean;
}

interface UserApiResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  message: string;
  result?: {
    data?: UserResponseData;
    role?: UserRoleData[];
  };
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
}
interface UserData {
  _id?: string;
  full_name?: string;
  name?: string;
  user_name?: string;
  email?: string;
  phone_number?: string;
  profile_pic?: string;
  address?: string;
  is_admin?: boolean;
  role?: UserRoleData[];
}

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    email: '',
    phone: '',
    role: '',
    location: '',
  });


  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user ID from localStorage
  const getUserId = (): string | null => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user._id || null;
    }
    return null;
  };

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = getUserId();
      
      if (userId) {
        try {
          const response = await makeRequest<UserApiResponse>({
            url: UserGetById,
            method: 'GET',
            params: { user_id: userId },
          });

          if (response.status === 200 && response.data?.result) {
            const user = response.data.result.data;
            const userRole = response.data.result.role;
            
            if (user) {
              setUserData({ ...user, role: userRole });
              
              // Extract role name from role array
              const roleName = userRole?.[0]?.permission?.name || 'Super Admin';
              
              setFormData({
                name: user.user_name || '',
                email: user.email || '',
                phone: user.phone_number || '',
                role: roleName,
                location: user.address || '',
              });
            }
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle profile picture file selection
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toastError('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toastError('File size must be less than 2MB');
      return;
    }

    setProfilePicFile(file);
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setProfilePicPreview(previewUrl);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userId = getUserId();
      
      if (!userId) {
        toastError('User ID not found');
        return;
      }

      // Create FormData for API call
      const formDataToSend = new FormData();
      formDataToSend.append('_id', userId);
      formDataToSend.append('user_name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', formData.phone);
      formDataToSend.append('address', formData.location);

      // Add profile picture if selected
      if (profilePicFile) {
        formDataToSend.append('profile_pic', profilePicFile);
      }

      const response = await makeRequest({
        url: UpdateAdminProfile,
        method: 'POST',
        data: formDataToSend,
      });

      if (response.status === 200 || response.status === 201) {
        toastSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear profile picture file and preview
        setProfilePicFile(null);
        setProfilePicPreview(null);
        
        // Refetch user data to get updated info
        const userResponse = await makeRequest<UserApiResponse>({
          url: UserGetById,
          method: 'GET',
          params: { user_id: userId },
        });

        if (userResponse.status === 200 && userResponse.data?.result) {
          const updatedUser = userResponse.data.result.data;
          const updatedUserRole = userResponse.data.result.role;
          
          if (updatedUser) {
            setUserData({ ...updatedUser, role: updatedUserRole });
            
            // Extract role details from role array
            const firstRole = updatedUserRole?.[0];
            const roleName = firstRole?.permission?.name || "Super Admin";
            const roleId = firstRole?._id || "";
            
            const roleColors: Record<string, string> = {
              'Super Admin': 'red',
              'Moderator': 'blue',
              'Support': 'green',
              'Developer': 'purple',
            };

            // Update Redux store with new user data including role
            const reduxUserData = {
              _id: updatedUser._id,
              name: updatedUser.user_name,
              email: updatedUser.email,
              avatar: updatedUser.profile_pic,
              phone: updatedUser.phone_number,
              address: updatedUser.address,
              is_admin: updatedUser.is_admin,
              role: {
                id: roleId,
                name: roleName as 'Super Admin' | 'Moderator' | 'Support' | 'Developer',
                permissions: firstRole?.permission?.action || [],
                color: roleColors[roleName] || 'blue',
                _id: firstRole?._id,
                permission: firstRole?.permission,
                action_type: firstRole?.action_type,
                updated_at: firstRole?.updated_at,
                created_at: firstRole?.created_at,
              },
            };
            dispatch(setUser(reduxUserData));
            
            // Update localStorage with new user data including role
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const user = JSON.parse(storedUser);
              user.name = updatedUser.full_name || updatedUser.name || updatedUser.user_name;
              user.email = updatedUser.email;
              user.avatar = updatedUser.profile_pic;
              user.role = reduxUserData.role;
              localStorage.setItem('user', JSON.stringify(user));
            }
          }
        }
      } else {
        const errorData = response.data as { message?: string };
        toastError(errorData?.message || 'Failed to update profile');
      }
    } catch (error: unknown) {
      const err = error as { data?: unknown; message?: string };
      const errorData = err.data as { message?: string };
      toastError(errorData?.message || err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
   
  };

  const getRoleColor = (roleName: string) => {
    const colors: Record<string, string> = {
      'Super Admin': 'bg-red-100 text-red-700',
      'Moderator': 'bg-blue-100 text-blue-700',
      'Support': 'bg-green-100 text-green-700',
      'Developer': 'bg-purple-100 text-purple-700',
    };
    return colors[roleName] || 'bg-gray-100 text-gray-700';
  };

  const getAvatarUrl = (): string | null => {
    if (profilePicPreview) return profilePicPreview;
    if (userData?.profile_pic) return userData.profile_pic;
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#64748b]">Loading profile...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <ProfileHeader 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
        handleSave={handleSave} 
        handleCancel={handleCancel}
        isSaving={isSaving}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfileSidebar 
          userData={userData}
          avatarUrl={getAvatarUrl()}
          isEditing={isEditing}
          onProfilePicChange={handleProfilePicChange}
          fileInputRef={fileInputRef}
        />

        <div className="lg:col-span-2 space-y-6">
          <PersonalInformation isEditing={isEditing} formData={formData} handleInputChange={handleInputChange} getRoleColor={getRoleColor} />

          <SecuritySettings />

          {/* <NotificationPreferences notifications={notifications} handleNotificationToggle={handleNotificationToggle} /> */}

          {userData?.role?.[0]?.permission?.name !== 'Super Admin' &&<DangerZone userId={userData?._id} />}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProfilePicChange}
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
      />
    </div>
  );
}

