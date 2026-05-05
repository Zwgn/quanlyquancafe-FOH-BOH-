import { FormEvent, useEffect, useState } from "react";
import { getUserById, updateUser } from "../api/usersApi";
import axiosClient from "../api/axiosClient";
import { getApiErrorMessage } from "../utils/apiError";
import { ApiResponse } from "../types/api";

export interface CurrentUser {
  id: string;
  username: string;
  role: string;
  displayName: string;
  employeeId: string | null;
}

export interface EmployeeProfile {
  name: string;
  phone: string;
  gender: string;
  birthDate: string;
  position: string;
  salary: number | null;
  address: string;
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

const EMPTY_PROFILE: EmployeeProfile = {
  name: "", phone: "", gender: "", birthDate: "",
  position: "", salary: null, address: ""
};

const useProfile = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(getCurrentUser());
  const [profile, setProfile] = useState<EmployeeProfile>(EMPTY_PROFILE);
  const [profileForm, setProfileForm] = useState<EmployeeProfile>(EMPTY_PROFILE);
  const [editingProfile, setEditingProfile] = useState(false);
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
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const res = await axiosClient.get<ApiResponse<Record<string, unknown>>>("/auth/me");
      const d = res.data?.data ?? {};
      const p: EmployeeProfile = {
        name: String(d.name ?? d.displayName ?? ""),
        phone: String(d.phone ?? ""),
        gender: String(d.gender ?? ""),
        birthDate: d.birthDate ? String(d.birthDate).slice(0, 10) : "",
        position: String(d.position ?? ""),
        salary: d.salary != null ? Number(d.salary) : null,
        address: String(d.address ?? "")
      };
      setProfile(p);
      setProfileForm(p);
      if (d.employeeId) {
        setCurrentUser((prev) => prev ? { ...prev, employeeId: String(d.employeeId), displayName: String(d.displayName ?? prev.displayName) } : prev);
      }
    } catch { /* silent */ }
    finally { setProfileLoading(false); }
  };

  useEffect(() => {
    if (!currentUser?.id) return;
    void loadProfile();
    const fetchRoleId = async () => {
      try {
        const userInfo = await getUserById(currentUser.id);
        if (userInfo) {
          const row = userInfo as Record<string, unknown>;
          setRoleId(String(row.roleId ?? row.RoleId ?? ""));
        }
      } catch { /* silent */ }
    };
    void fetchRoleId();
  }, [currentUser?.id]);

  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (!profileForm.name.trim() || !profileForm.phone.trim()) {
      setError("Họ tên và số điện thoại là bắt buộc.");
      return;
    }
    try {
      setSubmitting(true);
      await axiosClient.put("/auth/profile", {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        gender: profileForm.gender || null,
        birthDate: profileForm.birthDate || null,
        address: profileForm.address.trim() || null
      });
      setSuccess("Cập nhật hồ sơ thành công.");
      setEditingProfile(false);
      await loadProfile();
      // Update localStorage displayName
      const raw = localStorage.getItem("user");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          parsed.displayName = profileForm.name.trim();
          parsed.name = profileForm.name.trim();
          localStorage.setItem("user", JSON.stringify(parsed));
          setCurrentUser((prev) => prev ? { ...prev, displayName: profileForm.name.trim() } : prev);
        } catch { /* silent */ }
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Cập nhật hồ sơ thất bại."));
    } finally {
      setSubmitting(false);
    }
  };

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
    profile, profileForm, setProfileForm,
    editingProfile, setEditingProfile,
    profileLoading,
    handleSaveProfile,
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
