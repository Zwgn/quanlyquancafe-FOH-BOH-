import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  UserPayload
} from "../api/usersApi";

export const getUsersList = async () => getUsers();

export const getUserDetail = async (id: string) => getUserById(id);

export const createNewUser = async (payload: UserPayload) => createUser(payload);

export const updateExistingUser = async (id: string, payload: UserPayload) =>
  updateUser(id, payload);

export const deleteExistingUser = async (id: string) => deleteUser(id);
