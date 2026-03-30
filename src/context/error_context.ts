import { createContext, useContext } from "react";

type ErrorContextType = {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export const ErrorContext = createContext<ErrorContextType | null>(null);

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error(
      "useErrorContext must be used within a ErrorContextProvider",
    );
  }
  return context;
};
