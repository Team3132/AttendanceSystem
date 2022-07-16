import { theme } from "@/utils";
import { ChakraProviderProps } from "@chakra-ui/react";
import loadable from "@loadable/component";

const ProviderChakraProvider = loadable(() => import("@chakra-ui/react"), {
  resolveComponent: (comps) => comps.ChakraProvider,
});

export const ChakraProvider: React.FC<Omit<ChakraProviderProps, "theme">> = ({
  ...props
}) => {
  return <ProviderChakraProvider theme={theme} {...props} />;
};

export default ChakraProvider;
