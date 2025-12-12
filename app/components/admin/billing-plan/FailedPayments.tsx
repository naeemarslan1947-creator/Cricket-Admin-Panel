import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { Button } from '../../ui/button';

export interface FailedPayment {
  id: string | number;
  user: string;
  email: string;
  plan: 'Premium' | 'Pro' | 'Basic';
  amount: string;
  reason: string;
  date: string;
  retryDate: string;
  attempts: number;
}

interface FailedPaymentsProps {
  failedPayments: FailedPayment[];
  getPlanBadge: (plan: FailedPayment['plan']) => React.ReactNode;
}

const FailedPayments: React.FC<FailedPaymentsProps> = ({ failedPayments, getPlanBadge }) => {
  return (
    <Card className="border-[#e2e8f0] ">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1e293b]">Failed Payments & Billing Issues</CardTitle>
            <p className="text-sm text-[#64748b]">Monitor and resolve payment failures</p>
          </div>
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {failedPayments.length} Issues
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Failed Date</TableHead>
              <TableHead>Next Retry</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {failedPayments.map((payment) => (
              <TableRow key={payment.id} className="bg-red-50">
                <TableCell className="text-[#1e293b] font-mono text-sm">{payment.id}</TableCell>
                <TableCell className="text-[#1e293b]">{payment.user}</TableCell>
                <TableCell className="text-[#64748b]">{payment.email}</TableCell>
                <TableCell>{getPlanBadge(payment.plan)}</TableCell>
                <TableCell className="text-[#1e293b]">{payment.amount}</TableCell>
                <TableCell>
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100">{payment.reason}</Badge>
                </TableCell>
                <TableCell className="text-[#64748b]">{payment.date}</TableCell>
                <TableCell className="text-[#64748b]">{payment.retryDate}</TableCell>
                <TableCell>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    {payment.attempts}/3
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" className="border-[#e2e8f0]">
                      Notify User
                    </Button>
                    <Button size="sm" className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
                      Retry Now
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

export default FailedPayments;
