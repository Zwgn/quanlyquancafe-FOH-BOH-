import axiosClient from "./axiosClient";
import { ApiResponse } from "../types/api";
import { EmployeePayload } from "../types/employee";

export const getEmployees = async () => {
  const response = await axiosClient.get<ApiResponse<unknown[]>>("/employees");
  return Array.isArray(response.data?.data) ? response.data.data : [];
};

export const createEmployee = async (payload: EmployeePayload) => {
  return axiosClient.post<ApiResponse<unknown>>("/employees", payload);
};

export const updateEmployee = async (
  id: string,
  payload: Pick<EmployeePayload, "name" | "phone">
) => {
  return axiosClient.put<ApiResponse<unknown>>(`/employees/${id}`, payload);
};

export const deleteEmployee = async (id: string) => {
  return axiosClient.delete<ApiResponse<unknown>>(`/employees/${id}`);
};
