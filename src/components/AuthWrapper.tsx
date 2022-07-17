import { Spinner, useToast } from "@chakra-ui/react";
import { useAuthStatus } from "@hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const toast = useToast();
  useEffect(() => {
    toast({
      status: "error",
      title: "You are not authorized to access this page",
      duration: 2000,
      isClosable: true,
    });

    navigate(to, { replace: true });
  }, []);
  return <>You need to be an admin to access this</>;
};

interface AuthRedirectProps {
  to?: string;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ to = "/" }) => {
  const navigate = useNavigate();
  const toast = useToast();
  useEffect(() => {
    toast({
      status: "error",
      title: "You need to be logged in to access this",
      duration: 2000,
      isClosable: true,
    });

    navigate(to, { replace: true });
  }, []);
  return <>You need to be logged in to access this</>;
};
export default AuthWrapper;
