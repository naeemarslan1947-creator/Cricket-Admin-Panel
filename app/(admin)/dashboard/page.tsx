"use client";

import DashboardHeader from "@/app/components/admin/dashboard/DashboardHeader";
import MetricsGrid from "@/app/components/admin/dashboard/MetricsGrid";
import ChartsSection from "@/app/components/admin/dashboard/ChartsSection";

import AlertsSection from "@/app/components/admin/dashboard/AlertsSection";
export default function Dashboard() {

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <MetricsGrid />
      <ChartsSection />
      <AlertsSection />
    </div>
  );
}