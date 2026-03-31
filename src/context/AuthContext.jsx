import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { logout, whoami } from "../users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState("");
  const [loading, setLoading] = useState(true);

  const refetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await whoami();
      if (userData && !userData.error) {
        setUser(userData);
        setUserError("");
      } else if (userData?.error) {
        setUserError(userData.error);
        setUser(null);
      }
    } catch (err) {
      console.error("User lekérés hiba:", err);
      setUserError(err.message || "Hiba történt");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refetchUser();
  }, [refetchUser]);

  async function handleLogout() {
    try {
      const data = await logout();
      if (data?.error) {
        return setUserError(data.error);
      }
    } catch (err) {
      console.error(err);
      setUserError(err.message || "Kijelentkezési hiba");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userError,
        setUserError,
        handleLogout,
        loading,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
