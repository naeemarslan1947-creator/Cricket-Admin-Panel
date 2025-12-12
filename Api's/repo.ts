const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/";

export const LoginClientApiCall = API_BASE_URL + "api/user/login";
export const CodeVerificationClientApiCall =
  API_BASE_URL + "api/user/otp/verify";
export const CodeUpdateVerificationClientApiCall =
  API_BASE_URL + "api/user/otp/update";
