import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Clock, Download, FileSpreadsheet, Filter } from 'lucide-react'
import { Badge } from '../../ui/badge'


export interface ExportHistoryItem {
  id: string;
  dataType: string;
  format: string;
  status: 'Completed' | 'Processing' | 'Failed';
  records: number;
  fileSize: string;
  requestedBy: string;
  requestedDate: string;
}

interface ExportHistoryProps {
  exportHistory: ExportHistoryItem[];
}

const ExportHistory: React.FC<ExportHistoryProps> = ({ exportHistory }) => {
  return (
    <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1e293b]">Export History</CardTitle>
                  <p className="text-sm text-[#64748b]">View and download previous exports</p>
                </div>
                <Button variant="outline" className="border-[#e2e8f0]">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {exportHistory.map((export_item) => (
                <Card key={export_item.id} className="border-[#e2e8f0]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-linear-to-br from-[#00C853] to-[#007BFF] rounded-lg flex items-center justify-center shadow-lg">
                          <FileSpreadsheet className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1e293b]">{export_item.dataType}</h4>
                            <Badge variant="outline">{export_item.format}</Badge>

                            <Badge className={
                              export_item.status === 'Completed' 
                                ? 'bg-green-100 text-green-700' 
                                : export_item.status === 'Processing'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-red-100 text-red-700'
                            }>
                              {export_item.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#64748b] mb-1">
                            <span>{export_item.records.toLocaleString()} records</span>
                            <span>•</span>
                            <span>{export_item.fileSize}</span>
                            <span>•</span>
                            <span>Requested by {export_item.requestedBy}</span>
                          </div>
                          <p className="text-xs text-[#94a3b8]">{export_item.requestedDate}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {export_item.status === 'Completed' ? (
                          <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        ) : (
                          <Button variant="outline" disabled>
                            <Clock className="w-4 h-4 mr-2" />
                            Processing...
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
  )
}

export default ExportHistory