"use client";
import { useState } from 'react';
import ClubsManagementHeader from '../../components/admin/club-management/ClubsManagementHeader';
import ClubsManagementFilters from '../../components/admin/club-management/ClubsManagementFilters';
import ClubsManagementGrid from '@/app/components/admin/club-management/ClubsManagementGrid.tsx';

interface Club {
  id: number;
  name: string;
  location: string;
  status: 'Verified' | 'Pending' | 'Hidden';
  rating: number;
  members: number;
  teams: number;
  verified: boolean;
  description: string;
}

export default function ClubsManagement() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const clubs: Club[] = [
    {
      id: 1,
      name: 'Mumbai Cricket Club',
      location: 'Mumbai, Maharashtra',
      status: 'Verified',
      rating: 4.8,
      members: 245,
      teams: 8,
      verified: true,
      description: 'Premier cricket club in Mumbai'
    },
    {
      id: 2,
      name: 'Delhi Sports Academy',
      location: 'New Delhi, Delhi',
      status: 'Verified',
      rating: 4.6,
      members: 189,
      teams: 6,
      verified: true,
      description: 'Professional sports training academy'
    },
    {
      id: 3,
      name: 'Bangalore Youth Cricket',
      location: 'Bangalore, Karnataka',
      status: 'Pending',
      rating: 4.2,
      members: 87,
      teams: 3,
      verified: false,
      description: 'Youth development cricket club'
    },
    {
      id: 4,
      name: 'Chennai Cricket Academy',
      location: 'Chennai, Tamil Nadu',
      status: 'Verified',
      rating: 4.9,
      members: 312,
      teams: 12,
      verified: true,
      description: 'Elite cricket training center'
    },
    {
      id: 5,
      name: 'Kolkata Cricket Club',
      location: 'Kolkata, West Bengal',
      status: 'Hidden',
      rating: 3.5,
      members: 45,
      teams: 2,
      verified: false,
      description: 'Local community cricket club'
    },
  ];

  return (
    <div className="space-y-6">
      <ClubsManagementHeader />
      <ClubsManagementFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <ClubsManagementGrid clubs={clubs} />
    </div>
  );
}