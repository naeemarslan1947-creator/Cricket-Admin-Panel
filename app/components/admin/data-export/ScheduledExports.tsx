
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Clock } from 'lucide-react'
import { Badge } from '../../ui/badge'

interface ScheduledExport {
  id: string | number;
  name: string;
  status: string;
  dataType: string;
  format: string;
  schedule: string;
  recipient: string;
  lastRun: string;
  nextRun: string;
}

interface ScheduledExportsProps {
  scheduledExports: ScheduledExport[];
}

const ScheduledExports = ({scheduledExports}: ScheduledExportsProps) => {
  return (
    <Card className="border-[#e2e8f0] ">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1e293b]">Scheduled Exports</CardTitle>
                  <p className="text-sm text-[#64748b]">Automate regular data exports</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Clock className="w-4 h-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {scheduledExports.map((scheduled) => (
                <Card key={scheduled.id} className="border-[#e2e8f0]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-[#1e293b]">{scheduled.name}</h4>
                          <Badge className="bg-green-100 text-green-700">{scheduled.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div>
                            <span className="text-[#64748b]">Data Type:</span>
                            <span className="ml-2 text-[#1e293b]">{scheduled.dataType}</span>
                          </div>
                          <div>
                            <span className="text-[#64748b]">Format:</span>
                            <span className="ml-2 text-[#1e293b]">{scheduled.format}</span>
                          </div>
                          <div>
                            <span className="text-[#64748b]">Schedule:</span>
                            <span className="ml-2 text-[#1e293b]">{scheduled.schedule}</span>
                          </div>
                          <div>
                            <span className="text-[#64748b]">Send to:</span>
                            <span className="ml-2 text-[#1e293b]">{scheduled.recipient}</span>
                          </div>
                          <div>
                            <span className="text-[#64748b]">Last Run:</span>
                            <span className="ml-2 text-[#1e293b]">{scheduled.lastRun}</span>
                          </div>
                          <div>
                            <span className="text-[#64748b]">Next Run:</span>
                            <span className="ml-2 text-[#1e293b]">{scheduled.nextRun}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-[#e2e8f0]">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="border-orange-200 text-orange-600">
                          Pause
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
  )
}

export default ScheduledExports