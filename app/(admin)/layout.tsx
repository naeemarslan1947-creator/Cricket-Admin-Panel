'use client';

import { useState } from 'react';
import { Sidebar } from '../components/common/Sidebar';
import CrickitHeader from '../components/common/Header';
import { useAuthInitialization } from '../hooks/useAuthInitialization';
import Loader from '../components/common/Loader';
import FCM from '../components/fcm';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  
  // Initialize authentication - restores user from localStorage and fetches fresh data
  const { isInitialized, isLoading } = useAuthInitialization();

  // Show loading spinner while initializing auth
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <CrickitHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      
      {/* Firebase Cloud Messaging Component */}
      <FCM />
    </div>
  );
}

