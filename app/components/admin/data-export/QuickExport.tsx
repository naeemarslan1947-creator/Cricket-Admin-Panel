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
} from "@/Api's/repo";
import makeRequest from "@/Api's/apiHelper";

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
  const [exportFormat, setExportFormat] = useState("csv");
  const [dateRange, setDateRange] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [additionalFilter, setAdditionalFilter] = useState("none");
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "empty" | "error">("idle");

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

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportStatus("idle");

      const response = await makeRequest({
        url: getEndpoint(selectedDataType),
        method: "GET",
        params: {
          format: exportFormat,
          dateRange,
          startDate,
          endDate,
          status: statusFilter,
          filter: additionalFilter,
        },
      });

      const data = response?.data;

      if (!Array.isArray(data)) {
        console.warn("Unexpected export data format");
        setExportStatus("error");
        return;
      }

      // Check if data is empty
      if (!data || data.length === 0) {
        setExportStatus("empty");
        return;
      }

      setExportStatus("success");
      const baseName = getFileBaseName();

      if (exportFormat === "json") {
        triggerDownload(
          new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
          }),
          `${baseName}.json`
        );
      } else if (exportFormat === "pdf") {
        triggerDownload(
          new Blob([convertToHTML(data)], { type: "text/html" }),
          `${baseName}.html`
        );
      } else {
        triggerDownload(
          new Blob([convertToCSV(data)], {
            type: "text/csv;charset=utf-8;",
          }),
          `${baseName}.csv`
        );
      }
    } catch (e) {
      console.error("Export failed", e);
      setExportStatus("error");
    } finally {
      setIsExporting(false);
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

                {/* Date Range */}
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <select
                    id="date-range"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="quarter">Last 90 Days</option>
                    <option value="year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input 
                    id="start-date" 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
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
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1" 
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <Label htmlFor="status-filter">Status Filter</Label>
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="pending">Pending Only</option>
                    <option value="suspended">Suspended Only</option>
                  </select>
                </div>

                {/* Additional Filters */}
                <div>
                  <Label htmlFor="additional-filter">Additional Filter</Label>
                  <select
                    id="additional-filter"
                    value={additionalFilter}
                    onChange={(e) => setAdditionalFilter(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="none">No Filter</option>
                    <option value="verified">Verified Only</option>
                    <option value="premium">Premium Only</option>
                    <option value="free">Free Users Only</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
                <Button 
                  className="bg-[#00C853] hover:bg-[#00a844] text-white"
                  onClick={handleExport}
                  disabled={isExporting}
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
