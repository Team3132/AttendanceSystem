import { Spinner, useToast } from "@chakra-ui/react";
import { useAuthStatus, useScancodes } from "@hooks";
import { useEffect } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
export interface AuthWrapperProps {
  // children: any;
  adminOnly?: boolean;
  to?: string;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({
  // children,
  to = "/",
  adminOnly = false,
}) => {
  const authStatusQuery = useAuthStatus();
  const scancodeQuery = useScancodes();
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

  if (!scancodeQuery.isSuccess) {
    return <Spinner />;
  }

  if (!scancodeQuery.scancodes?.length) {
    const showToast =
      !toast.isActive("scancode") &&
      !window.localStorage.getItem("scancodeToastClosed");
    if (showToast) {
      toast({
        id: "scancode",
        status: "warning",
        description: (
          <>Please add a scancode {<Link to="/codes">here</Link>}.</>
        ),
        duration: 5000,
        isClosable: true,
        onCloseComplete: () => {
          window.localStorage.setItem("scancodeToastClosed", "true");
        },
      });
    }
  }

  return <Outlet />;
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
