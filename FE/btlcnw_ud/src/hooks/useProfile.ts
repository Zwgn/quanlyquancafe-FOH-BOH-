import { FormEvent, useEffect, useState } from "react";
import { getUserById, updateUser } from "../api/usersApi";
import { getApiErrorMessage } from "../utils/apiError";

export interface CurrentUser {
  id: string;
  username: string;
  role: string;
  displayName: string;
  employeeId: string | null;
}

export const getCurrentUser = (): CurrentUser | null => {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      id: String(parsed.id ?? ""),
      username: String(parsed.username ?? ""),
      role: String(parsed.role ?? ""),
      displayName: String(parsed.displayName ?? parsed.name ?? parsed.username ?? ""),
      employeeId: parsed.employeeId ? String(parsed.employeeId) : null
    };
  } catch {
    return null;
  }
};

const useProfile = () => {
  const [currentUser] = useState<CurrentUser | null>(getCurrentUser());
  const [roleId, setRoleId] = useState<string>("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRoleId = async () => {
      if (!currentUser?.id) return;
      try {
        const userInfo = await getUserById(currentUser.id);
        if (userInfo) {
          const row = userInfo as Record<string, unknown>;
          setRoleId(String(row.roleId ?? row.RoleId ?? ""));
        }
      } catch {
        /* không hiển thị lỗi tải roleId */
      }
    };
    void fetchRoleId();
  }, [currentUser?.id]);

  const handleChangePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentUser?.id) {
      setError("Không tìm thấy thông tin người dùng.");
      return;
    }
    if (!oldPassword.trim() || !newPassword.trim()) {
      setError("Vui lòng nhập đầy đủ mật khẩu cũ và mới.");
      return;
    }
    if (newPassword.length < 4) {
      setError("Mật khẩu mới phải có ít nhất 4 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!roleId) {
      setError("Không xác định được quyền của tài khoản. Vui lòng tải lại trang.");
      return;
    }

    try {
      setSubmitting(true);
      await updateUser(currentUser.id, {
        username: currentUser.username,
        password: newPassword,
        roleId
      });
      setSuccess("Đổi mật khẩu thành công.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Đổi mật khẩu thất bại."));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    currentUser,
    oldPassword, setOldPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    showOldPassword, setShowOldPassword,
    showNewPassword, setShowNewPassword,
    showConfirmPassword, setShowConfirmPassword,
    error, success, submitting,
    handleChangePassword
  };
};

export default useProfile;
