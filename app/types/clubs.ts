/**
 * Action Type Enums
 */
export enum ActionType {
  ADD = 1,
  EDIT = 2,
  DELETE = 3,
  DEACTIVATE = 4,
}

/**
 * Club User (from API response)
 */
export interface ClubUser {
  _id: string;
  user_name: string;
  email: string;
  password?: string;
  is_user_verified: boolean;
  full_name: string;
  is_club: boolean;
  is_club_verified: boolean;
  action_type: ActionType;
  role_id: string[];
  is_admin: boolean;
  is_teenager: boolean;
  updated_at: string;
  created_at: string;
  __v?: number;
  last_active?: string;
  code?: string | null;
  code_timeout?: string;
  address: string;
  bio: string;
  city: string;
  club_name: string;
  club_type: string;
  division: string;
  phone_number: string;
  postcode: string;
  fcm_token?: string;
  cover_pic?: string;
  profile_pic?: string;
  player?: {
    _id: string;
    user_id: string;
    action_type: ActionType;
    updated_at: string;
    created_at: string;
    __v?: number;
  };
  club_rating?: number | null;
  followers: number;
  followings: number;
}

/**
 * API Response for Get All Clubs
 */
export interface GetAllClubsResponse {
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

/**
 * Club for UI Display (mapped from ClubUser)
 */
export interface Club {
  _id: string;
  id?: string; // Alias for _id for compatibility
  name: string;
  location: string;
  status: 'Verified' | 'Pending' | 'Hidden';
  rating: number;
  members: number;
  teams?: number | ClubTeam[]; // Can be number or array depending on context
  verified: boolean;
  description: string;
  actionType: ActionType;
  userName: string;
  email: string;
  fullName: string;
  clubName: string;
  clubType: string;
  division: string;
  phoneNumber: string;
  bio: string;
  city: string;
  postcode: string;
  profilePic?: string;
  coverPic?: string;
  followers: number;
  followings: number;
  isUserVerified: boolean;
  isClubVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get action type label
 */
export function getActionTypeLabel(actionType: ActionType): string {
  switch (actionType) {
    case ActionType.ADD:
      return 'Added';
    case ActionType.EDIT:
      return 'Edited';
    case ActionType.DELETE:
      return 'Deleted';
    case ActionType.DEACTIVATE:
      return 'Deactivated';
    default:
      return 'Unknown';
  }
}

/**
 * Get status based on verification
 */
export function getClubStatus(clubUser: ClubUser): 'Verified' | 'Pending' | 'Hidden' {
  if (clubUser.action_type === ActionType.DEACTIVATE) {
    return 'Hidden';
  }
  if (clubUser.is_club_verified && clubUser.is_user_verified) {
    return 'Verified';
  }
  return 'Pending';
}

/**
 * Map ClubUser to Club for UI
 */
export function mapClubUserToClub(clubUser: ClubUser): Club {
  const status = getClubStatus(clubUser);
  
  return {
    _id: clubUser._id,
    id: clubUser._id,
    name: clubUser.club_name || clubUser.full_name,
    location: `${clubUser.city}, ${clubUser.division}`,
    status,
    rating: clubUser.club_rating || 0,
    members: clubUser.followers || 0,
    teams: 0, // Not in API response
    verified: clubUser.is_club_verified,
    description: clubUser.bio,
    actionType: clubUser.action_type,
    userName: clubUser.user_name,
    email: clubUser.email,
    fullName: clubUser.full_name,
    clubName: clubUser.club_name,
    clubType: clubUser.club_type,
    division: clubUser.division,
    phoneNumber: clubUser.phone_number,
    bio: clubUser.bio,
    city: clubUser.city,
    postcode: clubUser.postcode,
    profilePic: clubUser.profile_pic,
    coverPic: clubUser.cover_pic,
    followers: clubUser.followers,
    followings: clubUser.followings,
    isUserVerified: clubUser.is_user_verified,
    isClubVerified: clubUser.is_club_verified,
    isAdmin: clubUser.is_admin,
    createdAt: clubUser.created_at,
    updatedAt: clubUser.updated_at,
  };
}

/**
 * Related Data for Club Details
 */

export interface PlayerAward {
  _id?: string;
  title: string;
  year: string;
  description?: string;
}

export interface PlayerTitle {
  _id?: string;
  title: string;
  year: string;
}

export interface ClubPlayer {
  matches_won: number;
  mathes_played: number;
  finals_won: number;
  finals_played: number;
  titles_won: PlayerTitle[];
  player_awards: PlayerAward[];
  _id: string;
  user_id: string;
  action_type: ActionType;
  updated_at: string;
  created_at: string;
  __v?: number;
}

export interface ClubTeam {
  _id: string;
  name: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PlayerRating {
  _id: string;
  [key: string]: unknown;
}

export interface FollowingPriority {
  _id: string;
  [key: string]: unknown;
}

export interface ClubRelatedData {
  is_following: boolean | null;
  followers: Array<{
    _id: string;
    following_id: string;
    followed_by_id: string;
    created_at: string;
    __v?: number;
  }>;
  following: Array<{
    _id: string;
    following_id: string;
    followed_by_id: string;
    created_at: string;
    __v?: number;
  }>;
  posts: Array<{
    _id: string;
    media: string[];
    caption: string;
    location: string;
    user_id: string;
    is_private: boolean;
    action_type: ActionType;
    updated_at: string;
    created_at: string;
    __v?: number;
  }>;
  stories: Array<{
    _id: string;
    media: string[];
    caption?: string;
    user_id: string;
    is_private: boolean;
    action_type: ActionType;
    updated_at: string;
    created_at: string;
    __v?: number;
  }>;
  likes: Array<{
    _id: string;
    liked_media_id: string;
    user_id: string;
    media_type: 'post' | 'story' | 'comment';
    action_type: ActionType;
    updated_at: string;
    created_at: string;
    __v?: number;
  }>;
  player_ratings: PlayerRating[];
  user_following_priorities: FollowingPriority[];
  players: ClubPlayer[];
  teams: ClubTeam[];
}

/**
 * Get Club By ID API Response
 */
export interface GetClubByIdResponse {
  response_code: number;
  success: boolean;
  status_code: number;
  total_records: null;
  page_number: null;
  total_pages: null;
  message: string;
  error_message: null;
  token: null;
  result: {
    user: ClubUser;
    is_following: boolean;
    relatedData: ClubRelatedData;
  };
  misc_data: null;
}

/**
 * Extended Club with Related Data
 */
export interface ClubDetail {
  // Base club info
  _id: string;
  id?: string;
  name: string;
  location: string;
  status: 'Verified' | 'Pending' | 'Hidden';
  rating: number;
  verified: boolean;
  description: string;
  actionType: ActionType;
  userName: string;
  email: string;
  fullName: string;
  clubName: string;
  clubType: string;
  division: string;
  phoneNumber: string;
  bio: string;
  city: string;
  postcode: string;
  profilePic?: string;
  coverPic?: string;
  isUserVerified: boolean;
  isClubVerified: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Related data
  isFollowing: boolean;
  followers: ClubRelatedData['followers'];
  following: ClubRelatedData['following'];
  posts: ClubRelatedData['posts'];
  stories: ClubRelatedData['stories'];
  likes: ClubRelatedData['likes'];
  players: ClubRelatedData['players'];
  teams: ClubRelatedData['teams'];
  playerRatings: ClubRelatedData['player_ratings'];
  
  // Computed
  followersCount: number;
  followingCount: number;
  postsCount: number;
  teamsCount: number;
}

/**
 * Map GetClubByIdResponse to ClubDetail for UI
 */
export function mapGetClubByIdResponseToDetail(response: GetClubByIdResponse): ClubDetail {
  const user = response.result.user;
  const relatedData = response.result.relatedData;

  return {
    // Base club info
    _id: user._id,
    id: user._id,
    name: user.club_name || user.full_name,
    location: `${user.city}, ${user.division}`,
    status: getClubStatus(user),
    rating: user.club_rating || 0,
    verified: user.is_club_verified,
    description: user.bio,
    actionType: user.action_type,
    userName: user.user_name,
    email: user.email,
    fullName: user.full_name,
    clubName: user.club_name,
    clubType: user.club_type,
    division: user.division,
    phoneNumber: user.phone_number,
    bio: user.bio,
    city: user.city,
    postcode: user.postcode,
    profilePic: user.profile_pic,
    coverPic: user.cover_pic,
    isUserVerified: user.is_user_verified,
    isClubVerified: user.is_club_verified,
    isAdmin: user.is_admin,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    
    // Related data
    isFollowing: response.result.is_following || relatedData.is_following || false,
    followers: relatedData.followers || [],
    following: relatedData.following || [],
    posts: relatedData.posts || [],
    stories: relatedData.stories || [],
    likes: relatedData.likes || [],
    players: relatedData.players || [],
    teams: relatedData.teams || [],
    playerRatings: relatedData.player_ratings || [],
    
    // Computed counts
    followersCount: relatedData.followers?.length || 0,
    followingCount: relatedData.following?.length || 0,
    postsCount: relatedData.posts?.length || 0,
    teamsCount: relatedData.teams?.length || 0,
  };
}
