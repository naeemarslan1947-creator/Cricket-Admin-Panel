export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  club: string;
  isClub: boolean;
  subscription: string;
  status: 'Active' | 'Suspended' | 'Pending' | 'Inactive' | 'Deleted';
  lastActive: string;
  joined: string;
  [key: string]: unknown;
}
