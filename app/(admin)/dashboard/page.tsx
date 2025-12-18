
"use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
import DashboardHeader from "@/app/components/admin/dashboard/DashboardHeader";
import MetricsGrid from "@/app/components/admin/dashboard/MetricsGrid";
import ChartsSection from "@/app/components/admin/dashboard/ChartsSection";
import AlertsSection from "@/app/components/admin/dashboard/AlertsSection";
// import makeRequest from "@/Api's/apiHelper";
// import { GetDashboardDetailed } from "@/Api's/repo";
// import { tokenManager } from "@/Api's/tokenManager";

export default function Dashboard() {
  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  // const [dashboardData, setDashboardData] = useState(null);

  // useEffect(() => {
  //   const auth = localStorage.getItem("auth");
  //   if (auth !== "true") {
  //     router.push("/login");
  //     return;
  //   }
    
  //   // Fetch dashboard data with stored token
  //   GetDashboardDetailedData();
  // }, [router]);

  // const GetDashboardDetailedData = async () => {
  //   setIsLoading(true);
  //   try {
  //     // The token will be automatically added by apiHelper using tokenManager
  //     const response = await makeRequest({
  //       url: GetDashboardDetailed,
  //       method: "GET",
  //     });

  //     console.log("Dashboard API Response:", response);
      
  //     if (response?.data) {
  //       setDashboardData(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error);
      
  //     // If token is invalid, redirect to login
  //     if (error.status === 401) {
  //       tokenManager.clearToken();
  //       localStorage.removeItem("auth");
  //       localStorage.removeItem("user");
  //       router.push("/login");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <MetricsGrid />
      <ChartsSection />
      <AlertsSection />
    </div>
  );
}
