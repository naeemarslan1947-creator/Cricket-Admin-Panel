import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

// ---------------------------
// Local Type Definitions
// ---------------------------

export interface PaymentHistoryItem {
  id: string;
  user: string;
  email: string;
  plan: "Premium" | "Pro" | "Basic";
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  date: string;
  invoiceUrl?: string;
}

// Props Interface
interface PaymentHistoryProps {
  paymentHistory: PaymentHistoryItem[];
  getPlanBadge: (plan: PaymentHistoryItem["plan"]) => React.ReactNode;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ paymentHistory, getPlanBadge }) => {
  return (
    <Card className="border-[#e2e8f0] ">
      <CardHeader>
        <CardTitle className="text-[#1e293b]">Payment History</CardTitle>
        <p className="text-sm text-[#64748b]">View all successful payment transactions</p>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paymentHistory.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="text-[#1e293b] font-mono text-sm">{payment.id}</TableCell>

                <TableCell className="text-[#1e293b]">{payment.user}</TableCell>

                <TableCell className="text-[#64748b]">{payment.email}</TableCell>

                <TableCell>{getPlanBadge(payment.plan)}</TableCell>

                <TableCell className="text-[#1e293b]">{payment.amount}</TableCell>

                <TableCell>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    {payment.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-[#64748b]">{payment.date}</TableCell>

                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="border-[#e2e8f0]">
                    View Invoice
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
