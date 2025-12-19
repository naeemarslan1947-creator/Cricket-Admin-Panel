'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, User, LogOut, ChevronDown } from 'lucide-react'

export default function Header() {
    const router = useRouter()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)

const handleLogout = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("user");
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  router.push("/login");
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
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-[#ef4444] text-white text-xs rounded-full font-bold">
            3
        </span>
    </button>
</div>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white border border-[#e2e8f0] rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-[#e2e8f0]">
                                <span className="font-bold">Notifications</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                <div className="p-4 border-b border-[#e2e8f0] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full mt-2 bg-[#00C853]" />
                                        <div className="flex-1">
                                            <p className="text-sm text-[#1e293b]">
                                                New club verification pending
                                            </p>
                                            <p className="text-xs text-[#64748b] mt-1">
                                                2 minutes ago
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-b border-[#e2e8f0] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full mt-2  bg-[#f59e0b]" />
                                        <div className="flex-1">
                                            <p className="text-sm text-[#1e293b]">
                                                3 content reports awaiting review
                                            </p>
                                            <p className="text-xs text-[#64748b] mt-1">
                                                15 minutes ago
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-b border-[#e2e8f0] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full mt-2  bg-[#007BFF]" />
                                        <div className="flex-1">
                                            <p className="text-sm text-[#1e293b]">
                                                Monthly analytics report ready
                                            </p>
                                            <p className="text-xs text-[#64748b] mt-1">
                                                1 hour ago
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        onClick={() => {
                            setShowUserMenu(!showUserMenu)
                            setShowNotifications(false)
                        }}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-[#F8FAFC] rounded-lg transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#00C853] to-[#007BFF] flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm text-[#1e293b]">Admin User</p>
                            <p className="text-xs text-[#64748b]">Super Admin</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-[#64748b]" />
                    </button>

                {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e2e8f0] rounded-lg shadow-lg overflow-hidden">
                            <div className="p-4 border-b border-[#e2e8f0]">
                                <span className="text-sm font-bold">My Account</span>
                            </div>
                            <button onClick={() => router.push("/profile-settings")} className="w-full text-left px-4 py-2.5 text-sm text-[#1e293b] hover:bg-[#F8FAFC] transition-colors">
                                Profile Settings
                            </button>
                            <button onClick={() => router.push("/safety-settings")} className="w-full text-left px-4 py-2.5 text-sm text-[#1e293b] hover:bg-[#F8FAFC] transition-colors">
                                Security & 2FA
                            </button>
                            <button onClick={() => router.push("/activity-log")} className="w-full text-left px-4 py-2.5 text-sm text-[#1e293b] hover:bg-[#F8FAFC] transition-colors">
                                Activity Log
                            </button>
                            <div className="border-t border-[#e2e8f0]" />
                            <button
                                onClick={handleLogout}
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
