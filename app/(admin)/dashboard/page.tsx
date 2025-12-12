"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/app/components/admin/dashboard/DashboardHeader";
import MetricsGrid from "@/app/components/admin/dashboard/MetricsGrid";
import ChartsSection from "@/app/components/admin/dashboard/ChartsSection";
import AlertsSection from "@/app/components/admin/dashboard/AlertsSection";
export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth !== "true") {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <MetricsGrid />
      <ChartsSection />
      <AlertsSection />
    </div>
  );
}