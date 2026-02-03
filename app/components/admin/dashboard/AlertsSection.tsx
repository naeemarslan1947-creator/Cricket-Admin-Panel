'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { DashboardData, HeaderData, GraphsData } from "@/app/types/dashboard";
import { 
  Building2, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Bell
} from 'lucide-react';

type AlertItem = {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  action: string;
  redirectPath: string;
  value?: number;
  trend?: number;
  timestamp?: string;
  isRead?: boolean;
};

const generateAlerts = (headerData: HeaderData | null | undefined, graphsData: GraphsData | null | undefined): AlertItem[] => {
  const alerts: AlertItem[] = [];
  
  if (!headerData) return alerts;

  if (graphsData?.total_clubs_not_verified && graphsData.total_clubs_not_verified > 0) {
    alerts.push({
      id: 'clubs-pending',
      type: 'warning',
      title: `${graphsData.total_clubs_not_verified} Clubs Awaiting Verification`,
      description: `${graphsData.total_clubs_not_verified} clubs have been pending for verification`,
      action: 'Review Now',
      redirectPath: '/club-management',
      value: graphsData.total_clubs_not_verified,
      timestamp: new Date().toISOString(),
    });
  }

  if (headerData.total_reports && headerData.total_reports > 0) {
    alerts.push({
      id: 'unresolved-reports',
      type: 'danger',
      title: `${headerData.total_reports} Unresolved Reports`,
      description: `${headerData.total_reports} total reports require your attention`,
      action: 'View Reports',
      redirectPath: '/reports-abuse',
      value: headerData.total_reports,
      timestamp: new Date().toISOString(),
    });
  }

  if (headerData.total_players && headerData.total_players.count > 0) {
    const growthText = headerData.total_players_by_last_30days?.trend 
      ? `${headerData.total_players_by_last_30days.trend > 0 ? '+' : ''}${headerData.total_players_by_last_30days.trend}% in last 30 days`
      : 'Total registered players';
    
    alerts.push({
      id: 'players-info',
      type: 'info',
      title: `${headerData.total_players.count.toLocaleString()} Total Users`,
      description: growthText,
      action: 'View Players',
      redirectPath: '/users-management',
      value: headerData.total_players.count,
      timestamp: new Date().toISOString(),
    });
  }

  if (graphsData?.total_clubs_verified && graphsData.total_clubs_verified > 0) {
    alerts.push({
      id: 'verified-clubs',
      type: 'info',
      title: `${graphsData.total_clubs_verified.toLocaleString()} Verified Clubs`,
      description: 'Clubs with verified status',
      action: 'View Clubs',
      redirectPath: '/club-management',
      value: graphsData.total_clubs_verified,
      timestamp: new Date().toISOString(),
    });
  }

  alerts.push({
    id: 'moderation-reminder',
    type: 'warning',
    title: 'Content Moderation',
    description: 'Review flagged content regularly to maintain platform quality',
    action: 'Moderate',
    redirectPath: '/content-moderation',
    timestamp: new Date().toISOString(),
    isRead: false,
  });

  return alerts;
};

const getAlertIcon = (type: AlertItem['type']) => {
  switch (type) {
    case 'warning':
      return <Building2 className="w-5 h-5 text-amber-600" />;
    case 'danger':
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    case 'info':
      return <ShieldAlert className="w-5 h-5 text-blue-600" />;
    default:
      return <Bell className="w-5 h-5 text-gray-600" />;
  }
};

export default function AlertsSection({ dashboardData }: { dashboardData: DashboardData | null }) {
  const router = useRouter();
  const [alerts, setAlerts] = useState<AlertItem[]>(() => 
    generateAlerts(dashboardData?.header_data, dashboardData?.graphs_data)
  );
  
  const graphsData = dashboardData?.graphs_data;
  
  const clubData = [
    { name: 'Verified', value: graphsData?.total_clubs_verified || 0, color: '#00C853' },
    { name: 'Pending', value: graphsData?.total_clubs_not_verified || 0, color: '#f59e0b' },
  ];

  const handleAlertAction = (redirectPath: string) => {
    router.push(redirectPath);
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };


  const getAlertStyles = (type: AlertItem['type']) => {
    switch (type) {
      case 'warning':
        return {
          container: `bg-amber-50 border-amber-400`,
          title: 'text-amber-900',
          description: 'text-amber-700',
          button: 'bg-amber-600 text-white hover:bg-amber-700',
          badge: 'bg-amber-100 text-amber-800',
        };
      case 'danger':
        return {
          container: `bg-red-50 border-red-400`,
          title: 'text-red-900',
          description: 'text-red-700',
          button: 'bg-red-600 text-white hover:bg-red-700',
          badge: 'bg-red-100 text-red-800',
        };
      case 'info':
      default:
        return {
          container: `bg-blue-50 border-blue-400`,
          title: 'text-blue-900',
          description: 'text-blue-700',
          button: 'bg-blue-600 text-white hover:bg-blue-700',
          badge: 'bg-blue-100 text-blue-800',
        };
    }
  };

  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    const priority = { danger: 0, warning: 1, info: 2 };
    return priority[a.type] - priority[b.type];
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border-[#e2e8f0]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1e293b] flex items-center gap-2">
                Pending Actions & Alerts
               
              </CardTitle>
              <p className="text-sm text-[#64748b]">Items requiring your attention</p>
            </div>
           
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedAlerts.length > 0 ? (
            sortedAlerts.map((alert) => {
              const styles = getAlertStyles(alert.type);
              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${styles.container}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-0.5">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-sm font-medium ${styles.title}`}>{alert.title}</h4>
                        </div>
                        <p className={`text-xs ${styles.description} mt-1`}>{alert.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          markAsRead(alert.id);
                          handleAlertAction(alert.redirectPath);
                        }}
                        className={`px-3 py-1 rounded-md text-xs ${styles.button} transition-colors flex items-center gap-1`}
                      >
                        {alert.action}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-[#1e293b] font-medium mb-1">All caught up!</h3>
              <p className="text-sm text-[#64748b]">No pending alerts at this time</p>
            </div>
          )}
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
              <div  className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#00C853] " />
                  <span className="text-sm text-[#64748b]">Verified</span>
                </div>
                <span className="text-[#1e293b]">{dashboardData?.graphs_data?.total_clubs_verified}</span>
              </div>
          </div>
          <div className="mt-4 space-y-2">
              <div  className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <span className="text-sm text-[#64748b]">Pending</span>
                </div>
                <span className="text-[#1e293b]">{dashboardData?.graphs_data?.total_clubs_not_verified}</span>
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}