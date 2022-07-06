import { Spinner } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSWRConfig } from "swr";

export const AuthComponent: React.FC = () => {
  const { mutate } = useSWRConfig();
  useEffect(() => {
    // createOAuthWindow("/api/auth/discord", mutate);
  }, []);
  return <Spinner />;
};
