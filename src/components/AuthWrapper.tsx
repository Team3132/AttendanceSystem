import { Spinner } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks";

interface Props {
  children: any;
  to?: string;
}

export const AuthWrapper: React.FC<Props> = ({ children, to = "/" }) => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  return isLoading ? (
    <Spinner />
  ) : isAuthenticated ? (
    children
  ) : (
    <Navigate to={to} />
  );
};
