import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  CloseButton,
} from "@chakra-ui/react";

export const ChakraAlert = ({ style, options, message, close }: any) => (
  <Alert status={options.type} style={style} variant="left-accent">
    <AlertIcon />
    <Box>
      <AlertDescription>{message}</AlertDescription>
    </Box>
    <CloseButton
      alignSelf="flex-start"
      position="relative"
      right={-1}
      top={-1}
      onClick={close}
    />
  </Alert>
);
export default ChakraAlert;
