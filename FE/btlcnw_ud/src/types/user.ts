export interface UserPayload {
  username: string;
  password?: string;
  roleId: string;
}

export interface UserRecord {
  id: string;
  username: string;
  roleId: string;
  role?: string;
}
