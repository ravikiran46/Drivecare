import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import instance from "@/components/api/api_Instance";

export const Authcontext = createContext();

export default function AuthProvider({ children = {} }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      setIsLoading(true);
      try {
        if (!token) {
          setUser(null);
          return;
        }

        let decoded;
        try {
          decoded = jwtDecode(token);
          if (decoded.exp && Date.now() / 1000 >= decoded.exp) {
            // Token expired – clean up
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            return;
          }
        } catch (decodeError) {
          console.error("Invalid token format:", decodeError);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          return;
        }

        try {
          const response = await instance.get("/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200 && response.data.user) {
            setUser(response.data.user);
            return;
          }
        } catch (apiError) {
          console.warn(
            "Failed to fetch /me, falling back to decoded token",
            apiError,
          );
          setUser(decoded);
        }
      } catch (error) {
        console.error("Unexpected error during restoreAuth:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const decoded = jwtDecode(newToken);
      if (decoded.exp && Date.now() / 1000 >= decoded.exp) {
        console.warn("Token expired on login");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        return;
      }
      setUser(decoded);
    } catch (error) {
      console.error("Failed to decode token on login", error);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <Authcontext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </Authcontext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
