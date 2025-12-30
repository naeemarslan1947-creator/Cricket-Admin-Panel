
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/";

export const LoginClientApiCall = API_BASE_URL + "api/user/login";

export const DashboardStats = API_BASE_URL + "api/admin-user/dashboard-stats";

export const GetAllUser = API_BASE_URL + "api/admin-user/get-all-users";

export const GetUserById = API_BASE_URL + "api/admin-user/user-details";

export const GetClubById = API_BASE_URL + "api/admin-user/user-details";

export const GetAllClubs = API_BASE_URL + "api/admin-user/get-all-clubs";

export const UpdateUserApiCall = API_BASE_URL + "api/user/update-user";

export const SendResetPasswordEmail = API_BASE_URL + "api/admin-user/reset-password";

export const DeleteUserAccount = API_BASE_URL + "api/admin-user/soft-delete-account";

export const SuspendUserAccount = API_BASE_URL + "api/admin-user/suspend-account";

export const SendUserMessages = API_BASE_URL + "api/admin-user/send-notification";

export const updateClubProfile = API_BASE_URL + "api/admin-user/update-user";

export const GetInvitationLink = API_BASE_URL + "api/user/get-share-link";

export const SendInvitationLink = API_BASE_URL + "api/user/send-invite-email";

export const PostClubMilestone = API_BASE_URL + "api/club-milestones/create";







