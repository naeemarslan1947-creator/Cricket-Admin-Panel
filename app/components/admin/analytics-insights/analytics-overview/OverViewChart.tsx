"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import React from "react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AudienceItem = {
  name: string;
  value: number;
  color: string;
};

type UserActivityItem = {
  date: string;
  users: number;
  clubs: number;
};

interface OverViewChartProps {
  audienceData: AudienceItem[];
  userActivityData: UserActivityItem[];
}


const OverViewChart: React.FC<OverViewChartProps> = ({
  audienceData,
  userActivityData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Activity */}
      <Card className="border-[#e2e8f0]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#1e293b]">User Activity Trends</CardTitle>
          <p className="text-sm text-[#64748b] mt-1">Users and clubs over time</p>
        </CardHeader>

        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />

              <Line type="monotone" dataKey="users" stroke="#007BFF" strokeWidth={2} />
              <Line type="monotone" dataKey="clubs" stroke="#00C853" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Audience Breakdown */}
      <Card className="border-[#e2e8f0]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#1e293b]">Audience Breakdown</CardTitle>
          <p className="text-sm text-[#64748b] mt-1">User type distribution</p>
        </CardHeader>

        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={audienceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {audienceData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {audienceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[#64748b]">{item.name}</span>
                </div>

                <span className="text-[#1e293b]">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverViewChart;
