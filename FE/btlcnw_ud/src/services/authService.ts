import axiosClient from "../api/axiosClient";
import { AuthUser, LoginPayload } from "../types/auth";

interface LoginApiResponse {
  success: boolean;
  data: AuthUser | { user: AuthUser; token?: string };
}

export interface LoginResult {
  user: AuthUser;
  token?: string;
}

export const login = async (data: LoginPayload): Promise<LoginResult> => {
  const response = await axiosClient.post<LoginApiResponse>("/auth/login", data);

  if (!response.data?.success || !response.data?.data) {
    throw new Error("Login failed");
  }

  const payload = response.data.data;
  const user = "user" in payload ? payload.user : payload;
  const token = "user" in payload ? payload.token : undefined;

  if (!user?.id) {
    throw new Error("Login failed");
  }

  return {
    user,
    token
  };
};
