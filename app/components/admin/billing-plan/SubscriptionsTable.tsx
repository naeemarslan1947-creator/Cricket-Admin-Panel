import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";

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

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  getPlanBadge: (plan: Subscription["plan"]) => React.ReactNode;
  getStatusBadge: (status: Subscription["status"]) => React.ReactNode;
  setManageDialogOpen: (open: boolean) => void;
  setSelectedSubscription: (subscription: Subscription | null) => void;
}

const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({
  subscriptions,
  getPlanBadge,
  getStatusBadge,
  setManageDialogOpen,
  setSelectedSubscription,
}) => {
  return (
    <Card className="border-[#e2e8f0] ">
      <CardHeader>
        <CardTitle className="text-[#1e293b]">User Subscriptions</CardTitle>
        <p className="text-sm text-[#64748b]">
          Manage all active and trial subscriptions
        </p>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Renewal Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subscriptions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="text-[#1e293b]">{sub.user}</TableCell>
                <TableCell className="text-[#64748b]">{sub.email}</TableCell>

                <TableCell>{getPlanBadge(sub.plan)}</TableCell>

                <TableCell>{getStatusBadge(sub.status)}</TableCell>

                <TableCell className="text-[#64748b]">{sub.renewal}</TableCell>

                <TableCell className="text-[#1e293b]">{sub.amount}</TableCell>

                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" className="border-[#e2e8f0]">
                      Extend Trial
                    </Button>

                    <Button
                      size="sm"
                      className="bg-[#007BFF] hover:bg-[#0056b3] text-white"
                      onClick={() => {
                        setManageDialogOpen(true);
                        setSelectedSubscription(sub);
                      }}
                    >
                      Manage
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubscriptionsTable;
