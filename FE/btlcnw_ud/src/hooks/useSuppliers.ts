import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
  SupplierPayload
} from "../api/suppliersApi";
import { useConfirm } from "../components/ui/ConfirmDialog";
import { getApiErrorMessage } from "../utils/apiError";

export interface SupplierRow {
  id: string;
  name: string;
  phone: string;
  address: string;
}

const PAGE_SIZE = 8;

const mapSupplier = (input: unknown, index: number): SupplierRow => {
  const row = (input ?? {}) as Record<string, unknown>;
  return {
    id: String(row.id ?? row.Id ?? index),
    name: String(row.name ?? row.Name ?? ""),
    phone: String(row.phone ?? row.Phone ?? ""),
    address: String(row.address ?? row.Address ?? "")
  };
};

const useSuppliers = () => {
  const confirm = useConfirm();

  const [suppliers, setSuppliers] = useState<SupplierRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierRow | null>(null);
  const [form, setForm] = useState<SupplierPayload>({ name: "", phone: "", address: "" });

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSuppliers();
      setSuppliers(response.map(mapSupplier));
    } catch (err) {
      setError(getApiErrorMessage(err, "Không tải được danh sách nhà cung cấp."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSuppliers();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return suppliers;
    return suppliers.filter((item) =>
      [item.name, item.phone, item.address].join(" ").toLowerCase().includes(keyword)
    );
  }, [suppliers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreateModal = () => {
    setEditingSupplier(null);
    setForm({ name: "", phone: "", address: "" });
    setOpenModal(true);
  };

  const openEditModal = (supplier: SupplierRow) => {
    setEditingSupplier(supplier);
    setForm({ name: supplier.name, phone: supplier.phone, address: supplier.address });
    setOpenModal(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError("Vui lòng nhập đầy đủ tên, số điện thoại và địa chỉ.");
      return;
    }
    try {
      const payload: SupplierPayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim()
      };
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, payload);
      } else {
        await createSupplier(payload);
      }
      setOpenModal(false);
      await loadSuppliers();
    } catch (err) {
      setError(getApiErrorMessage(err, "Không lưu được nhà cung cấp."));
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Xóa nhà cung cấp",
      message: "Bạn có chắc chắn muốn xóa nhà cung cấp này?",
      confirmText: "Xóa",
      tone: "danger"
    });
    if (!ok) return;
    try {
      await deleteSupplier(id);
      await loadSuppliers();
    } catch (err) {
      setError(getApiErrorMessage(err, "Xóa nhà cung cấp thất bại."));
    }
  };

  return {
    suppliers: pagedRows,
    search, setSearch: (v: string) => { setSearch(v); setPage(1); },
    page, setPage,
    currentPage, totalPages,
    error, loading,
    openModal, setOpenModal,
    editingSupplier,
    form, setForm,
    loadSuppliers,
    openCreateModal, openEditModal,
    handleSubmit, handleDelete
  };
};

export default useSuppliers;
