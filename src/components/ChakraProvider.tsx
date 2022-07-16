import { theme } from "@/utils";
import { ChakraProviderProps } from "@chakra-ui/react";
import loadable from "@loadable/component";

const ChakraProviderDef = loadable(() => import("@chakra-ui/react"), {
  resolveComponent: (components) => components.ChakraProvider,
});

export const ChakraProvider: React.FC<ChakraProviderProps> = ({ ...rest }) => {
  return <ChakraProviderDef {...rest} theme={theme} />;
};
export default ChakraProvider;
