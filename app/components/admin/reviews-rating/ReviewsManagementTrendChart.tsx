import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

interface TrendData {
  date: string;
  reviews: number;
}

interface ReviewsManagementTrendChartProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  trendData: TrendData[];
}

export default function ReviewsManagementTrendChart({ 

  trendData 
}: ReviewsManagementTrendChartProps) {
  return (
    <Card className="border-[#e2e8f0]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1e293b]">Review Trends</CardTitle>
            <p className="text-sm text-[#64748b]">Review submissions over time</p>
          </div>
         
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="reviews" stroke="#007BFF" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}