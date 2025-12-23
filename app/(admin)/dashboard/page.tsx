"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/app/components/admin/dashboard/DashboardHeader";
import MetricsGrid from "@/app/components/admin/dashboard/MetricsGrid";
import ChartsSection from "@/app/components/admin/dashboard/ChartsSection";
import AlertsSection from "@/app/components/admin/dashboard/AlertsSection";
import Loader from "@/app/components/common/Loader";
import EmptyState from "@/app/components/common/EmptyState";
import makeRequest from "@/Api's/apiHelper";
import { DashboardStats } from "@/Api's/repo";
import { DashboardData } from "@/app/types/dashboard";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    GetDashboardDetailedData();
  }, [router]);

  const GetDashboardDetailedData = async () => {
    setIsLoading(true);
    try {
      const response = await makeRequest({
        url: DashboardStats,
        method: "GET",
      });
      
      const data = response?.data as Record<string, unknown>;
      
      if (data?.result && typeof data.result === 'object') {
        const result = data.result as { 
          header_data?: unknown; 
          graphs_data?: unknown 
        };
        
        if (result.header_data && result.graphs_data) {
          setDashboardData(result as unknown as DashboardData);
        } else {
          setDashboardData(null);
        }
      } else if (data?.header_data && data?.graphs_data) {
        setDashboardData(data as unknown as DashboardData);
      } else {
        setDashboardData(null);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    GetDashboardDetailedData();
  };

  return (
    <div className="space-y-6">
      <DashboardHeader />
      {isLoading ? (
        <Loader />
      ) : !dashboardData ? (
        <EmptyState
          title="No Dashboard Data Available"
          description="There are no dashboard metrics or data to display at the moment. This could be because your platform is new or there hasn't been any activity yet."
          action={{
            label: "Refresh Data",
            onClick: handleRefresh,
          }}
        />
      ) : (
        <>
          <MetricsGrid dashboardData={dashboardData}/>
          <ChartsSection dashboardData={dashboardData} />
          <AlertsSection dashboardData={dashboardData} />
        </>
      )}
    </div>
  );
}