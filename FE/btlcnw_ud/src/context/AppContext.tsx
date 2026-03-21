import { createContext, ReactNode, useContext, useMemo, useState } from "react";

interface AppContextValue {
  username: string;
  setUsername: (name: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [username, setUsername] = useState("Admin");

  const value = useMemo(() => ({ username, setUsername }), [username]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
