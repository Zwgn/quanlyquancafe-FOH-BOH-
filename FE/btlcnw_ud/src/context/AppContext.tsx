import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface AppContextValue {
  username: string;
  setUsername: (name: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const getStoredUsername = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return "";
  }

  try {
    const parsedUser = JSON.parse(rawUser) as {
      displayName?: string;
      name?: string;
      fullName?: string;
      username?: string;
    };
    return (
      parsedUser.displayName ??
      parsedUser.name ??
      parsedUser.fullName ??
      parsedUser.username ??
      ""
    );
  } catch {
    return "";
  }
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [username, setUsername] = useState(getStoredUsername);

  const value = useMemo(() => ({ username, setUsername }), [username]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext phải được sử dụng bên trong AppProvider");
  }
  return context;
};
