export interface TrendData {
  count: number;
  trend: number;
}

export interface HeaderData {
  total_players: TrendData;
  total_players_by_last_30days: TrendData;
  total_clubs_verified: TrendData;
  total_clubs_not_verified: TrendData;
  total_reports: number;
}

export interface UsersByLastActive {
  day: string;
  count: number;
}

export interface UsersByClubVerifiedAt {
  month: string;
  count: number;
}

export interface GraphsData {
  users_by_last_active: UsersByLastActive[];
  users_by_club_verified_at: UsersByClubVerifiedAt[];
  total_clubs_verified: number;
  total_clubs_not_verified: number;
}

export interface DashboardAPIResponse {
  graphs_data: GraphsData;
  header_data: HeaderData;
}

export interface DashboardData {
  header_data: HeaderData;
  graphs_data: GraphsData;
}
