import { ReactNode } from "react";
import "../../assets/styles/ui-modal.css";

interface AppModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

const AppModal = ({ open, title, onClose, children, footer }: AppModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="ui-modal-backdrop" onClick={onClose} role="presentation">
      <section
        className="ui-modal"
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
            aria-label="Close modal"
          >
            x
          </button>
        </header>
        <div className="ui-modal-content">{children}</div>
        {footer ? <footer className="ui-modal-footer">{footer}</footer> : null}
      </section>
    </div>
  );
};

export default AppModal;
