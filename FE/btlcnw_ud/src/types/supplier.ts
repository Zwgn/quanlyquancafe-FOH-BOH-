export interface SupplierPayload {
  name: string;
  phone: string;
  address: string;
}

export interface SupplierRow extends SupplierPayload {
  id: string;
}
