import {
  createTable,
  getTables,
  updateTable,
  updateTableStatus
} from "../api/tablesApi";
import { TablePayload } from "../types/table";

export const getTablesList = async () => getTables();

export const createNewTable = async (payload: TablePayload) => createTable(payload);

export const updateExistingTable = async (id: string, payload: TablePayload) =>
  updateTable(id, payload);

export const updateExistingTableStatus = async (id: string, status: string) =>
  updateTableStatus(id, status);
