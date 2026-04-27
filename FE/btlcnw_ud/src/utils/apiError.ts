import { AxiosError } from "axios";

const DEFAULT_STATUS_MESSAGES: Record<number, string> = {
  401: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  403: "Bạn không có quyền thực hiện thao tác này.",
  404: "Không tìm thấy tài nguyên yêu cầu.",
  500: "Máy chủ gặp lỗi. Vui lòng thử lại sau."
};

export const getApiErrorMessage = (
  requestError: unknown,
  fallback: string,
  statusOverrides?: Record<number, string>
): string => {
  if (!(requestError instanceof AxiosError)) {
    return fallback;
  }

  const apiMessage = (requestError.response?.data as { message?: string } | undefined)
    ?.message;

  if (apiMessage) {
    return apiMessage;
  }

  const status = requestError.response?.status;
  if (status !== undefined) {
    const override = statusOverrides?.[status];
    if (override) return override;
    const fallbackByStatus = DEFAULT_STATUS_MESSAGES[status];
    if (fallbackByStatus) return fallbackByStatus;
  }

  return fallback;
};
