"use client";
import { useState } from 'react';
import ReportsAbuseHeader from '@/app/components/admin/reports-abuse/ReportsAbuseHeader';
import ReportsAbuseSummary from '@/app/components/admin/reports-abuse/ReportsAbuseSummary';
import ReportsAbuseTabs from '@/app/components/admin/reports-abuse/ReportsAbuseTabs';

export default function ReportsAbuse() {
  const [activeTab, setActiveTab] = useState('bullying');

  return (
    <div className="space-y-6">
      <ReportsAbuseHeader />
      <ReportsAbuseSummary />
      <ReportsAbuseTabs activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
