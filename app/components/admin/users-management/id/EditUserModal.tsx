"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Edit } from "lucide-react";
import { toastError, toastSuccess } from "@/app/helper/toast";
import { UpdateUserApiCall } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";


interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editForm: {
    name: string;
    email: string;
    role: string;
    subscription: string;
  };
  onEditFormChange: (form: {
    name: string;
    email: string;
    role: string;
    subscription: string;
  }) => void;
  selectedUser: {
    id: string | number;
    [key: string]: unknown;
  };
  onUserUpdated?: () => void;
}

export default function EditUserModal({
  open,
  onOpenChange,
  editForm,
  onEditFormChange,
  selectedUser,
  onUserUpdated,
}: EditUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedUser?.id) {
      toastError("User ID is missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await makeRequest({
        url: UpdateUserApiCall,
        method: "POST",
        data: {
          _id: selectedUser.id,
          full_name: editForm.name,
          email: editForm.email,
        },
      });

      if (response.status === 200) {
        toastSuccess("User updated successfully!");
        onOpenChange(false);
        onUserUpdated?.();
      } else {
        toastError(response.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred while updating the user";
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    onEditFormChange({ ...editForm, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#007BFF]" />
            Edit User Details
          </DialogTitle>
          <DialogDescription>
            Update user information below. Changes will be logged in activity history.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={editForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={editForm.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
