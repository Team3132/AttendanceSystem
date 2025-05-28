import { isServerError } from "@/server";
import { Button, Stack, Typography } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa6";
import { MdRefresh } from "react-icons/md";
import QueryErrorBoundary from "./QueryErrorBoundary";

interface GenericServerErrorBoundaryProps {
  children: React.ReactNode;
}

export default function GenericServerErrorBoundary(
  props: GenericServerErrorBoundaryProps,
) {
  const { children } = props;

  return (
    <QueryErrorBoundary
      fallbackRender={({ resetErrorBoundary, error, handleBack }) => {
        const errorMessage = isServerError(error)
          ? error.message
          : error instanceof Error
            ? error.message
            : "An error occurred";

        return (
          <Stack
            spacing={2}
            textAlign={"center"}
            justifyContent={"center"}
            height={"100%"}
          >
            <Typography variant="h5">{errorMessage}</Typography>
            <Stack spacing={2} direction="row" justifyContent={"center"}>
              <Button
                onClick={handleBack}
                variant="contained"
                startIcon={<FaArrowLeft />}
              >
                Back
              </Button>
              <Button
                onClick={resetErrorBoundary}
                variant="contained"
                endIcon={<MdRefresh />}
              >
                Retry
              </Button>
            </Stack>
          </Stack>
        );
      }}
    >
      {children}
    </QueryErrorBoundary>
  );
}
