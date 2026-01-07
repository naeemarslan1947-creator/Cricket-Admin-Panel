"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Database, Lock, Shield, Users, Edit2 } from "lucide-react";
import { Button } from "../../ui/button";
import makeRequest from "@/Api's/apiHelper";
import { PermissionList, CreateOrUpdatePermission } from "@/Api's/repo";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface AdminRolesProps {
  isSuperAdmin: boolean;
  allPermissions: Permission[];
}

interface Role {
  name: string;
  description: string;
  icon: typeof Shield;
  color: string;
}

// Permission name mapping: frontend label -> backend key
const permissionKeyMap: Record<string, string> = {
  "All Permissions": "all",
  "Content Moderation": "content_moderation",
  "User Management": "user_management",
  "Reports & Abuse": "reports_and_abuse",
  "User Support": "user_support",
  "Club Management": "club_management",
  Reviews: "reviews_and_ratings",
  "System Settings": "system_settings",
  "Audit Logs": "audit_logs",
  Analytics: "analytics_and_insights",
  Billing: "billing",
  "Youth Safety": "youth_safety",
};

// Visual mapping for known role names -> icon + explicit Tailwind class strings
// Keys use normalized form: lowercased with spaces/dashes replaced by underscore
const roleVisuals: Record<
  string,
  {
    icon: typeof Shield;
    cardBg: string;
    cardBorder: string;
    iconBg: string;
    iconText: string;
  }
> = {
  super_admin: {
    icon: Shield,
    cardBg: "bg-red-50",
    cardBorder: "border-red-200",
    iconBg: "bg-red-100",
    iconText: "text-red-600",
  },
  moderator: {
    icon: Database,
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-200",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  support: {
    icon: Users,
    cardBg: "bg-green-50",
    cardBorder: "border-green-200",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
  },
  developer: {
    icon: Shield,
    cardBg: "bg-purple-50",
    cardBorder: "border-purple-200",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
};

const AdminRoles: React.FC<AdminRolesProps> = ({
  isSuperAdmin,
  allPermissions,
}) => {
  const [managingRole, setManagingRole] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [apiRoles, setApiRoles] = useState<Array<{ name: string; action: string[] }>>([]);

  // build inverse map from action key -> label for display
  const actionToLabel: Record<string, string> = Object.keys(permissionKeyMap).reduce((acc, label) => {
    const key = (permissionKeyMap as any)[label];
    if (key) acc[key] = label;
    return acc;
  }, {} as Record<string, string>);

  // Fetch roles + actions from PermissionList on mount
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await makeRequest({ method: "GET", url: PermissionList });
        const resultArray: any[] = (res as any)?.data?.result ?? (res as any)?.result ?? [];
        if (!Array.isArray(resultArray) || resultArray.length === 0) return;

        const mapped = resultArray
          .map((r: any) => ({ name: r.name ?? r.label ?? "", action: Array.isArray(r.action) ? r.action : [] }))
          .filter((r) => r.name);

        // dedupe by normalized name (lowercase, spaces/dashes -> underscore)
        const normalize = (s: string) => s.toLowerCase().replace(/[- ]/g, "_").trim();
        const deduped = Array.from(
          mapped
            .reduce((map: Map<string, any>, r: any) => {
              const key = normalize(r.name);
              if (!map.has(key)) map.set(key, r);
              return map;
            }, new Map<string, any>())
            .values()
        );

        setApiRoles(deduped);
      } catch (error) {
        console.error("Failed to fetch PermissionList for roles", error);
      }
    };

    fetch();
  }, []);

  // -------------------- Helpers --------------------
  const normalizeRoleName = (name: string) =>
    name.toLowerCase().replace(/[- ]/g, "_");

  // -------------------- Fetch Permissions --------------------
  const fetchPermissions = async (role: string) => {
    try {
      const response = await makeRequest<{ result?: any[] }>({
        method: "GET",
        url: PermissionList,
      });

      console.log("Permissions API Response:", response);

      // normalize response to an array for safe operations
      const resultArray: any[] =
        (response as any)?.data?.result ?? (response as any)?.result ?? [];

      if (resultArray.length === 0) {
        setSelectedPermissions([]);
        return;
      }

      // Find the role data by normalized name
      const roleData = resultArray.find((r: any) =>
        normalizeRoleName(r.name) === normalizeRoleName(role)
      );

      if (!roleData || !Array.isArray(roleData.action)) {
        setSelectedPermissions([]);
        return;
      }

      // If role has "all" permission, tick all
      if (roleData.action.includes("all")) {
        setSelectedPermissions(
          allPermissions.map((p) => permissionKeyMap[p.name]!).filter(Boolean)
        );
      } else {
        setSelectedPermissions(roleData.action);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      // Fallback for Super Admin
      if (role === "Super Admin") {
        setSelectedPermissions(
          allPermissions.map((p) => permissionKeyMap[p.name]!).filter(Boolean)
        );
      } else {
        setSelectedPermissions([]);
      }
    }
  };

  // -------------------- Save Permissions --------------------
  const savePermissions = async (role: string) => {
    try {
      const payload = { name: role, action: selectedPermissions };
      const response = await makeRequest({
        method: "POST",
        url: CreateOrUpdatePermission,
        data: payload,
      });
      console.log("✅ SAVE PERMISSION RESPONSE:", response);

      // Close managing state after save
      setManagingRole(null);
    } catch (error) {
      console.error("❌ SAVE PERMISSION ERROR:", error);
    }
  };

  return (
    <Card className="border-[#e2e8f0]">
      <CardHeader>
        <CardTitle className="text-[#1e293b]">
          Admin Roles & Permissions
        </CardTitle>
        <p className="text-sm text-[#64748b]">
          Manage administrative access levels and permissions
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {!isSuperAdmin && (
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 mb-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm text-amber-900 mb-1">
                  Super Admin Only
                </h4>
                <p className="text-sm text-amber-700">
                  Only Super Administrators can modify role permissions.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {apiRoles.map((roleObj: any) => {
            // unify shape: apiRoles items {name, action, color?, icon?}
            const name: string = roleObj.name;
            const description: string = roleObj.action
              ? roleObj.action.includes("all")
                ? "All permissions"
                : (roleObj.action as string[])
                    .map((a) => actionToLabel[a] ?? a)
                    .join(", ")
              : "";

            const normalized = normalizeRoleName(name || "");
            const visual = roleVisuals[normalized] ?? {
              icon: Shield,
              cardBg: "bg-blue-50",
              cardBorder: "border-blue-200",
              iconBg: "bg-blue-100",
              iconText: "text-blue-600",
            };

            const RoleIcon = visual.icon;

            return (
              <Card key={name} className={`${visual.cardBorder} ${visual.cardBg}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${visual.iconBg} rounded-lg flex items-center justify-center`}>
                        <RoleIcon className={`w-5 h-5 ${visual.iconText}`} />
                      </div>
                      <div>
                        <h4 className="text-[#1e293b]">{name}</h4>
                        <p className="text-sm text-[#64748b]">{description}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isSuperAdmin ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newRole = managingRole === name ? null : name;
                            setManagingRole(newRole);
                            if (newRole) fetchPermissions(name);
                          }}
                          className="border-[#e2e8f0]"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </div>

                  {managingRole === name && isSuperAdmin && (
                    <div className="mt-4 pt-4 border-t border-[#e2e8f0] space-y-4">
                      <p className="text-sm text-[#1e293b]">Edit permissions for {name}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {allPermissions.map((perm) => {
                          const key = permissionKeyMap[perm.name];
                          if (!key) return null;

                          return (
                            <div key={perm.id} className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                id={`perm-${name}-${perm.id}`}
                                checked={selectedPermissions.includes(key)}
                                disabled={!isSuperAdmin}
                                className="mt-1"
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedPermissions([...selectedPermissions, key]);
                                  else setSelectedPermissions(selectedPermissions.filter((p) => p !== key));
                                }}
                              />
                              <label htmlFor={`perm-${name}-${perm.id}`} className="flex-1">
                                <span className="text-sm text-[#1e293b] block">{perm.name}</span>
                                <span className="text-xs text-[#64748b]">{perm.description}</span>
                              </label>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="bg-[#007BFF] hover:bg-[#0056b3] text-white" onClick={() => savePermissions(name)}>
                          Save Changes
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setManagingRole(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRoles;
