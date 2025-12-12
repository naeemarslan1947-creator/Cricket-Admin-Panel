"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Clock, Download } from 'lucide-react';

// Define the shape of each data type
interface DataType {
  id: string;
  name: string;
  description: string;
  recordCount: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  fields: string[];
}

// Props for the component
interface QuickExportProps {
  dataTypes: DataType[];
  selectedDataType: string | null;
  setSelectedDataType: (id: string | null) => void;
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
                      <Badge variant="outline" className="text-xs">
                        {type.recordCount.toLocaleString()} records
                      </Badge>
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
                    setSelectedDataType(null);
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
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="csv">CSV (Comma Separated)</option>
                    <option value="excel">Excel (.xlsx)</option>
                    <option value="json">JSON</option>
                    <option value="pdf">PDF Report</option>
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <select
                    id="date-range"
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
                  <Input id="start-date" type="date" className="mt-1" />
                </div>

                {/* End Date */}
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input id="end-date" type="date" className="mt-1" />
                </div>

                {/* Status Filter */}
                <div>
                  <Label htmlFor="status-filter">Status Filter</Label>
                  <select
                    id="status-filter"
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
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="none">No Filter</option>
                    <option value="verified">Verified Only</option>
                    <option value="premium">Premium Only</option>
                    <option value="free">Free Users Only</option>
                  </select>
                </div>
              </div>

              {/* Fields Selection */}
              <div>
                <Label className="mb-2 block">Select Fields to Export</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-white rounded-lg border border-[#e2e8f0]">
                  {dataTypes
                    .find((t) => t.id === selectedDataType)
                    ?.fields.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input type="checkbox" id={`field-${idx}`} defaultChecked className="rounded" />
                        <label htmlFor={`field-${idx}`} className="text-sm text-[#1e293b]">
                          {field}
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-2 p-3 bg-white rounded-lg border border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="email-export" className="rounded" />
                  <Label htmlFor="email-export">Email export file to me</Label>
                </div>
                <Input placeholder="admin@crickit.com" className="text-sm" disabled />
              </div>

              <div className="flex gap-2 pt-4 border-t border-[#e2e8f0]">
                <Button className="bg-[#00C853] hover:bg-[#00a844] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export Now
                </Button>
                <Button variant="outline" className="border-[#007BFF] text-[#007BFF]">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Export
                </Button>
                <Button variant="outline">Preview Data</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickExport;
