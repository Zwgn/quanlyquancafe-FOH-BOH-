import { createRole, getRoles } from "../api/rolesApi";

interface RolePayload {
  name: string;
}

export const getRolesList = async () => getRoles();

export const createNewRole = async (payload: RolePayload) => createRole(payload);
