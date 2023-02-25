import { Spinner, useToast } from "@chakra-ui/react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import { useLocation } from "react-router-dom";
import queryClient from "@/services/queryClient";

export interface AuthWrapperProps {
  // children: any;
  adminOnly?: boolean;
  to?: string;
}

const key = "prevLocation";

export default function AuthWrapper({
  // children,
  to = "/",
  adminOnly = false,
}: AuthWrapperProps) {
  const authStatusQuery = useAuthStatus();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  if (!authStatusQuery.isSuccess) {
    return <Spinner />;
  }

  if (!authStatusQuery.isAuthenticated) {
    window.localStorage.setItem(key, location.pathname);
    window.location.replace(`${import.meta.env.VITE_BACKEND_URL}/auth/discord`);
    return <>Loading</>;
  }

  if (!authStatusQuery.isAdmin && adminOnly) {
    return <Navigate to="/calendar" />;
  }

  const fetchedLocal = window.localStorage.getItem(key);

  if (fetchedLocal) {
    window.localStorage.removeItem(key);
    navigate(fetchedLocal);
  }

  return <Outlet />;
}
