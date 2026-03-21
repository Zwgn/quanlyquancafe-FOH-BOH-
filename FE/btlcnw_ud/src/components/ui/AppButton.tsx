import { ButtonHTMLAttributes, ReactNode } from "react";
import "../../assets/styles/ui-button.css";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
}

const AppButton = ({
  children,
  variant = "primary",
  className,
  ...props
}: AppButtonProps) => {
  const mergedClassName = ["ui-button", `ui-button-${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={mergedClassName} {...props}>
      {children}
    </button>
  );
};

export default AppButton;
