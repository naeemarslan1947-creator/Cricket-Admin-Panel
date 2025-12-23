"use client";

import { useEffect, useState } from 'react';
import UsersManagementHeader from '../../components/admin/users-management/UsersManagementHeader';
import UsersManagementFilters from '../../components/admin/users-management/UsersManagementFilters';
import UsersManagementTable from '../../components/admin/users-management/UsersManagementTable';
import Loader from '../../components/common/Loader';
import { User } from '@/app/types/users';
import makeRequest from "@/Api's/apiHelper";
import { GetAllUser } from "@/Api's/repo";

const usersData : User[] = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      role: 'Player',
      subscription: 'Premium',
      status: 'Active',
      club: 'Mumbai Cricket Club',
      joined: 'Jan 2024',
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      role: 'Coach',
      subscription: 'Free',
      status: 'Active',
      club: 'Delhi Sports Academy',
      joined: 'Feb 2024',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      role: 'Player',
      subscription: 'Premium',
      status: 'Suspended',
      club: 'Bangalore Youth Cricket',
      joined: 'Mar 2024',
      lastActive: '5 days ago'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      role: 'Admin',
      subscription: 'Premium',
      status: 'Active',
      club: 'Chennai Cricket Academy',
      joined: 'Dec 2023',
      lastActive: '30 mins ago'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      role: 'Player',
      subscription: 'Free',
      status: 'Inactive',
      club: 'Kolkata Cricket Club',
      joined: 'Apr 2024',
      lastActive: '2 weeks ago'
    },
  ];
export default function UsersManagement() {

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>(usersData);


  console.log("API_BASE_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

  const fetchSyncingLogs = async () => {
    console.log("fetchSyncingLogs called");
    setIsLoading(true);
    try {
      const response = await makeRequest({
        url: `${GetAllUser}?page_number=${1}&limit=${10}`,
        method: "GET",
      });


      if (response?.success) {
        setUsers(response?.result as User[] || []);

      } else {
      }
    } catch (error) {
      console.error("Error fetching syncing logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect running");
    fetchSyncingLogs();
  }, []);

  return (
    <div className="space-y-6">
      <UsersManagementHeader />
      <UsersManagementFilters roleFilter={roleFilter} setRoleFilter={setRoleFilter} />
      {isLoading ? <Loader /> : <UsersManagementTable users={usersData} />}
    </div>
  );
}