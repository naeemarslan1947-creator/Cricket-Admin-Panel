"use client";

import { useState } from 'react';
import { Download } from 'lucide-react';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

import SummaryCard from '@/app/components/admin/billing-plan/SummaryCard';
import SubscriptionsTable from '@/app/components/admin/billing-plan/SubscriptionsTable';
import FailedPayments from '@/app/components/admin/billing-plan/FailedPayments';
import PaymentHistory from '@/app/components/admin/billing-plan/PaymentHistory';
import StripeIntegrationStatus from '@/app/components/admin/billing-plan/StripeIntegrationStatus';
import ManageSubscriptionDialog from '@/app/components/admin/billing-plan/ManageSubscriptionDialog';
import ExportDialog from '@/app/components/admin/billing-plan/ExportDialog';

export interface Subscription {
  id: number;
  user: string;
  email: string;
  plan: "Premium" | "Pro" | "Basic";
  status: "Active" | "Trial" | "Expired" | "Cancelled";
  trial: boolean;
  renewal: string;
  amount: string;
}

export interface PaymentRecord {
  id: string;
  user: string;
  email: string;
  amount: string;
  plan: "Premium" | "Pro" | "Basic";  
  status: "Paid" | "Pending" | "Failed";
  date: string;
  invoiceUrl: string;
}

export interface FailedPaymentRecord {
  id: string;
  user: string;
  email: string;
  amount: string;
  plan: "Premium" | "Pro" | "Basic";  
  reason: string;
  date: string;
  retryDate: string;
  attempts: number;
}

export default function BillingSubscription() {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const stripeStatus = {
    connected: true,
    lastSynced: "2 minutes ago",
    webhooksActive: true,
    apiVersion: "2023-10-16",
    testMode: false,
    issues: []
  };

  const subscriptions: Subscription[] = [
    {
      id: 1,
      user: "Virat Kohli",
      email: "virat.k@example.com",
      plan: "Premium",
      status: "Active",
      trial: false,
      renewal: "2024-12-15",
      amount: "$29.99"
    },
    {
      id: 2,
      user: "Sarah Johnson",
      email: "sarah.j@example.com",
      plan: "Pro",
      status: "Trial",
      trial: true,
      renewal: "2024-11-20",
      amount: "$0.00"
    },
    {
      id: 3,
      user: "Ravi Sharma",
      email: "ravi.s@example.com",
      plan: "Premium",
      status: "Active",
      trial: false,
      renewal: "2024-12-01",
      amount: "$29.99"
    }
  ];

  const paymentHistory: PaymentRecord[] = [
    {
      id: "inv_001",
      user: "Virat Kohli",
      email: "virat.k@example.com",
      amount: "$29.99",
      plan: "Premium",
      status: "Paid",
      date: "2024-11-15",
      invoiceUrl: "#"
    },
    {
      id: "inv_002",
      user: "Ben Stokes",
      email: "ben.s@example.com",
      amount: "$19.99",
      plan: "Pro",
      status: "Paid",
      date: "2024-11-14",
      invoiceUrl: "#"
    },
    {
      id: "inv_003",
      user: "Joe Root",
      email: "joe.r@example.com",
      amount: "$29.99",
      plan: "Premium",
      status: "Paid",
      date: "2024-11-13",
      invoiceUrl: "#"
    },
    {
      id: "inv_004",
      user: "James Anderson",
      email: "james.a@example.com",
      amount: "$19.99",
      plan: "Pro",
      status: "Paid",
      date: "2024-11-12",
      invoiceUrl: "#"
    }
  ];

  const failedPayments: FailedPaymentRecord[] = [
    {
      id: "fail_001",
      user: "Stuart Broad",
      email: "stuart.b@example.com",
      amount: "$29.99",
      plan: "Premium",
      reason: "Insufficient funds",
      date: "2024-11-16",
      retryDate: "2024-11-18",
      attempts: 2
    },
    {
      id: "fail_002",
      user: "Chris Woakes",
      email: "chris.w@example.com",
      amount: "$19.99",
      plan: "Pro",
      reason: "Card declined",
      date: "2024-11-15",
      retryDate: "2024-11-17",
      attempts: 1
    },
    {
      id: "fail_003",
      user: "Jonny Bairstow",
      email: "jonny.b@example.com",
      amount: "$29.99",
      plan: "Premium",
      reason: "Card expired",
      date: "2024-11-14",
      retryDate: "2024-11-16",
      attempts: 3
    }
  ];

  const getStatusBadge = (status: Subscription["status"]) => {
    const colors: Record<Subscription["status"], string> = {
      Active: "bg-green-100 text-green-800",
      Trial: "bg-blue-100 text-blue-800",
      Expired: "bg-red-100 text-red-800",
      Cancelled: "bg-gray-100 text-gray-800",
    };
    return <Badge className={`${colors[status]} hover:${colors[status]}`}>{status}</Badge>;
  };

  const getPlanBadge = (plan: Subscription["plan"]) => {
    const colors: Record<Subscription["plan"], string> = {
      Premium: "bg-purple-100 text-purple-800",
      Pro: "bg-blue-100 text-blue-800",
      Basic: "bg-gray-100 text-gray-800",
    };
    return <Badge className={`${colors[plan]} hover:${colors[plan]}`}>{plan}</Badge>;
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#1e293b] mb-1">Billing & Subscription Management</h1>
          <p className="text-[#64748b]">Track subscriptions, revenue, and manage user plans</p>
        </div>

        <Button
          className="bg-[#00C853] hover:bg-[#00A843] text-white"
          onClick={() => setExportDialogOpen(true)}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Financial Data
        </Button>
      </div>

      <SummaryCard />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="failed">Failed Payments</TabsTrigger>
          {/* <TabsTrigger value="stripe">Stripe Status</TabsTrigger> */}
        </TabsList>

        <TabsContent value="subscriptions">
          <SubscriptionsTable
            subscriptions={subscriptions}
            getPlanBadge={getPlanBadge}
            getStatusBadge={getStatusBadge}
            setSelectedSubscription={setSelectedSubscription}
            setManageDialogOpen={setManageDialogOpen}
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory paymentHistory={paymentHistory} getPlanBadge={getPlanBadge} />
        </TabsContent>

        <TabsContent value="failed">
          <FailedPayments failedPayments={failedPayments} getPlanBadge={getPlanBadge} />
        </TabsContent>

        {/* <TabsContent value="stripe">
          <StripeIntegrationStatus stripeStatus={stripeStatus} />
        </TabsContent> */}
      </Tabs>

      <ManageSubscriptionDialog
        manageDialogOpen={manageDialogOpen}
        setManageDialogOpen={setManageDialogOpen}
        selectedSubscription={selectedSubscription}
        getPlanBadge={getPlanBadge}
        getStatusBadge={getStatusBadge}
      />

      <ExportDialog
        setExportDialogOpen={setExportDialogOpen}
        exportDialogOpen={exportDialogOpen}
      />
    </div>
  );
}
