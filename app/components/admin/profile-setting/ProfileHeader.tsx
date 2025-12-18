import React from 'react'
import { Button } from '../../ui/button'
import { Save, X } from 'lucide-react'

interface ProfileHeaderProps {
  isEditing: boolean;
  handleCancel: () => void;
  handleSave: () => void;
  setIsEditing: (value: boolean) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({isEditing, handleCancel, handleSave, setIsEditing}) => {
  return (
    <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1e293b] mb-1">Profile Settings</h1>
          <p className="text-[#64748b]">Manage your personal information and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                className="border-[#e2e8f0]"
                onClick={handleCancel}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                className="bg-[#00C853] hover:bg-[#00A843] text-white"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button 
              className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
  )
}

export default ProfileHeader