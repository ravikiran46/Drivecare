import { useContext } from "react";
import { DataContext } from "./DataContext";

const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDatacontext must be used inside of a ServiceProvider");
  }
  return context;
};

export default useDataContext;
