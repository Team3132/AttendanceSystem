import { Box, Code, Heading } from "@chakra-ui/react";
import React from "react";

export default class ErrorBoundary extends React.Component<
  { children?: React.ReactNode[] | React.ReactNode },
  { hasError: Error | undefined }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: undefined };
  }

  static getDerivedStateFromError(error: Error | undefined) {
    // Update state so the next render will show the fallback UI.
    return { hasError: error };
  }
  componentDidCatch(error: Error, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <Heading>Something went wrong.</Heading>

          <Box>
            <Code>
              <pre>{this.state.hasError.message}</pre>
            </Code>
          </Box>
        </>
      );
    }
    return this.props.children;
  }
}
