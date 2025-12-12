import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import BullyingReports from './BullyingReports';  
import InappropriateContentReports from './InappropriateContentReports';
import ImpersonationReports from './ImpersonationReports';
import SpamReports from './SpamReports';
interface Report {
  id: number;
  reporter: string;
  offender: string;
  description: string;
  date: string;
  severity: 'High' | 'Medium' | 'Low';
}

interface ReportsData {
  bullying: Report[];
  inappropriate: Report[];
  impersonation: Report[];
  spam: Report[];
}

interface ReportsAbuseTabsProps {
  reports: ReportsData;
}

export default function ReportsAbuseTabs({ reports }: ReportsAbuseTabsProps) {
  return (
    <Tabs defaultValue="bullying" className="space-y-4">
      <TabsList>
        <TabsTrigger value="bullying">Bullying ({reports.bullying.length})</TabsTrigger>
        <TabsTrigger value="inappropriate">Inappropriate Content ({reports.inappropriate.length})</TabsTrigger>
        <TabsTrigger value="impersonation">Impersonation ({reports.impersonation.length})</TabsTrigger>
        <TabsTrigger value="spam">Spam ({reports.spam.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="bullying" className="space-y-4">
        <BullyingReports reports={reports.bullying} />
      </TabsContent>

      <TabsContent value="inappropriate" className="space-y-4">
        <InappropriateContentReports reports={reports.inappropriate} />
      </TabsContent>

      <TabsContent value="impersonation" className="space-y-4">
        <ImpersonationReports reports={reports.impersonation} />
      </TabsContent>

      <TabsContent value="spam" className="space-y-4">
        <SpamReports reports={reports.spam} />
      </TabsContent>
    </Tabs>
  );
}