import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee
} from "../api/employeesApi";
import { EmployeePayload } from "../types/employee";

export const getEmployeesList = async () => getEmployees();

export const createNewEmployee = async (payload: EmployeePayload) =>
  createEmployee(payload);

export const updateExistingEmployee = async (
  id: string,
  payload: Pick<EmployeePayload, "name" | "phone">
) => updateEmployee(id, payload);

export const deleteExistingEmployee = async (id: string) => deleteEmployee(id);
