import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import React from "react";
import { MdWarningAmber, MdInfoOutline, MdHelpOutline } from "react-icons/md";
import AppButton from "./AppButton";
import "../../assets/styles/ui-confirm.css";

type ConfirmTone = "danger" | "warning" | "info";

export interface ConfirmOptions {
  title?: string;
  message: ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
}

interface InternalConfirmState extends ConfirmOptions {
  open: boolean;
  resolver?: (value: boolean) => void;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined);

const TONE_ICON: Record<ConfirmTone, any> = {
  danger: MdWarningAmber,
  warning: MdWarningAmber,
  info: MdInfoOutline
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<InternalConfirmState>({
    open: false,
    message: ""
  });

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setState({
        ...options,
        open: true,
        resolver: resolve
      });
    });
  }, []);

  const close = (value: boolean) => {
    state.resolver?.(value);
    setState((previous) => ({ ...previous, open: false, resolver: undefined }));
  };

  const tone: ConfirmTone = state.tone ?? "danger";
  const Icon = TONE_ICON[tone] ?? MdHelpOutline;

  const value = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {state.open ? (
        <div
          className="ui-confirm-backdrop"
          role="presentation"
          onClick={() => close(false)}
        >
          <section
            className={`ui-confirm ui-confirm-${tone}`}
            role="alertdialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="ui-confirm-icon">
              {React.createElement(Icon as any, { size: 32 })}
            </div>
            <h3 className="ui-confirm-title">
              {state.title ?? "Xác nhận hành động"}
            </h3>
            <div className="ui-confirm-message">{state.message}</div>
            <div className="ui-confirm-actions">
              <AppButton variant="ghost" onClick={() => close(false)}>
                {state.cancelText ?? "Hủy"}
              </AppButton>
              <AppButton
                variant={tone === "danger" ? "danger" : "primary"}
                onClick={() => close(true)}
                autoFocus
              >
                {state.confirmText ?? "Xác nhận"}
              </AppButton>
            </div>
          </section>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context.confirm;
};
