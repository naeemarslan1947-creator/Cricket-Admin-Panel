"use client";

import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type UserTypeItem = {
  name: string;
  value: number;
  percentage: string;
  color: string;
};

type DailySignup = {
  date: string;
  signups: number;
};

type WeeklySignup = {
  week: string;
  signups: number;
};

type MonthlySignup = {
  month: string;
  signups: number;
};

interface DetailUserTypeChartProps {
  monthlySignups: MonthlySignup[];
  weeklySignups: WeeklySignup[];
  dailySignups: DailySignup[];
  userTypeData: UserTypeItem[];
}

const DetailUserTypeChart: React.FC<DetailUserTypeChartProps> = ({
  monthlySignups,
  weeklySignups,
  dailySignups,
  userTypeData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-[#e2e8f0]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#1e293b]">Premium vs Free Users</CardTitle>
          <p className="text-sm text-[#64748b] mt-1">User subscription breakdown</p>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                paddingAngle={5}
              >
                {userTypeData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-3">
            {userTypeData.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-[#1e293b]">{item.name} Users</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-[#1e293b]">{item.value.toLocaleString()}</span>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {item.percentage}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#e2e8f0]">
        <CardHeader className="pb-4">
          <CardTitle className="text-[#1e293b]">User Signup Trends</CardTitle>
          <p className="text-sm text-[#64748b] mt-1">New user registrations over time</p>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid grid-cols-3 w-full mb-6">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailySignups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="signups" fill="#007BFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="weekly">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklySignups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="week" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="signups" fill="#00C853" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="monthly">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlySignups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="signups" fill="#9333ea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailUserTypeChart;
