import ReportsAbuseHeader from '@/app/components/admin/reports-abuse/ReportsAbuseHeader';
import ReportsAbuseSummary from '@/app/components/admin/reports-abuse/ReportsAbuseSummary';
import ReportsAbuseTabs from '@/app/components/admin/reports-abuse/ReportsAbuseTabs';
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

export default function ReportsAbuse() {
  const reports: ReportsData = {
    bullying: [
      {
        id: 1,
        reporter: 'user123',
        offender: 'player456',
        description: 'Harassing messages sent repeatedly',
        date: '2 hours ago',
        severity: 'High'
      },
    ],
    inappropriate: [
      {
        id: 2,
        reporter: 'coach789',
        offender: 'user_abc',
        description: 'Posted inappropriate content in team chat',
        date: '5 hours ago',
        severity: 'Medium'
      },
    ],
    impersonation: [
      {
        id: 3,
        reporter: 'club_admin',
        offender: 'fake_user',
        description: 'Pretending to be a verified coach',
        date: '1 day ago',
        severity: 'High'
      },
    ],
    spam: [
      {
        id: 4,
        reporter: 'member001',
        offender: 'spammer99',
        description: 'Sending promotional messages to all members',
        date: '3 hours ago',
        severity: 'Low'
      },
    ],
  };

  return (
    <div className="space-y-6">
      <ReportsAbuseHeader />
      <ReportsAbuseSummary />
      <ReportsAbuseTabs reports={reports} />
    </div>
  );
}