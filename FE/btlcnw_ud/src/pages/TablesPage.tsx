import React, { FormEvent } from "react";
import { FiCheckCircle, FiClock, FiGrid, FiUsers } from "react-icons/fi";
import AppButton from "../components/ui/AppButton";
import AppModal from "../components/ui/AppModal";
import { useTablesManagement } from "../hooks/useTablesManagement";
import { usePageTitle } from "../hooks/usePageTitle";
import "../assets/styles/tables.css";

const TablesPage = () => {
	usePageTitle("Bàn | DungCafe Quản trị");
	const {
		rows,
		tableStats,
		search,
		setSearch,
		statusFilter,
		setStatusFilter,
		setPage,
		currentPage,
		totalPages,
		openModal,
		setOpenModal,
		editingRow,
		form,
		setForm,
		loading,
		error,
		loadTables,
		openCreateModal,
		openEditModal,
		handleSaveTable,
		handleStatusChange,
		statusOptions
	} = useTablesManagement();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await handleSaveTable();
	};

	return (
		<div className="module-page tables-page">
			<div className="module-header">
				<div>
					<h2 className="module-title">Quản lý bàn</h2>
					<p className="module-breadcrumb">Bảng điều khiển / Bàn</p>
				</div>
			</div>

			{error ? <p className="alert-error">{error}</p> : null}

			<section className="tables-stats-grid">
				<article className="tables-stat-card">
					<span className="tables-stat-icon tables-stat-icon-available">
						{React.createElement(FiCheckCircle as any, { size: 24 })}
					</span>
					<div>
						<p className="tables-stat-title">Bàn trống</p>
						<p className="tables-stat-value">{tableStats.available}</p>
						<p className="tables-stat-note">Sẵn sàng</p>
					</div>
				</article>

				<article className="tables-stat-card">
					<span className="tables-stat-icon tables-stat-icon-occupied">
						{React.createElement(FiUsers as any, { size: 24 })}
					</span>
					<div>
						<p className="tables-stat-title">Đang phục vụ</p>
						<p className="tables-stat-value">{tableStats.occupied}</p>
						<p className="tables-stat-note">Có khách</p>
					</div>
				</article>

				<article className="tables-stat-card">
					<span className="tables-stat-icon tables-stat-icon-reserved">
						{React.createElement(FiClock as any, { size: 24 })}
					</span>
					<div>
						<p className="tables-stat-title">Đã đặt</p>
						<p className="tables-stat-value">{tableStats.reserved}</p>
						<p className="tables-stat-note">Chờ phục vụ</p>
					</div>
				</article>

				<article className="tables-stat-card">
					<span className="tables-stat-icon tables-stat-icon-total">
						{React.createElement(FiGrid as any, { size: 24 })}
					</span>
					<div>
						<p className="tables-stat-title">Tổng số bàn</p>
						<p className="tables-stat-value">{tableStats.total}</p>
						<p className="tables-stat-note">Trong hệ thống</p>
					</div>
				</article>
			</section>

			<section className="module-card tables-card-shell">
				<div className="tables-toolbar">
					<input
						className="module-search"
						placeholder="Tìm kiếm bàn theo tên, trạng thái hoặc sức chứa..."
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(1);
						}}
					/>

					<select
						className="tables-filter"
						value={statusFilter}
						onChange={(event) => {
							setStatusFilter(event.target.value);
							setPage(1);
						}}
					>
						<option value="all">Tất cả trạng thái</option>
						{statusOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

					<AppButton variant="ghost" onClick={() => void loadTables()} disabled={loading}>
						{loading ? "Đang tải..." : "Làm mới"}
					</AppButton>

					<AppButton onClick={openCreateModal}>+ Thêm bàn</AppButton>
				</div>

				<div className="tables-table-wrap">
					<table className="tables-table">
						<thead>
							<tr>
								<th>Bàn</th>
								<th>Sức chứa</th>
								<th>Trạng thái</th>
								<th>Hành động</th>
							</tr>
						</thead>

						<tbody>
							{rows.length === 0 ? (
								<tr>
									<td className="tables-empty" colSpan={4}>
										{loading ? "Đang tải dữ liệu..." : "Không tìm thấy bàn phù hợp."}
									</td>
								</tr>
							) : (
								rows.map((row) => (
									<tr key={row.id}>
										<td className="tables-name">{row.name}</td>
										<td>{row.capacity}</td>
										<td>
											<select
												value={row.status}
												onChange={(event) => void handleStatusChange(row.id, event.target.value)}
											>
												{statusOptions.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
										</td>
										<td>
											<AppButton variant="secondary" onClick={() => openEditModal(row)}>
												Sửa
											</AppButton>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				<div className="module-pagination">
					<span>
						Trang {currentPage}/{totalPages}
					</span>
					<div className="module-pagination-actions">
						<AppButton
							variant="secondary"
							onClick={() => setPage((previous) => Math.max(1, previous - 1))}
							disabled={currentPage === 1}
						>
							Trước
						</AppButton>
						<AppButton
							variant="secondary"
							onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
							disabled={currentPage === totalPages}
						>
							Sau
						</AppButton>
					</div>
				</div>
			</section>

			<AppModal
				open={openModal}
				title={editingRow ? "Sửa bàn" : "Thêm bàn mới"}
				onClose={() => setOpenModal(false)}
			>
				<form className="form-grid" onSubmit={handleSubmit}>
					<label className="form-field">
						<span>Tên bàn</span>
						<input
							value={form.name}
							onChange={(event) =>
								setForm((previous) => ({ ...previous, name: event.target.value }))
							}
							required
						/>
					</label>

					<label className="form-field">
						<span>Sức chứa</span>
						<input
							type="number"
							min={1}
							value={form.capacity}
							onChange={(event) =>
								setForm((previous) => ({ ...previous, capacity: Number(event.target.value) }))
							}
							required
						/>
					</label>

					<div className="module-row-actions form-field-span">
						<AppButton type="submit">Lưu</AppButton>
						<AppButton type="button" variant="ghost" onClick={() => setOpenModal(false)}>
							Hủy
						</AppButton>
					</div>
				</form>
			</AppModal>
		</div>
	);
};

export default TablesPage;
