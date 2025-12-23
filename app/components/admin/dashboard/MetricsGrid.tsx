import {
  Users,
  Building2,
  AlertCircle,
  CreditCard,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "../../ui/card";
import { DashboardData } from "@/app/types/dashboard";

export default function MetricsGrid({
  dashboardData,
}: {
  dashboardData: DashboardData;
}) {
  if (!dashboardData) return null;

  console.log("📢[MetricsGrid.tsx:25]: dashboardData: ", dashboardData);

  const metrics = [
    {
      title: "Total Users",
      value: dashboardData.header_data.total_players.count,
      change: `${dashboardData.header_data.total_players.trend >= 0 ? '+' : ''}${dashboardData.header_data.total_players.trend}%`,
      trend: dashboardData.header_data.total_players.trend >= 0 ? "up" : "down",
      icon: Users,
      color: "#007BFF",
    },
    {
      title: "New Signups (30D)",
      value: dashboardData.header_data.total_players_by_last_30days.count,
      change: `${dashboardData.header_data.total_players_by_last_30days.trend >= 0 ? '+' : ''}${dashboardData.header_data.total_players_by_last_30days.trend}% (30D)`,
      trend: dashboardData.header_data.total_players_by_last_30days.trend >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: "#00C853",
    },
    {
      title: "Verified Clubs",
      value: dashboardData.header_data.total_clubs_verified.count,
      change: `${dashboardData.header_data.total_clubs_not_verified.count} unverified`,
      trend:
        dashboardData.header_data.total_clubs_verified.count >=
        dashboardData.header_data.total_clubs_not_verified.count
          ? "up"
          : "down",
      icon: Building2,
      color: "#10b981",
    },
    {
      title: "Open Reports",
      value: dashboardData.header_data.total_reports,
      change:
        dashboardData.header_data.total_reports > 0 ? "Needs attention" : "All clear",
      trend: dashboardData.header_data.total_reports > 0 ? "down" : "up",
      icon: AlertCircle,
      color: "#f59e0b",
    },
    {
      title: "Premium Conversions",
      value: "—", // not provided by API yet
      change: "N/A",
      trend: "up",
      icon: CreditCard,
      color: "#007BFF",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <Card
            key={index}
            className="border-[#e2e8f0] hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}15` }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: metric.color }}
                  />
                </div>

                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    metric.trend === "up"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {metric.change}
                </div>
              </div>

              <h3 className="text-2xl text-[#1e293b] mb-1">
                {metric.value}
              </h3>
              <p className="text-sm text-[#64748b]">{metric.title}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}