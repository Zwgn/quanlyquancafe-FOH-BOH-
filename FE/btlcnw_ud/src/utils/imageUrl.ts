const BE_ORIGIN = "http://localhost:3001";

export const resolveImageUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  if (url.startsWith("/uploads/")) return `${BE_ORIGIN}${url}`;
  return url;
};
