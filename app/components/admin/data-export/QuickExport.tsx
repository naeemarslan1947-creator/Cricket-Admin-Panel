"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Download, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import {
  ExportUserList,
  ExportClubList,
  ExportDataReviews,
  ExportDataReports,
  ExportDataAdminLogs,
  CreateDataExportEntry,
} from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";
import { useAuth } from "@/app/hooks/useAuth";

interface DataType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  fields: string[];
}

interface QuickExportProps {
  dataTypes: DataType[];
  selectedDataType: string;
  setSelectedDataType: (id: string) => void;
  showQuickExport: boolean;
  setShowQuickExport: (show: boolean) => void;
}

const QuickExport: React.FC<QuickExportProps> = ({
  dataTypes,
  selectedDataType,
  setSelectedDataType,
  showQuickExport,
  setShowQuickExport,
}) => {
  const { user } = useAuth();
  const [exportFormat, setExportFormat] = useState("csv");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "empty" | "error">("idle");
  const [validationError, setValidationError] = useState<string>("");

  const validateDates = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const todayStr = today.toISOString().split('T')[0];

    // Check if start date is in the future
    if (startDate && startDate > todayStr) {
      setValidationError("Start date cannot be in the future");
      return false;
    }

    // Check if end date is in the future
    if (endDate && endDate > todayStr) {
      setValidationError("End date cannot be in the future");
      return false;
    }

    // Check if start date is after end date
    if (startDate && endDate && startDate > endDate) {
      setValidationError("Start date cannot be after end date");
      return false;
    }

    setValidationError("");
    return true;
  };

  const getFileBaseName = () => {
    const type =
      dataTypes.find((t) => t.id === selectedDataType)?.name || "export";
    const date = new Date().toISOString().split("T")[0];
    return `${type.toLowerCase().replace(/\s+/g, "_")}_${date}`;
  };

  const getEndpoint = (type: string) => {
    const map: Record<string, string> = {
      users: ExportUserList,
      clubs: ExportClubList,
      reviews: ExportDataReviews,
      reports: ExportDataReports,
      admin_logs: ExportDataAdminLogs,
    };

    return map[type] || ExportUserList;
  };

  const convertToCSV = (data: Record<string, unknown>[]) => {
    if (!data?.length) return "";

    const headers = Array.from(
      new Set(data.flatMap((row) => Object.keys(row)))
    );

    const escape = (value: unknown) => {
      if (value === null || value === undefined) return "";
      let str = String(value);
      if (/[,"\n]/.test(str)) str = `"${str.replace(/"/g, '""')}"`;
      return str;
    };

    const rows = data.map((row) =>
      headers.map((h) => escape(row[h])).join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  };

  const convertToHTML = (data: Record<string, unknown>[]) => {
    if (!data?.length) return "";

    const headers = Array.from(
      new Set(data.flatMap((row) => Object.keys(row)))
    );

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; }
            th { background: #2563eb; color:#fff; }
            tr:nth-child(even) { background:#f9fafb }
          </style>
        </head>
        <body>
          <h2>Export Report</h2>
          <table>
            <thead>
              <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) =>
                    `<tr>${headers
                      .map(
                        (h) =>
                          `<td>${row[h] === undefined ? "" : row[h]}</td>`
                      )
                      .join("")}</tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(url);
  };

  const createDataExportEntry = async (
    state: "pending" | "scheduled" | "completed" | "failed",
    noOfRecords: number,
    fileSizeBytes: number
  ) => {
    const selectedType = dataTypes.find((t) => t.id === selectedDataType);
    const exportType = selectedType?.name || "";
    const fileSize = fileSizeBytes / 1024;

    try {
      await makeRequest({
        url: CreateDataExportEntry,
        method: "POST",
        data: {
          created_by: user?._id || "",
          export_type: exportType,
          start_date: startDate,
          end_date: endDate,  
          no_of_records: noOfRecords,
          state: state,
          export_format: exportFormat,
          size: fileSize,
        },
      });
    } catch (error) {
      console.error("Failed to create data export entry:", error);
    }
  };

  const handleExport = async () => {
    let exportSuccess = false;
    let exportData: Record<string, unknown>[] = [];
    let exportBlob: Blob | null = null;
    let exportFilename = "";

    try {
      setIsExporting(true);
      setExportStatus("idle");

      // Validate dates before making API call
      if (!validateDates()) {
        setIsExporting(false);
        return;
      }

      const response = await makeRequest({
        url: getEndpoint(selectedDataType),
        method: "GET",
        params: {
          own_user_id: user?._id,
          startDate,
          endDate,
        },
      });

      const data = response?.data;

      if (!Array.isArray(data)) {
        console.warn("Unexpected export data format");
        setExportStatus("error");
        // Log the failed export due to unexpected data format
        await createDataExportEntry("failed", 0, 0);
        return;
      }

      // Check if data is empty
      if (!data || data.length === 0) {
        setExportStatus("empty");
        // Log the empty export
        await createDataExportEntry("completed", 0, 0);
        return;
      }

      setExportStatus("success");
      const baseName = getFileBaseName();

      if (exportFormat === "json") {
        exportBlob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        exportFilename = `${baseName}.json`;
      } else if (exportFormat === "pdf") {
        exportBlob = new Blob([convertToHTML(data)], { type: "text/html" });
        exportFilename = `${baseName}.html`;
      } else {
        exportBlob = new Blob([convertToCSV(data)], {
          type: "text/csv;charset=utf-8;",
        });
        exportFilename = `${baseName}.csv`;
      }

      exportData = data;
      exportSuccess = true;

      triggerDownload(exportBlob, exportFilename);

    } catch (e) {
      console.error("Export failed", e);
      setExportStatus("error");
    } finally {
      setIsExporting(false);
    }

    // Always log the export result after the process completes
    if (exportSuccess) {
      await createDataExportEntry("completed", exportData.length, exportBlob?.size || 0);
    } else {
      await createDataExportEntry("failed", 0, 0);
    }
  };

  return (
    <Card className="border-[#e2e8f0]">
      <CardHeader>
        <CardTitle className="text-[#1e293b]">Select Data to Export</CardTitle>
        <p className="text-sm text-[#64748b]">
          Choose what data you want to export and configure options
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dataTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedDataType === type.id;

            return (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-[#007BFF] bg-blue-50 shadow-md'
                    : 'border-[#e2e8f0] hover:border-[#007BFF]'
                }`}
                onClick={() => {
                  setSelectedDataType(type.id);
                  setShowQuickExport(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[#1e293b] mb-1">{type.name}</h4>
                      <p className="text-xs text-[#64748b] mb-2">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Export Configuration Form */}
        {showQuickExport && selectedDataType && (
          <Card className="border-[#007BFF] bg-blue-50">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[#1e293b]">
                  Configure Export: {dataTypes.find((t) => t.id === selectedDataType)?.name}
                </h4>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowQuickExport(false);
                    setSelectedDataType('');
                  }}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Export Format */}
                <div>
                  <Label htmlFor="export-format">Export Format</Label>
                  <select
                    id="export-format"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                    <option value="pdf">PDF Report</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      validateDates();
                    }}
                    className="mt-1" 
                  />
                </div>

                {/* End Date */}
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input 
                    id="end-date" 
                    type="date" 
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      validateDates();
                    }}
                    className="mt-1" 
                  />
                </div>

              </div>

              <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
                <Button 
                  className="bg-[#00C853] hover:bg-[#00a844] text-white"
                  onClick={handleExport}
                  disabled={isExporting || !!validationError}
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export Now'}
                </Button>
                <Button variant="outline">Preview Data</Button>
              </div>

              {/* Validation Error Display */}
              {validationError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">{validationError}</span>
                </div>
              )}

              {/* Export Status Indicator */}
              {exportStatus === "success" && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Data exported successfully!</span>
                </div>
              )}

              {exportStatus === "empty" && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm text-yellow-700 font-medium">No data available to export.</span>
                </div>
              )}

              {exportStatus === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-red-700 font-medium">Export failed. Please try again.</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickExport;
