import { Badge } from '@/app/components/ui/badge';

interface Report {
  id: number;
  reporter: string;
  offender: string;
  description: string;
  date: string;
  severity: 'High' | 'Medium' | 'Low';
}

interface ReportItemProps {
  report: Report;
}

export default function ReportItem({ report }: ReportItemProps) {
  const getSeverityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-amber-100 text-amber-800',
      'Low': 'bg-blue-100 text-blue-800',
    };
    
    const colorClass = colors[severity] || 'bg-gray-100 text-gray-800';
    return <Badge className={`${colorClass} hover:${colorClass.split(' ')[0]}`}>{severity}</Badge>;
  };

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-[#1e293b]">Report #{report.id}</h4>
            {getSeverityBadge(report.severity)}
          </div>
          <p className="text-sm text-[#64748b] mb-2">{report.description}</p>
          <div className="flex items-center gap-4 text-sm text-[#64748b]">
            <span>Reporter: <span className="text-[#1e293b]">{report.reporter}</span></span>
            <span>•</span>
            <span>Offender: <span className="text-[#1e293b]">{report.offender}</span></span>
            <span>•</span>
            <span>{report.date}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 p-3 bg-[#F8FAFC] rounded-lg">
        <h5 className="text-sm text-[#1e293b] mb-2">Offender History</h5>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-[#64748b]">Previous Reports: </span>
            <span className="text-[#1e293b]">3</span>
          </div>
          <div>
            <span className="text-[#64748b]">Warnings: </span>
            <span className="text-[#1e293b]">1</span>
          </div>
          <div>
            <span className="text-[#64748b]">Account Age: </span>
            <span className="text-[#1e293b]">6 months</span>
          </div>
        </div>
      </div>
    </>
  );
}