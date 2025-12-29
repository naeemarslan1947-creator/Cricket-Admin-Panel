"use client";
import { useState, useEffect } from 'react';
import ClubsManagementHeader from '../../components/admin/club-management/ClubsManagementHeader';
import ClubsManagementFilters from '../../components/admin/club-management/ClubsManagementFilters';
import ClubsManagementGrid from '@/app/components/admin/club-management/ClubsManagementGrid.tsx';
import Pagination from '@/app/components/common/Pagination';
import makeRequest from '@/Api\'s/apiHelper';
import { GetAllClubs } from '@/Api\'s/repo';
import type { Club, ClubUser } from '@/app/types/clubs';
import { mapClubUserToClub } from '@/app/types/clubs';

interface GetAllClubsApiResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  total_records: number;
  page_number: number;
  total_pages: number;
  message: string;
  error_message: string | null;
  token: string | null;
  result: ClubUser[];
}

const DEFAULT_CLUBS: Club[] = [];

export default function ClubsManagement() {
  const [clubs, setClubs] = useState<Club[]>(DEFAULT_CLUBS);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>(DEFAULT_CLUBS);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;
  const debounceDelay = 800; // 800ms delay before API call 

  const fetchClubs = async (page: number = 1, search: string = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, unknown> = {
        page: page.toString(),
        limit: '10',
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await makeRequest<GetAllClubsApiResponse>({
        url: GetAllClubs,
        method: 'GET',
        params,
      });

      if (response.data?.success && response.data?.result && Array.isArray(response.data.result)) {
        // Map ClubUser to Club for UI
        const mappedClubs = response.data.result.map(mapClubUserToClub);
        setClubs(mappedClubs);
        setTotalPages(response.data.total_pages || 1);
        setCurrentPage(response.data.page_number || page);
      } else {
        setClubs(DEFAULT_CLUBS);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching clubs:', err);
      setClubs(DEFAULT_CLUBS);
      setTotalPages(1);
      setError('Failed to fetch clubs. Showing default data.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (clubList: Club[], status: string, search: string) => {
    let filtered = clubList;

    if (status !== 'all') {
      filtered = filtered.filter(
        (club) => club.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (club) =>
          club.name?.toLowerCase().includes(query) ||
          club.location?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); 
    }, debounceDelay);

    return () => clearTimeout(timer); 
  }, [searchQuery, debounceDelay]);

  useEffect(() => {
    fetchClubs(currentPage, debouncedSearchQuery);
  }, [currentPage, debouncedSearchQuery]);

  useEffect(() => {
    const filtered = applyFilters(clubs, statusFilter, searchQuery);
    setFilteredClubs(filtered);
  }, [clubs, statusFilter, searchQuery]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset pagination
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <ClubsManagementHeader />
      <ClubsManagementFilters
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLoading={isLoading}
      />
      {error && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}
      <ClubsManagementGrid clubs={filteredClubs} isLoading={isLoading} />
      {filteredClubs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={clubs.length}
          limit={limit}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}