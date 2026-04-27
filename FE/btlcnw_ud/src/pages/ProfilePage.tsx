import React from "react";
import {
  MdAccountCircle,
  MdBadge,
  MdLock,
  MdMail,
  MdPerson,
  MdSecurity,
  MdVisibility,
  MdVisibilityOff
} from "react-icons/md";
import AppButton from "../components/ui/AppButton";
import { usePageTitle } from "../hooks/usePageTitle";
import useProfile from "../hooks/useProfile";

const ProfilePage = () => {
  usePageTitle("Hồ sơ cá nhân | Coffee Management System");

  const {
    currentUser,
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    showOldPassword, setShowOldPassword,
    showNewPassword, setShowNewPassword,
    showConfirmPassword, setShowConfirmPassword,
    error, success, submitting,
    handleChangePassword
  } = useProfile();

  if (!currentUser) {
    return (
      <div className="module-page">
        <p className="alert-error">Bạn chưa đăng nhập.</p>
      </div>
    );
  }

  const InfoRow = ({
    icon,
    label,
    value
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        background: "#f8f9fa",
        borderRadius: 8
      }}
    >
      <span style={{ color: "#6f4e37", display: "flex" }}>
        {React.createElement(icon, { size: 22 })}
      </span>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 12, color: "#6c757d", textTransform: "uppercase" }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="module-page">
      <div className="module-header">
        <div>
          <h2 className="module-title">Hồ sơ cá nhân</h2>
          <p className="module-breadcrumb">Bảng điều khiển / Hồ sơ</p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16
        }}
      >
        <section className="module-card">
          <div style={{ textAlign: "center", paddingBottom: 16, borderBottom: "1px solid #eef0f3" }}>
            <div
              style={{
                width: 96,
                height: 96,
                margin: "0 auto 12px",
                borderRadius: "50%",
                background: "#fdf6f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6f4e37"
              }}
            >
              {React.createElement(MdAccountCircle as any, { size: 80 })}
            </div>
            <h3 style={{ margin: 0 }}>{currentUser.displayName}</h3>
            <p style={{ margin: "4px 0 0", color: "#6c757d", fontSize: 14 }}>
              {currentUser.role}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            <InfoRow icon={MdPerson as any} label="Họ và tên" value={currentUser.displayName} />
            <InfoRow icon={MdMail as any} label="Tên đăng nhập" value={currentUser.username} />
            <InfoRow icon={MdSecurity as any} label="Vai trò" value={currentUser.role} />
            <InfoRow
              icon={MdBadge as any}
              label="Mã nhân viên"
              value={currentUser.employeeId ?? "Chưa liên kết"}
            />
          </div>
        </section>

        <section className="module-card">
          <h3 className="panel-title" style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
            {React.createElement(MdLock as any, { size: 22 })}
            Đổi mật khẩu
          </h3>

          {error ? <p className="alert-error">{error}</p> : null}
          {success ? (
            <p
              style={{
                color: "#16a34a",
                background: "#dcfce7",
                padding: "10px 12px",
                borderRadius: 8,
                margin: "0 0 12px"
              }}
            >
              {success}
            </p>
          ) : null}

          <form className="form-grid" onSubmit={handleChangePassword}>
            <label className="form-field form-field-span">
              <span>Mật khẩu hiện tại</span>
              <div className="password-input-wrap">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(event) => setOldPassword(event.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowOldPassword((p) => !p)}
                  aria-label={showOldPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  {React.createElement((showOldPassword ? MdVisibilityOff : MdVisibility) as any, { size: 20 })}
                </button>
              </div>
            </label>
            <label className="form-field form-field-span">
              <span>Mật khẩu mới</span>
              <div className="password-input-wrap">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Tối thiểu 4 ký tự"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNewPassword((p) => !p)}
                  aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  {React.createElement((showNewPassword ? MdVisibilityOff : MdVisibility) as any, { size: 20 })}
                </button>
              </div>
            </label>
            <label className="form-field form-field-span">
              <span>Xác nhận mật khẩu mới</span>
              <div className="password-input-wrap">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  minLength={4}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  tabIndex={-1}
                >
                  {React.createElement((showConfirmPassword ? MdVisibilityOff : MdVisibility) as any, { size: 20 })}
                </button>
              </div>
            </label>
            <div className="module-row-actions form-field-span">
              <AppButton type="submit" disabled={submitting}>
                {submitting ? "Đang lưu..." : "Đổi mật khẩu"}
              </AppButton>
            </div>
          </form>

          <p style={{ marginTop: 16, fontSize: 13, color: "#6c757d" }}>
            <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, hãy đăng nhập lại nếu cần.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
