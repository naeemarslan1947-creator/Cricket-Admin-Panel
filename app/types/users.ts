export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  club: string;
  subscription: string;
  status: 'Active' | 'Suspended' | 'Pending' | 'Inactive';
  lastActive: string;
  joined: string;
}