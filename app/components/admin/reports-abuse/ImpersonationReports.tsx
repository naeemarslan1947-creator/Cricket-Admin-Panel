import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import ReportItem from './ReportItem';

interface Report {
  id: number;
  reporter: string;
  offender: string;
  description: string;
  date: string;
  severity: 'High' | 'Medium' | 'Low';
}

interface ImpersonationReportsProps {
  reports: Report[];
}

export default function ImpersonationReports({ reports }: ImpersonationReportsProps) {
  return (
    <>
      {reports.map((report) => (
        <Card key={report.id} className="border-[#e2e8f0] ">
          <CardContent className="p-6">
            <ReportItem report={report} />
            
            <div className="flex gap-2">
              <Button size="sm" className="bg-[#00C853] hover:bg-[#00a844] text-white">
                Verify Identity
              </Button>
              <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                Suspend Account
              </Button>
              <Button size="sm" variant="outline" className="border-[#e2e8f0]">
                Contact User
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}