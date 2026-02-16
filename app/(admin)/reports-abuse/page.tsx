"use client";
import { useState } from 'react';
import ReportsAbuseHeader from '@/app/components/admin/reports-abuse/ReportsAbuseHeader';
import ReportsAbuseSummary from '@/app/components/admin/reports-abuse/ReportsAbuseSummary';
import ReportsAbuseTabs from '@/app/components/admin/reports-abuse/ReportsAbuseTabs';

export default function ReportsAbuse() {
  const [activeTab, setActiveTab] = useState('all');
  const [summaryRefreshTrigger, setSummaryRefreshTrigger] = useState(0);

  const handleRefreshSummary = () => {
    setSummaryRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <ReportsAbuseHeader />
      <ReportsAbuseSummary refreshTrigger={summaryRefreshTrigger} />
      <ReportsAbuseTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onActionComplete={handleRefreshSummary}
      />
    </div>
  );
}
