import { Spinner } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "../hooks";
export interface AuthWrapperProps {
  children: any;
  adminOnly?: boolean;
  to?: string;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  to = "/",
  adminOnly = false,
}) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuthStatus();

  return isLoading ? (
    <Spinner />
  ) : isAuthenticated ? (
    adminOnly && !isAdmin ? (
      <AdminRedirect />
    ) : (
      children
    )
  ) : (
    <AuthRedirect to={to} />
  );
};

interface AdminRedirectProps {
  to?: string;
}

const AdminRedirect: React.FC<AdminRedirectProps> = ({ to = "/calendar" }) => {
  const navigate = useNavigate();
  const alert = useAlert();
  useEffect(() => {
    alert.error("You need to be an admin to access this", { timeout: 2000 });

    navigate(to, { replace: true });
  }, []);
  return <>You need to be an admin to access this</>;
};

interface AuthRedirectProps {
  to?: string;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ to = "/" }) => {
  const navigate = useNavigate();
  const alert = useAlert();
  useEffect(() => {
    alert.error("You need to be logged in to access this", { timeout: 2000 });

    navigate(to, { replace: true });
  }, []);
  return <>You need to be logged in to access this</>;
};
export default AuthWrapper;
