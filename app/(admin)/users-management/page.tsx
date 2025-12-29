"use client";

import { useEffect, useState } from 'react';
import UsersManagementHeader from '../../components/admin/users-management/UsersManagementHeader';
import UsersManagementFilters from '../../components/admin/users-management/UsersManagementFilters';
import UsersManagementTable from '../../components/admin/users-management/UsersManagementTable';
import Loader from '../../components/common/Loader';
import { User } from '@/app/types/users';
import makeRequest from "@/Api's/apiHelper";
import { GetAllUser } from "@/Api's/repo";

export default function UsersManagement() {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
  const limit = 10;

  console.log("🔍 UsersManagement component rendered");
  console.log("API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  // Map action_type enum to status
  const getStatus = (actionType?: number): 'Active' | 'Suspended' | 'Deleted' | 'Inactive' => {
    switch (actionType) {
      case 1:
      case 2:
        return 'Active';
      case 3:
        return 'Deleted';
      case 4:
        return 'Suspended';
      default:
        return 'Inactive';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      console.log("🚀 Fetching users with search:", debouncedSearchQuery, "role:", roleFilter, "page:", currentPage);
      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(limit),
        });
        
        if (debouncedSearchQuery.trim()) {
          params.append('search', debouncedSearchQuery.trim());
        }
        
        if (roleFilter !== 'all') {
          params.append('role', roleFilter);
        }

        const apiUrl = `${GetAllUser}?${params.toString()}`;
        console.log("📢 Making API call to:", apiUrl);
        
        const response = await makeRequest({
          url: apiUrl,
          method: "GET",
        });

        const apiResponse = (response as { data?: unknown; status?: number }).data as {
          result?: unknown[];
          data?: unknown;
          success?: boolean;
          total_records?: number;
          page_number?: number;
          total_pages?: number;
        };

  
        let usersData: Record<string, unknown>[] = [];
        
        if (Array.isArray(apiResponse?.result)) {
          usersData = apiResponse.result as Record<string, unknown>[];
          console.log("✅ Found users in apiResponse.result:", usersData.length);
        } else if (apiResponse?.success === true) {
          console.log("📢 Success is true, checking data...");
          const dataObj = apiResponse.data as { result?: unknown[] };
          console.log("📢 dataObj:", dataObj);
          console.log("📢 dataObj.result:", Array.isArray(dataObj?.result));
          
          if (Array.isArray(dataObj?.result)) {
            usersData = dataObj.result as Record<string, unknown>[];
            console.log("✅ Found users in apiResponse.data.result:", usersData.length);
          } else if (Array.isArray(apiResponse.data)) {
            usersData = apiResponse.data as Record<string, unknown>[];
            console.log("✅ Found users in apiResponse.data:", usersData.length);
          } else {
            console.log("📢 Data is not an array, type:", typeof apiResponse.data);
          }
        } else if (Array.isArray(apiResponse?.data)) {
          usersData = apiResponse.data as Record<string, unknown>[];
          console.log("✅ Found users in apiResponse.data:", usersData.length);
        } else {
          console.warn("⚠️ Unexpected response structure:", apiResponse);
          console.warn("📢 Full apiResponse object:", JSON.stringify(apiResponse, null, 2));
          usersData = [];
        }

        // Map users data
        const mappedUsers: User[] = usersData.map((user: Record<string, unknown>) => {
          // Safely access nested player property
          const playerRole = user.player && typeof user.player === 'object' 
            ? (user.player as Record<string, unknown>).player_role 
            : null;
          
          return {
            id: String(user._id || ''),
            name: String(user.full_name || user.name || ''),
            email: String(user.email || ''),
            role: String(playerRole || user.role || 'Player'),
            club: String(user.club || (user.is_club ? user.user_name : '')),
            subscription: String(user.subscription || 'Free'),
            status: getStatus(user.action_type as number),
            lastActive: user.last_active
              ? new Date(user.last_active as string).toLocaleDateString()
              : '-',
            joined: user.created_at
              ? new Date(user.created_at as string).toLocaleDateString()
              : '-',
          };
        });

        console.log("✅ Final mappedUsers:", mappedUsers.length, "users");
        setUsers(mappedUsers);
        
        // Extract pagination data from API response
        const totalRecordsFromAPI = apiResponse?.total_records || 0;
        const pageNumberFromAPI = apiResponse?.page_number || currentPage;
        const totalPagesFromAPI = apiResponse?.total_pages || 1;
        
        console.log("📊 Pagination data - Total Records:", totalRecordsFromAPI, "Total Pages:", totalPagesFromAPI, "Current Page:", pageNumberFromAPI);
        
        setTotalRecords(totalRecordsFromAPI);
        setTotalPages(totalPagesFromAPI);
        
      } catch (error) {
        console.error("❌ Error fetching users:", error);
        setUsers([]);
        setTotalRecords(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedSearchQuery, roleFilter, currentPage, refetchTrigger]);

  console.log("🔍 Current users state:", users.length, "users");

  const handlePageChange = (page: number) => {
    console.log("📄 Changing page to:", page);
    setCurrentPage(page);
  };

  const handleUserUpdated = () => {
    console.log("👥 User updated, refetching users list");
    // Trigger refetch by incrementing the refetchTrigger
    setRefetchTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <UsersManagementHeader />
      <UsersManagementFilters 
        roleFilter={roleFilter} 
        setRoleFilter={setRoleFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {isLoading ? <Loader /> : (
        <UsersManagementTable 
          users={users}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          limit={limit}
          onPageChange={handlePageChange}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}
