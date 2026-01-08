"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  limit,
  onPageChange,
}: PaginationProps) {
  // Calculate start and end record numbers
  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, totalRecords);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end for middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if close to start
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if close to end
      if (currentPage > totalPages - 3) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-between mt-6 px-6 py-4 border-t border-[#e2e8f0]">
      {/* Left section - Records info */}
      <div className="text-sm text-[#64748b]">
        Showing <span className="font-medium text-[#1e293b]">{startRecord}</span> to{' '}
        <span className="font-medium text-[#1e293b]">{endRecord}</span> of{' '}
        <span className="font-medium text-[#1e293b]">{totalRecords}</span> records
      </div>

      {/* Middle section - Page numbers */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 border-[#e2e8f0] hover:bg-[#f1f5f9] hover:text-[#00C853] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-2 text-[#64748b]">...</span>
            ) : (
              <Button
                variant={currentPage === page ? 'default' : 'outline'}
                size="icon"
                onClick={() => handlePageChange(page as number)}
                className={`h-9 w-9 text-sm font-medium transition-all ${
                  currentPage === page
                    ? 'bg-[#91C137] text-white hover:bg-[#91C137] border-[#00C853]'
                    : 'border-[#e2e8f0] text-[#1e293b] hover:bg-[#f1f5f9] hover:text-[#00C853]'
                }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 border-[#e2e8f0] hover:bg-[#f1f5f9] hover:text-[#00C853] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Right section - Page info */}
      <div className="text-sm text-[#64748b]">
        Page <span className="font-medium text-[#1e293b]">{currentPage}</span> of{' '}
        <span className="font-medium text-[#1e293b]">{totalPages}</span>
      </div>
    </div>
  );
}
