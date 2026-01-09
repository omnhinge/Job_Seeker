import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Protected({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}
