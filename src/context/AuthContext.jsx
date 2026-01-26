import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("token") || null;
  });

  // Login user and save session
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", jwtToken);

    //navigate("/", { replace: true }); 
  };

  // Logout user and clear session properly
  const logout = () => {
    setUser(null);
    setToken(null);

    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    navigate("/" , { replace: true }); 
  };

  // Update user profile details
  const updateUser = (newUser) => {
    setUser(newUser);
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
