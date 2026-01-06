import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { AlertCircle, Edit2, Lock, Trash2, UserPlus } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { SignUp, PermissionList, GetRolesList } from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";
import { showToast } from "../../../../redux/actions";
import store from "../../../../redux/store";

/* -------------------- Types -------------------- */
interface AdminUser {
  id: string; // backend ID
  name: string;
  email: string;
  role: string;
  status: string;
  color: string;
  permissions: string[];
  lastLogin: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
}

interface AdminUsersManagementProps {
  isSuperAdmin: string;
  showAddAdmin: boolean;
  setShowAddAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  adminUsers: AdminUser[];
  editingUser: string | null;
  setEditingUser: React.Dispatch<React.SetStateAction<string | null>>;
  allPermissions: Permission[];
}

const AdminUsersManagement: React.FC<AdminUsersManagementProps> = ({
  isSuperAdmin,
  setShowAddAdmin,
  showAddAdmin,
  adminUsers,
  setEditingUser,
  editingUser,
  allPermissions,
}) => {
  // -------------------- Controlled form states --------------------
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("Moderator");
  const [newPassword, setNewPassword] = useState("");

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  /* -------------------- Fetch Roles -------------------- */
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await makeRequest({ url: PermissionList, method: "GET" });

        // Extract payload safely from different backend shapes
        const payload =
          (res as any).data?.result ??
          (res as any).result ??
          (res as any).data ??
          res;

        // Determine the array that contains role objects
        const rolesArray: any[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.roles)
          ? payload.roles
          : [];

        // Map, filter, and dedupe
        const dedupedRoles: Role[] = Array.from(
          rolesArray
            .map((it: any) => ({
              id: it._id ?? it.id ?? "",
              name: (it.name ?? it.label ?? "").toString(),
            }))
            .filter((r: Role) => r.name)
            .reduce((map: Map<string, Role>, r: Role) => {
              const key = r.name.trim().toLowerCase();
              if (!map.has(key)) map.set(key, r);
              return map;
            }, new Map<string, Role>())
            .values()
        );

        setRoles(dedupedRoles);
      } catch (err) {
        console.error("❌ Role fetch failed", err);
        setRoles([]); // fallback
      }
    };

    fetchRoles();
  }, []);

  // When roles are loaded, default selectedRoleId to first role's id
  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) {
      setSelectedRoleId(roles[0].id);
      setNewRole(roles[0].name);
    }
  }, [roles]);

  // -------------------- Handle Create Admin --------------------
  const handleCreateAdmin = async () => {
    const requiresRoleId = roles.length > 0;
    const roleValue = requiresRoleId ? selectedRoleId : newRole;

    if (!newName || !newEmail || !roleValue || !newPassword) {
      store.dispatch(
        showToast({
          id: Date.now().toString(),
          type: "error",
          message: "Please fill in all fields.",
          duration: 5000,
        })
      );
      return;
    }

    // Here backend will generate the ID, so we don’t provide it manually
    const payload: any = {
      name: newName,
      email: newEmail,
      password: newPassword,
    };

    if (requiresRoleId) payload.roleId = selectedRoleId;
    else payload.role = newRole;

    try {
      const response = await makeRequest({
        url: SignUp,
        method: "POST",
        data: payload,
      });

      console.log("✅ Admin created:", response);

      store.dispatch(
        showToast({
          id: Date.now().toString(),
          type: "success",
          message: "Admin user created successfully!",
          duration: 5000,
        })
      );

      // Reset form
      setNewName("");
      setNewEmail("");
      setNewRole("Moderator");
      setSelectedRoleId(roles.length > 0 ? roles[0].id : "");
      setNewPassword("");
      setShowAddAdmin(false);

      // Optionally refresh adminUsers list from backend
      // fetchAdminUsers();
    } catch (error: any) {
      console.error("❌ Create Admin Error:", error);
      store.dispatch(
        showToast({
          id: Date.now().toString(),
          type: "error",
          message: "Failed to create admin user.",
          duration: 5000,
        })
      );
    }
  };

  // -------------------- Handle Update Admin --------------------
  const handleUpdateAdmin = async (user: AdminUser, updatedData: any) => {
    const payload = {
      id: user.id, // <-- backend ID mapped here
      ...updatedData,
    };

    try {
      const response = await makeRequest({
        url: SignUp, // or your update API endpoint
        method: "POST",
        data: payload,
      });

      console.log("✅ Admin updated:", response);

      store.dispatch(
        showToast({
          id: Date.now().toString(),
          type: "success",
          message: "Admin user updated successfully!",
          duration: 5000,
        })
      );

      setEditingUser(null);
    } catch (error: any) {
      console.error("❌ Update Admin Error:", error);
      store.dispatch(
        showToast({
          id: Date.now().toString(),
          type: "error",
          message: "Failed to update admin user.",
          duration: 5000,
        })
      );
    }
  };

  return (
    <div>
      {!isSuperAdmin && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm text-amber-900 mb-1">
                  Access Restricted
                </h4>
                <p className="text-sm text-amber-700">
                  Only Super Administrators can manage admin users, roles, and
                  permissions. You are currently logged in as{" "}
                  <strong>Demo Admin</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1e293b]">Admin Users</CardTitle>
              <p className="text-sm text-[#64748b]">
                Manage administrative user accounts
              </p>
            </div>

            {isSuperAdmin && (
              <Button
                className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
                onClick={() => setShowAddAdmin(!showAddAdmin)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Admin User
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {showAddAdmin && isSuperAdmin && (
            <Card className="border-[#007BFF] bg-blue-50">
              <CardContent className="p-4 space-y-4">
                <h4 className="text-[#1e293b]">Add New Admin User</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new-name">Full Name</Label>
                    <Input
                      id="new-name"
                      placeholder="John Doe"
                      className="mt-1"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-email">Email Address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      placeholder="admin@crickit.com"
                      className="mt-1"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-role">Role</Label>
                    <select
                      id="new-role"
                      aria-label="Select role"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                      value={roles.length > 0 ? selectedRoleId : newRole}
                      onChange={(e) => {
                        if (roles.length > 0) {
                          setSelectedRoleId(e.target.value);
                          const found = roles.find(
                            (r) => r.id === e.target.value
                          );
                          if (found) setNewRole(found.name);
                        } else {
                          setNewRole(e.target.value);
                        }
                      }}
                    >
                      {roles.length > 0 ? (
                        roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))
                      ) : (
                        <>
                          <option>Moderator</option>
                          <option>Support</option>
                          <option>Developer</option>
                          <option>Super Admin</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="new-password">Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="mt-1"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="bg-[#00C853] hover:bg-[#00a844] text-white"
                    onClick={handleCreateAdmin}
                  >
                    Create Admin User
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddAdmin(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {adminUsers.map((user) => (
              <Card key={user.id} className="border-[#e2e8f0]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#00C853] to-[#007BFF] flex items-center justify-center shadow-lg">
                        <span className="text-white">
                          {user.name.charAt(0)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[#1e293b]">{user.name}</h4>
                          <Badge className={`${user.color} border`}>
                            {user.role}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700">
                            {user.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-[#64748b] mb-2">
                          {user.email}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {user.permissions.map((perm) => (
                            <Badge
                              key={perm}
                              variant="outline"
                              className="text-xs"
                            >
                              {perm}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-xs text-[#94a3b8]">
                          Last login: {user.lastLogin}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isSuperAdmin ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditingUser(
                                editingUser === user.id ? null : user.id
                              )
                            }
                            className="border-[#e2e8f0]"
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>

                          {user.role !== "Super Admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>

                  {editingUser === user.id && isSuperAdmin && (
                    <div className="mt-4 pt-4 border-t border-[#e2e8f0] space-y-4">
                      <Card className="border-[#007BFF] bg-blue-50">
                        <CardContent className="p-4 space-y-4">
                          <h4 className="text-[#1e293b]">Edit Admin User</h4>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`edit-name-${user.id}`}>
                                Full Name
                              </Label>
                              <Input
                                id={`edit-name-${user.id}`}
                                defaultValue={user.name}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`edit-email-${user.id}`}>
                                Email Address
                              </Label>
                              <Input
                                id={`edit-email-${user.id}`}
                                type="email"
                                defaultValue={user.email}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor={`edit-role-${user.id}`}>
                                Role
                              </Label>
                              <select
                                id={`edit-role-${user.id}`}
                                defaultValue={user.role}
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                              >
                                <option>Moderator</option>
                                <option>Support</option>
                                <option>Developer</option>
                                <option>Super Admin</option>
                              </select>
                            </div>

                            <div>
                              <Label htmlFor={`edit-password-${user.id}`}>
                                Temporary Password
                              </Label>
                              <Input
                                id={`edit-password-${user.id}`}
                                type="password"
                                placeholder="••••••••"
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
                              onClick={() =>
                                handleUpdateAdmin(user, {
                                  name: (
                                    document.getElementById(
                                      `edit-name-${user.id}`
                                    ) as HTMLInputElement
                                  ).value,
                                  email: (
                                    document.getElementById(
                                      `edit-email-${user.id}`
                                    ) as HTMLInputElement
                                  ).value,
                                  role: (
                                    document.getElementById(
                                      `edit-role-${user.id}`
                                    ) as HTMLSelectElement
                                  ).value,
                                  password: (
                                    document.getElementById(
                                      `edit-password-${user.id}`
                                    ) as HTMLInputElement
                                  ).value,
                                })
                              }
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingUser(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersManagement;
