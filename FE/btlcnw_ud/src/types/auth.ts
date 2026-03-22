export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  role: string;
  displayName?: string;
  name?: string;
  fullName?: string;
}
