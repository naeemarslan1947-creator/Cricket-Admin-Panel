export interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  club: string;
  subscription: string;
  status: 'Active' | 'Suspended' | 'Pending' | 'Inactive' | 'Deleted';
  lastActive: string;
  joined: string;
  [key: string]: unknown;
}