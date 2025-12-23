import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { DashboardData } from "@/app/types/dashboard";

export default function ChartsSection({ dashboardData }: { dashboardData: DashboardData | null }) {
  /* LINE CHART DATA */
  const usersActivityChartData =
    dashboardData?.graphs_data?.users_by_last_active?.map((item) => ({
      date: item.day,
      users: item.count,
    })) || [];
    console.log("📢[ChartsSection.tsx:21]: usersActivityChartData: ", usersActivityChartData);

  /* BAR CHART DATA (SINGLE KEY) */
  const verifiedClubsChartData =
    dashboardData?.graphs_data?.users_by_club_verified_at?.map((item) => ({
      month: item.month,
      value: item.count,
    })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* USER ACTIVITY LINE CHART */}
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">
            User Activity (Last 7 Days)
          </CardTitle>
          <p className="text-sm text-[#64748b]">Daily active users trend</p>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usersActivityChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#007BFF"
                strokeWidth={2}
                dot={{ fill: "#007BFF", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* VERIFIED CLUBS BAR CHART (SINGLE BAR) */}
      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">
            Verified Clubs
          </CardTitle>
          <p className="text-sm text-[#64748b]">
            Monthly verified clubs count
          </p>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={verifiedClubsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="value"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
