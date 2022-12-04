import { Spinner, useToast } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
export interface AuthWrapperProps {
  // children: any;
  adminOnly?: boolean;
  to?: string;
}

export default function AuthWrapper({
  // children,
  to = "/",
  adminOnly = false,
}: AuthWrapperProps) {
  const authStatusQuery = useAuthStatus();
  const toast = useToast();

  if (!authStatusQuery.isSuccess) {
    return <Spinner />;
  }

  if (!authStatusQuery.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!authStatusQuery.isAdmin && adminOnly) {
    return <Navigate to="/calendar" />;
  }

  return <Outlet />;
}
