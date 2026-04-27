/**
 * Mở một cửa sổ in (popup) chứa HTML truyền vào và tự động kích hoạt in.
 * Dùng cho hoá đơn, báo cáo, v.v.
 */
export const openPrintWindow = (htmlContent: string, documentTitle = "In tài liệu") => {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) {
    window.alert("Trình duyệt đã chặn cửa sổ pop-up. Vui lòng cho phép pop-up để in.");
    return;
  }

  printWindow.document.open();
  printWindow.document.write(`<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(documentTitle)}</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, sans-serif; color: #1f2937; margin: 0; padding: 24px; }
    h1, h2, h3, h4 { margin: 0 0 8px; }
    .doc-header { text-align: center; border-bottom: 2px solid #6f4e37; padding-bottom: 12px; margin-bottom: 18px; }
    .doc-brand { font-size: 22px; font-weight: 700; color: #6f4e37; letter-spacing: 1px; }
    .doc-brand-tagline { font-size: 12px; color: #6c757d; margin-top: 2px; }
    .doc-title { font-size: 18px; margin-top: 12px; text-transform: uppercase; }
    .doc-meta { display: flex; justify-content: space-between; margin: 12px 0 16px; font-size: 13px; }
    .doc-meta div p { margin: 2px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 8px 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background-color: #fdf6f0; color: #6f4e37; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    td.num, th.num { text-align: right; }
    tfoot td { font-weight: 700; border-top: 2px solid #6f4e37; border-bottom: none; }
    .doc-total { text-align: right; margin-top: 12px; font-size: 16px; font-weight: 700; color: #6f4e37; }
    .doc-footer { margin-top: 28px; text-align: center; font-size: 12px; color: #6c757d; border-top: 1px dashed #d1d5db; padding-top: 12px; }
    .doc-section { margin-bottom: 22px; }
    .doc-section-title { font-size: 14px; font-weight: 700; color: #6f4e37; margin-bottom: 8px; text-transform: uppercase; }
    .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
    .kpi-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; text-align: center; }
    .kpi-card p { margin: 0; font-size: 12px; color: #6c757d; }
    .kpi-card h3 { margin: 6px 0 0; font-size: 18px; color: #6f4e37; }
    @media print { .no-print { display: none; } body { padding: 0; } }
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.onafterprint = function() { window.close(); };
      }, 250);
    };
  </script>
</body>
</html>`);
  printWindow.document.close();
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const escapeHtmlText = escapeHtml;
