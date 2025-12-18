"use client";
import { useState } from 'react';
import { Download, Calendar, Clock, Database, Users, Building2, CreditCard, Star, AlertTriangle, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Card, CardContent } from '@/app/components/ui/card';
import QuickExport from '@/app/components/admin/data-export/QuickExport';
import ExportHistory, { ExportHistoryItem } from '@/app/components/admin/data-export/ExportHistory';
import ScheduledExports from '@/app/components/admin/data-export/ScheduledExports';

export default function DataExportTools() {


  const [selectedDataType, setSelectedDataType] = useState<string>('');
  const [showQuickExport, setShowQuickExport] = useState(false);

  // Data types available for export
  const dataTypes = [
    {
      id: 'users',
      name: 'User List',
      icon: Users,
      description: 'Export all user accounts with details',
      fields: ['Name', 'Email', 'Phone', 'Registration Date', 'Status', 'Role', 'Subscription Type'],
      recordCount: 15234,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'clubs',
      name: 'Club List',
      icon: Building2,
      description: 'Export all registered clubs',
      fields: ['Club Name', 'Owner', 'Location', 'Created Date', 'Members Count', 'Status', 'Verification'],
      recordCount: 1234,
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'subscriptions',
      name: 'Subscriptions',
      icon: CreditCard,
      description: 'Export subscription and billing data',
      fields: ['User', 'Plan Type', 'Start Date', 'End Date', 'Amount', 'Status', 'Payment Method'],
      recordCount: 3421,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'reviews',
      name: 'Review Data',
      icon: Star,
      description: 'Export all reviews and ratings',
      fields: ['Reviewer', 'Club', 'Rating', 'Review Text', 'Date', 'Status', 'Helpful Votes'],
      recordCount: 8567,
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 'reports',
      name: 'Reports & Abuse',
      icon: AlertTriangle,
      description: 'Export abuse reports and flags',
      fields: ['Reporter', 'Content Type', 'Reason', 'Date', 'Status', 'Assigned To', 'Resolution'],
      recordCount: 542,
      color: 'bg-red-100 text-red-700'
    },
    {
      id: 'moderation',
      name: 'Moderation History',
      icon: Shield,
      description: 'Export content moderation actions',
      fields: ['Moderator', 'Action', 'Content Type', 'Reason', 'Date', 'Status', 'Notes'],
      recordCount: 2341,
      color: 'bg-orange-100 text-orange-700'
    }
  ];

  // Export history
  const exportHistory: ExportHistoryItem[] = [
    {
      id: '1',
      dataType: 'User List',
      format: 'CSV',
      records: 15234,
      requestedBy: 'John Smith',
      requestedDate: '2024-12-04 10:30 AM',
      status: 'Completed' as const,
      fileSize: '2.3 MB'
    },
    {
      id: '2',
      dataType: 'Subscriptions',
      format: 'Excel',
      records: 3421,
      requestedBy: 'Sarah Wilson',
      requestedDate: '2024-12-03 03:15 PM',
      status: 'Completed' as const,
      fileSize: '1.1 MB'
    },
    {
      id: '3',
      dataType: 'Reports & Abuse',
      format: 'JSON',
      records: 542,
      requestedBy: 'Mike Johnson',
      requestedDate: '2024-12-03 11:20 AM',
      status: 'Processing' as const,
      fileSize: '-'
    },
    {
      id: '4',
      dataType: 'Club List',
      format: 'CSV',
      records: 1234,
      requestedBy: 'John Smith',
      requestedDate: '2024-12-02 02:45 PM',
      status: 'Completed' as const,
      fileSize: '456 KB'
    }
  ];

  // Scheduled exports
  const scheduledExports = [
    {
      id: '1',
      name: 'Weekly User Report',
      dataType: 'User List',
      format: 'CSV',
      schedule: 'Every Monday at 9:00 AM',
      recipient: 'admin@crickit.com',
      status: 'Active',
      lastRun: '2024-12-02 09:00 AM',
      nextRun: '2024-12-09 09:00 AM'
    },
    {
      id: '2',
      name: 'Monthly Subscription Export',
      dataType: 'Subscriptions',
      format: 'Excel',
      schedule: '1st of every month at 8:00 AM',
      recipient: 'finance@crickit.com',
      status: 'Active',
      lastRun: '2024-12-01 08:00 AM',
      nextRun: '2025-01-01 08:00 AM'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-[#1e293b] mb-1">Data Export Tools</h1>
        <p className="text-[#64748b]">Export platform data for analysis and reporting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Total Exports</p>
                <h3 className="text-2xl text-[#1e293b]">234</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-[#007BFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">This Month</p>
                <h3 className="text-2xl text-[#1e293b]">45</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#00C853]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Scheduled</p>
                <h3 className="text-2xl text-[#1e293b]">2</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] ">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#64748b] mb-1">Total Size</p>
                <h3 className="text-2xl text-[#1e293b]">45.2 GB</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="export" className="space-y-4">
        <TabsList >
          <TabsTrigger value="export">Quick Export</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Exports</TabsTrigger>
        </TabsList>



        <TabsContent value="export" className="space-y-4">
          <QuickExport 
            dataTypes={dataTypes} 
            selectedDataType={selectedDataType} 
            setSelectedDataType={setSelectedDataType} 
            setShowQuickExport={setShowQuickExport} 
            showQuickExport={showQuickExport} 
          />
        </TabsContent>

        {/* Export History */}
        <TabsContent value="history" className="space-y-4">
          <ExportHistory exportHistory={exportHistory}/>
        </TabsContent>

        {/* Scheduled Exports */}
        <TabsContent value="scheduled" className="space-y-4">
          <ScheduledExports scheduledExports={scheduledExports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
