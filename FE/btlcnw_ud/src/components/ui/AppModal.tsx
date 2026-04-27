import React, { ReactNode } from "react";
import { MdClose } from "react-icons/md";
import "../../assets/styles/ui-modal.css";

interface AppModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}

const AppModal = ({ open, title, onClose, children, footer, wide }: AppModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="ui-modal-backdrop" onClick={onClose} role="presentation">
      <section
        className={`ui-modal${wide ? " ui-modal-wide" : ""}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <header className="ui-modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="ui-modal-close"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
          >
            {React.createElement(MdClose as any, { size: 18 })}
          </button>
        </header>
        <div className="ui-modal-content">{children}</div>
        {footer ? <footer className="ui-modal-footer">{footer}</footer> : null}
      </section>
    </div>
  );
};

export default AppModal;
