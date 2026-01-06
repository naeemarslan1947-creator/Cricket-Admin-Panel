'use client';

import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Building2, Shield,  
  Star, CreditCard, AlertTriangle, BarChart3, 
  FileText, Settings, ChevronLeft, ChevronRight, 
  Download,
  Bell
} from 'lucide-react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducer';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

interface ReduxUser {
  name?: string;
  full_name?: string;
  user_name?: string;
  email?: string;
  avatar?: string;
  profile_pic?: string;
  profile_media?: string;
  role?: {
    id?: string;
    name?: string;
    permissions?: string[];
    color?: string;
  };
  role_id?: string | string[];
  is_admin?: boolean;
  _id?: string;
}

const getUserName = (user: ReduxUser | null | undefined) => {
    if (user?.name) return user.name
    if (user?.full_name) return user.full_name
    if (user?.user_name) return user.user_name
    return 'John Smith'
}

const getUserRole = (user: ReduxUser | null | undefined) => {
    if (user?.role?.name && typeof user.role.name === 'string' && user.role.name.trim() !== '') {
        return user.role.name
    }
    if (Array.isArray(user?.role_id) && user.role_id.length > 0) {
        const firstRole = user.role_id[0]
        if (typeof firstRole === 'string' && firstRole.trim() !== '') return firstRole
    }
    if (typeof user?.role_id === 'string' && user.role_id.trim() !== '') return user.role_id
    return 'Super Admin'
}

// Helper to get user avatar
const getUserAvatar = (user: ReduxUser | null | undefined) => {
    if (user?.avatar) return BASE_URL + user.avatar
    if (user?.profile_pic) return BASE_URL + user.profile_pic
    if (user?.profile_media) return BASE_URL + user.profile_media
    return null
}

const getAvatarInitial = (user: ReduxUser | null | undefined) => {
    const name = getUserName(user)
    return name.charAt(0).toUpperCase()
}

// Helper to check if user has a specific permission
const hasPermission = (user: ReduxUser | null | undefined, requiredPermission: string): boolean => {
    // Super Admin users see everything
    if (user?.role?.name === 'Super Admin') return true;
    
    // Check permissions array in role
    const userPermissions = user?.role?.permissions;
    if (Array.isArray(userPermissions) && userPermissions.includes(requiredPermission)) {
        return true;
    }
    
    return false;
}

// Menu item type with permission requirement
interface MenuItem {
    id: string;
    label: string;
    icon: React.ElementType;
    path: string;
    requiredPermission?: string;
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const user = useSelector((state: RootState) => state.user) as ReduxUser | null | undefined;
  console.log("📢[Sidebar.tsx:78]: user: ", user);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'users-management', label: 'Users Management', icon: Users, path: '/users-management', requiredPermission: 'users_management' },
    { id: 'club-management', label: 'Clubs Management', icon: Building2, path: '/club-management', requiredPermission: 'club_management' },
    { id: 'moderation', label: 'Content Moderation', icon: Shield, path: '/content-moderation', requiredPermission: 'content_moderation' },
    { id: 'reviews-rating', label: 'Reviews & Ratings', icon: Star, path: '/reviews-rating', requiredPermission: 'reviews_ratings' },
    { id: 'billing-subscription', label: 'Billing & Subscriptions', icon: CreditCard, path: '/billing-subscription', requiredPermission: 'billing_subscriptions' },
    { id: 'reports-abuse', label: 'Reports & Abuse', icon: AlertTriangle, path: '/reports-abuse', requiredPermission: 'reports_abuse' },
    { id: 'analytics-insights', label: 'Analytics & Insights', icon: BarChart3, path: '/analytics-insights', requiredPermission: 'analytics_and_insights' },
    { id: 'communication-tool', label: 'Communication Tool', icon: Bell, path: '/communication-tool', requiredPermission: 'communication_tool' },
    { id: 'data-export', label: 'Data Export', icon: Download, path: '/data-export', requiredPermission: 'data_export' },
    { id: 'audit-log', label: 'Audit Logs', icon: FileText, path: '/audit-log', requiredPermission: 'audit_logs' },
    { id: 'settings', label: 'System Settings', icon: Settings, path: '/settings', requiredPermission: 'system_settings' },
  ];

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter((item) => {
    // If no permission required, always show the item
    if (!item.requiredPermission) return true;
    // Check if user has the required permission
    return hasPermission(user, item.requiredPermission);
  });

  const handleClick = (item: MenuItem) => {
    router.push(item.path);
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-[#e2e8f0] transition-all duration-300 z-50 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#e2e8f0]">
  {!collapsed && (
    <div className="flex items-center gap-3">
      <Image
        src="/svg/logo.svg"
        width={20}
        height={20}
        alt="Crickit Logo"
        className="w-8 h-8 object-contain"
      />

      <div className="leading-tight">
        <h1 className="text-[#0F172A] text-base font-semibold">Crickit</h1>
        <p className="text-xs text-[#64748B]">Admin Panel</p>
      </div>
    </div>
  )}

  <button
    onClick={onToggleCollapse}
    className="p-1.5 hover:bg-[#F8FAFC] rounded-lg transition-colors"
  >
    {collapsed ? (
      <ChevronRight className="w-5 h-5 text-[#64748B]" />
    ) : (
      <ChevronLeft className="w-5 h-5 text-[#64748B]" />
    )}
  </button>
</div>


      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;

          // ✅ Determine active tab based on pathname
          const isActive = pathname.startsWith(item.path);

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-[#91C137] text-white '
                  : 'text-[#64748b] hover:bg-[#F8FAFC] hover:text-[#1e293b]'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : ''}`} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>
      {!collapsed  && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#e2e8f0] bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C853] to-[#007BFF] flex items-center justify-center shadow-lg overflow-hidden">
              {getUserAvatar(user) ? (
                <img 
                  src={getUserAvatar(user) || ''} 
                  alt={getUserName(user)} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm">{getAvatarInitial(user)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#1e293b] truncate">{getUserName(user)}</p>
              <p className="text-xs text-[#64748b] truncate">{getUserRole(user)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
