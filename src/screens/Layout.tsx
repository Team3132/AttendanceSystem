import { useAuthStatus } from "@/hooks";
import { Container, Flex } from "@chakra-ui/react";
import { Nav } from "@components";
import * as React from "react";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  const { isAdmin, isAuthenticated } = useAuthStatus();
  return (
    <Flex direction={"column"} minH="100vh">
      <Nav isAdmin={!!isAdmin} isAuthenticated={!!isAuthenticated} />
      <Container maxW="container.lg" height="100%">
        <Outlet />
      </Container>
      {/* <Spacer /> */}
    </Flex>
  );
};

export default Layout;
