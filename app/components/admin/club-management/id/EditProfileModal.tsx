"use client";

import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';

export interface EditProfileForm {
  name: string;
  address: string;
  division: string
  description: string;
}

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: EditProfileForm;
  onFormChange: (data: EditProfileForm) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export default function EditProfileModal({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSave,
  isLoading = false,
}: EditProfileModalProps) {
  const handleInputChange = (field: keyof EditProfileForm, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#007BFF]" />
            Edit Club Profile
          </DialogTitle>
          <DialogDescription>
            Update club information below. Changes will be logged in activity history.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Club Name */}
          <div className="space-y-2">
            <Label htmlFor="club-name">Club Name</Label>
            <Input
              id="club-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter club name"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter address"
            />
          </div>

          {/* Division */}
          <div className="space-y-2">
            <Label htmlFor="division">Division</Label>
            <Input
              id="division"
              value={formData.division}
              onChange={(e) => handleInputChange('division', e.target.value)}
              placeholder="Enter division"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter club description"
              rows={4}
            />
          </div>

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="bg-[#007BFF] hover:bg-[#0056b3] text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
