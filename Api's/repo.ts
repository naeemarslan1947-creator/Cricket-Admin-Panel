
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/";

export const LoginClientApiCall = API_BASE_URL + "api/user/login";

export const DashboardStats = API_BASE_URL + "api/admin-user/dashboard-stats";

export const GetAllUser = API_BASE_URL + "api/admin-user/get-all-users";
