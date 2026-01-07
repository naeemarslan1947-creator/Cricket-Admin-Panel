import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { FileSpreadsheet } from 'lucide-react'
import { Badge } from '../../ui/badge'
import { GetExportHistory } from "@/Api's/repo"
import makeRequest from "@/Api's/apiHelper"

type CreatedBy = {
  _id: string
  user_name?: string
  email?: string
  full_name?: string
}

type ExportItem = {
  _id: string
  export_type: string
  export_format: string
  state: string
  no_of_records: number
  size?: string | null
  created_at: string
  created_by?: CreatedBy
}

// Helper function to format file size from bytes string to human readable format
const formatFileSize = (sizeInBytesStr: string | null | undefined): string => {
  if (!sizeInBytesStr) return '—'
  
  const sizeInBytes = parseFloat(sizeInBytesStr)
  if (isNaN(sizeInBytes) || sizeInBytes <= 0) return '—'
  
  const sizeInKB = sizeInBytes / 1024
  const sizeInMB = sizeInBytes / (1024 * 1024)
  const sizeInGB = sizeInBytes / (1024 * 1024 * 1024)
  
  if (sizeInGB >= 1) {
    return `${sizeInGB.toFixed(2)} GB`
  } else if (sizeInMB >= 1) {
    return `${sizeInMB.toFixed(2)} MB`
  } else if (sizeInKB >= 1) {
    return `${sizeInKB.toFixed(2)} KB`
  } else {
    return `${sizeInBytes.toFixed(2)} B`
  }
}

type ExportHistoryResponse = {
  response_code: number
  success: boolean
  status_code: number
  total_records: number
  page_number: number
  total_pages: number
  message: string
  error_message: null
  token: null
  result: ExportItem[]
}

const ExportHistory = () => {
  const [exportHistory, setExportHistory] = useState<ExportItem[]>([])

  useEffect(() => {
    const fetchExportHistory = async () => {
      try {
        const response = await makeRequest<ExportHistoryResponse>({
          url: GetExportHistory,
          method: 'GET',
        });

        setExportHistory(response?.data?.result ?? [])
      } catch (error) {
        console.error('Error fetching export history:', error);
      }
    }

    fetchExportHistory()
  }, [])

  return (
    <Card className="border-[#e2e8f0]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1e293b]">Export History</CardTitle>
            <p className="text-sm text-[#64748b]">
              View and download previous exports
            </p>
          </div>
          {/* <Button variant="outline" className="border-[#e2e8f0]">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {exportHistory.map((item) => (
          <Card key={item._id} className="border-[#e2e8f0]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">

                  <div className="w-12 h-12 bg-linear-to-br from-[#00C853] to-[#007BFF] rounded-lg flex items-center justify-center shadow-lg">
                    <FileSpreadsheet className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[#1e293b]">
                        {item.export_type}
                      </h4>

                      <Badge variant="outline">
                        {item.export_format?.toUpperCase()}
                      </Badge>

                      <Badge
                        className={
                          item.state === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : item.state === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }
                      >
                        {item.state}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-[#64748b] mb-1">
                      <span>{item.no_of_records} records</span>
                      <span>•</span>
                      <span>{formatFileSize(item.size)}</span>
                    </div>

                    <p className="text-xs text-[#94a3b8]">
                      {new Date(item.created_at).toLocaleString()}
                    </p>

                    <p className="text-sm text-[#64748b] mt-1">
                      Requested by{" "}
                      <span className="font-medium text-[#1e293b]">
                        {item?.created_by?.full_name ||
                          item?.created_by?.user_name ||
                          item?.created_by?.email ||
                          "Unknown"}
                      </span>
                    </p>
                  </div>
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
