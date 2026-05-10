import { useContext } from "react";
import { Authcontext } from "./Authenticationcontext";

const useAuth = () => {
  const context = useContext(Authcontext);
  if (context === undefined) {
    throw new Error(" useAuth must be used inside of a Authprovider");
  }
  return context;
};

export default useAuth;
