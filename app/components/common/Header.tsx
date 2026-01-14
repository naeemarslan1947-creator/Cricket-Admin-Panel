'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/reducer'
import makeRequest from "@/Api's/apiHelper"
import { GetUnreadNotifications } from "@/Api's/repo"
import { setNotificationCount } from '@/redux/actions'
import { useAuth } from '@/app/hooks/useAuth'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export default function Header() {
    const router = useRouter()
    const dispatch = useDispatch()
    const [showUserMenu, setShowUserMenu] = useState(false)
    
    const { user } = useAuth()
    const notificationCount = useSelector((state: RootState) => state.notificationCount)
    
    const fetchNotificationCount = useCallback(async () => {
        if (!user?._id) return
        
        try {
            const response = await makeRequest<unknown[]>({
                url: GetUnreadNotifications,
                method: "GET",
                params: { user_id: user._id },
            })
            
            const notifications = response.data ?? []
            const count = Array.isArray(notifications) ? notifications.length : 0
            dispatch(setNotificationCount(count))
        } catch (error) {
            console.error("Error fetching notification count:", error)
            // Keep existing count on error
        } finally {
        }
    }, [user, dispatch])
    
    useEffect(() => {
        fetchNotificationCount()
    }, [fetchNotificationCount])
    
    // Listen for notification updates from other components
    useEffect(() => {
        const handleNotificationUpdate = () => {
            fetchNotificationCount()
        }
        
        window.addEventListener('notificationCountUpdated', handleNotificationUpdate)
        return () => window.removeEventListener('notificationCountUpdated', handleNotificationUpdate)
    }, [fetchNotificationCount])
    
    const getUserName = () => {
        if (user?.user_name) return user.user_name
        if (user?.name) return user.name
        if (user?.full_name) return user.full_name
        return 'Admin User'
    }
    
    const getUserRole = () => {
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
    const getUserAvatar = () => {
        if (user?.avatar) return BASE_URL + user.avatar
        if (user?.profile_pic) return BASE_URL + user.profile_pic
        if (user?.profile_media) return BASE_URL + user.profile_media
        return null
    }
    
    const handleLogout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("user");
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  router.push("/login");
};

    const closeUserMenu = () => {
        setShowUserMenu(false)
    };


    return (
        <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex-1 max-w-xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                    <input
                        type="text"
                        placeholder="Search users, clubs, reports..."
                        className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#e2e8f0] rounded-lg focus:border-[#007BFF] focus:outline-none focus:ring-2 focus:ring-[#007BFF]/20 text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 ml-6">
<div className="relative">
                    <div className="relative">
    <button
        onClick={() => router.push("/notifications")}
        className="relative p-2 hover:bg-[#F8FAFC] rounded-lg transition-colors"
    >
        <Bell className="w-5 h-5 text-[#64748b]" />
        {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#ef4444] text-white text-xs rounded-full font-bold">
                {notificationCount > 99 ? '99+' : notificationCount}
            </span>
        )}
    </button>
</div>

                </div>

                <div className="relative">
                    <button
                        onClick={() => {
                            setShowUserMenu(!showUserMenu)}}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-[#F8FAFC] rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#00C853] to-[#007BFF] flex items-center justify-center overflow-hidden">
                            {getUserAvatar() ? (
                                <img 
                                    src={getUserAvatar() || ''} 
                                    alt={getUserName()} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-4 h-4 text-white" />
                            )}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm text-[#1e293b]">{getUserName()}</p>
                            <p className="text-xs text-[#64748b]">{getUserRole()}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-[#64748b]" />
                    </button>

                {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e2e8f0] rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-[#e2e8f0]">
                                <span className="text-sm font-bold">My Account</span>
                            </div>
                            <button onClick={() => { closeUserMenu(); router.push("/profile-settings"); }} className="w-full text-left px-4 py-2.5 text-sm text-[#1e293b] hover:bg-[#F8FAFC] transition-colors">
                                Profile Settings
                            </button>
                            {/* <button onClick={() => router.push("/safety-settings")} className="w-full text-left px-4 py-2.5 text-sm text-[#1e293b] hover:bg-[#F8FAFC] transition-colors">
                                Security & 2FA
                            </button> */}
                            <button onClick={() => { closeUserMenu(); router.push("/activity-log"); }} className="w-full text-left px-4 py-2.5 text-sm text-[#1e293b] hover:bg-[#F8FAFC] transition-colors">
                                Activity Log
                            </button>
                            <div className="border-t border-[#e2e8f0]" />
                            <button
                                onClick={() => { closeUserMenu(); handleLogout(); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-[#ef4444] hover:bg-[#F8FAFC] transition-colors font-medium"
                            >
                                <span className="flex items-center gap-2">
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
