export interface EmployeePayload {
  userId?: string;
  name: string;
  phone: string;
  gender?: string;
  birthDate?: string;
  role?: string;
  salary?: number | null;
  address?: string;
}
