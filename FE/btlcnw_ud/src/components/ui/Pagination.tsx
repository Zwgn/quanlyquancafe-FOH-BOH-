import AppButton from "./AppButton";

interface PaginationProps {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const Pagination = ({ current, total, onPrev, onNext }: PaginationProps) => (
  <div className="module-pagination">
    <span>Trang {current}/{total}</span>
    <div className="module-pagination-actions">
      <AppButton variant="secondary" onClick={onPrev} disabled={current === 1}>
        Trước
      </AppButton>
      <AppButton variant="secondary" onClick={onNext} disabled={current === total}>
        Sau
      </AppButton>
    </div>
  </div>
);

export default Pagination;
