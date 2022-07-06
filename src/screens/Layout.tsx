import { Container, Flex, Spacer, Spinner } from "@chakra-ui/react";
import * as React from "react";
import { Outlet } from "react-router-dom";
import { AuthComponent, Nav } from "../components";
import { useAuthStatus } from "../hooks";

export const Layout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStatus();
  return (
    <Flex direction={"column"} minH="100vh">
      <Nav />
      <Container maxW="container.lg">
        {isLoading ? (
          <Spinner />
        ) : isAuthenticated ? (
          <Outlet />
        ) : (
          <AuthComponent />
        )}
      </Container>
      <Spacer />
      {/* <Footer /> */}
    </Flex>
  );
};
