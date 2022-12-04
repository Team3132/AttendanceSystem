import { useAuthStatus } from "@/features/auth";
import { Container, Flex } from "@chakra-ui/react";
import * as React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./navigation";

export const Layout: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuthStatus();
  return (
    <Flex direction={"column"} minH="100vh">
      <Navigation isAdmin={!!isAdmin} isAuthenticated={!!isAuthenticated} />
      <Container maxW="container.lg" height="100%">
        <Outlet />
      </Container>
      {/* <Spacer /> */}
    </Flex>
  );
};

export default Layout;
