import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  SupplierPayload,
  updateSupplier
} from "../api/suppliersApi";

export const getSuppliersList = async () => getSuppliers();

export const createNewSupplier = async (payload: SupplierPayload) => createSupplier(payload);

export const updateExistingSupplier = async (id: string, payload: SupplierPayload) =>
  updateSupplier(id, payload);

export const deleteExistingSupplier = async (id: string) => deleteSupplier(id);
