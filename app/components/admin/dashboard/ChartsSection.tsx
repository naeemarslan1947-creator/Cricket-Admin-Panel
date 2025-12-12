import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

const activityData = [
  { date: 'Mon', users: 420 },
  { date: 'Tue', users: 380 },
  { date: 'Wed', users: 450 },
  { date: 'Thu', users: 520 },
  { date: 'Fri', users: 610 },
  { date: 'Sat', users: 490 },
  { date: 'Sun', users: 380 },
];

const verificationData = [
  { month: 'Jan', verifications: 45, trials: 78 },
  { month: 'Feb', verifications: 52, trials: 85 },
  { month: 'Mar', verifications: 61, trials: 92 },
  { month: 'Apr', verifications: 58, trials: 88 },
  { month: 'May', verifications: 73, trials: 105 },
  { month: 'Jun', verifications: 89, trials: 118 },
];

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-[#e2e8f0] ">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">User Activity (Last 7 Days)</CardTitle>
          <p className="text-sm text-[#64748b]">Daily active users trend</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
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
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#007BFF" 
                strokeWidth={2}
                dot={{ fill: '#007BFF', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Club Verifications & Trials</CardTitle>
          <p className="text-sm text-[#64748b]">Monthly verification trends</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={verificationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="verifications" fill="#00C853" radius={[4, 4, 0, 0]} />
              <Bar dataKey="trials" fill="#007BFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}