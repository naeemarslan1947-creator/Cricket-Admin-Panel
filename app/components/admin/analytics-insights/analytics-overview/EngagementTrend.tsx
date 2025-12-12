"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type EngagementItem = {
  month: string;
  engagement: number;
};

interface EngagementTrendProps {
  engagementData: EngagementItem[];
}
const EngagementTrend: React.FC<EngagementTrendProps> = ({ engagementData }) => {
  return (
    <Card className="border-[#e2e8f0]">
      <CardHeader className="pb-4">
        <CardTitle className="text-[#1e293b]">Club Engagement Score</CardTitle>
        <p className="text-sm text-[#64748b] mt-1">Monthly engagement metrics</p>
      </CardHeader>

      <CardContent className="pt-0">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="engagement" fill="#00C853" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EngagementTrend;
