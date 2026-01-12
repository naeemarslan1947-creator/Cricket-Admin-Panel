
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/";

export const LoginClientApiCall = API_BASE_URL + "api/user/admin-login";

export const AdminUserCreation = API_BASE_URL + "api/user/signup";

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

export const GetReviewMetrics = API_BASE_URL + "api/review/dashboard";

export const UpdateReviewStatus = API_BASE_URL + "api/review/update";

export const GetViewHtmlFile = API_BASE_URL + "api/admin-user/view-html";

export const UpdateViewHtmlFile = API_BASE_URL + "api/admin-user/update-html";

export const GetReportedMedia = API_BASE_URL + "api/reports/getAll";

export const GetReportHeader = API_BASE_URL + "api/admin-user/content-reports-header";

export const SuspendReport = API_BASE_URL + "api/admin-user/report-suspend";

export const SuspendMedia = API_BASE_URL + "api/admin-user/report-action";

export const DeleteReport = API_BASE_URL + "api/admin-user/report-delete";

export const EscalateReport = API_BASE_URL + "api/admin-user/report-escalate";

export const ReportHeader = API_BASE_URL + "api/admin-user/reports-header";

export const UpdateAdminProfile = API_BASE_URL + "api/admin-user/update-admin-user"

export const UserGetById = API_BASE_URL + "api/admin-user/get-info-by-id"

export const ExportUserList = API_BASE_URL + "api/admin-user/export-data-users";

export const ExportClubList = API_BASE_URL + "api/admin-user/export-data-clubs";

export const ExportDataReviews = API_BASE_URL + "api/admin-user/export-data-reviews";

export const ExportDataReports = API_BASE_URL + "api/admin-user/export-data-reports";

export const ExportDataAdminLogs = API_BASE_URL + "api/admin-user/export-data-admin-logs";

export const UpdatePassword = API_BASE_URL + "api/admin-user/update-password";

export const CreateDataExportEntry = API_BASE_URL + "api/admin-user/export-logs";

export const GetRolePermission = API_BASE_URL + "api/role/get-permission-list";

export const UpdateRolePermission = API_BASE_URL + "api/role/create-or-update-permission";

export const GetAllRoles = API_BASE_URL + "api/role/get-roles-list";

export const GetExportHistory = API_BASE_URL + "api/admin-user/export-logs";

export const ExportDataHeader = API_BASE_URL + "api/admin-user/export-logs-header";

export const TargetedAudience = API_BASE_URL + "api/admin-user/user-types-subscription-types";

export const PostCommunicationNotification = API_BASE_URL + "api/admin-user/send-notification";

export const GetActivityLogById = API_BASE_URL + "api/admin-user/admin-logs-by-user-id";

export const GetAllAdminLogs = API_BASE_URL + "api/admin-user/admin-logs";

export const GetCommunicationHeader = API_BASE_URL + "api/admin-user/communication-header";

export const GetNotification = API_BASE_URL + "api/admin-user/notification-requests";

export const GetAnalyticsDashboard = API_BASE_URL + "api/admin-user/user-analytics";



















