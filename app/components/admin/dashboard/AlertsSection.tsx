import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";

const alerts = [
  {
    type: 'warning',
    title: '15 Clubs Awaiting Verification',
    description: '8 clubs have been pending for over 7 days',
    action: 'Review Now'
  },
  {
    type: 'danger',
    title: '23 Unresolved Moderation Issues',
    description: '12 flagged posts, 11 reported comments',
    action: 'View Reports'
  },
  {
    type: 'info',
    title: '3 Youth Accounts Need Parent Verification',
    description: 'Parent consent pending for over 48 hours',
    action: 'Review Safety'
  },
];

const clubData = [
  { name: 'Verified', value: 856, color: '#00C853' },
  { name: 'Pending', value: 124, color: '#f59e0b' },
  { name: 'Hidden', value: 43, color: '#ef4444' },
];

export default function AlertsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Pending Actions & Alerts</CardTitle>
          <p className="text-sm text-[#64748b]">Items requiring your attention</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((alert, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === 'warning' 
                  ? 'bg-amber-50 border-amber-400' 
                  : alert.type === 'danger'
                  ? 'bg-red-50 border-red-400'
                  : 'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`text-sm mb-1 ${
                    alert.type === 'warning' 
                      ? 'text-amber-900' 
                      : alert.type === 'danger'
                      ? 'text-red-900'
                      : 'text-blue-900'
                  }`}>{alert.title}</h4>
                  <p className={`text-xs ${
                    alert.type === 'warning' 
                      ? 'text-amber-700' 
                      : alert.type === 'danger'
                      ? 'text-red-700'
                      : 'text-blue-700'
                  }`}>{alert.description}</p>
                </div>
                <button className={`px-3 py-1 rounded-md text-xs ${
                  alert.type === 'warning' 
                    ? 'bg-amber-600 text-white hover:bg-amber-700' 
                    : alert.type === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } transition-colors`}>
                  {alert.action}
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-[#e2e8f0]">
        <CardHeader>
          <CardTitle className="text-[#1e293b]">Club Status</CardTitle>
          <p className="text-sm text-[#64748b]">Distribution overview</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={clubData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {clubData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {clubData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#64748b]">{item.name}</span>
                </div>
                <span className="text-[#1e293b]">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}