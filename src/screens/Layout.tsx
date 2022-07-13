import { Container, Flex } from "@chakra-ui/react";
import * as React from "react";
import { Outlet } from "react-router-dom";
import { Nav } from "../components";

export const Layout: React.FC = () => {
  return (
    <Flex direction={"column"} minH="100vh">
      <Nav />
      <Container maxW="container.lg" height="100%">
        <Outlet />
      </Container>
      {/* <Spacer /> */}
    </Flex>
  );
};
