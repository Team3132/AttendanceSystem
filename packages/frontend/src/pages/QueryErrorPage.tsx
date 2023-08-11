import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import { FaArrowLeft, FaHouse, FaSpinner } from "react-icons/fa6";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { z } from "zod";

const PossibleUrlQueryParamsSchema = z.object({
  message: z.string(),
  status: z.coerce.number().optional(),
  statusText: z.string().optional(),
});

export async function loader({ request: { url } }: LoaderFunctionArgs) {
  const urlQueryParams = new URL(url).searchParams;
  const data = PossibleUrlQueryParamsSchema.parse(
    Object.fromEntries(urlQueryParams.entries()),
  );

  return data;
}

export function Component() {
  const { message, status, statusText } = useLoaderData() as Awaited<
    ReturnType<typeof loader>
  >;
  const navigate = useNavigate();

  const handleReload = () => {
    window.location.reload();
  };

  const handleHome = () => {
    window.location.href = "/";
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Stack
      gap={2}
      my={2}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {status ? (
        <Typography variant="h5" textAlign={"center"}>
          {status}
        </Typography>
      ) : null}
      {statusText ? (
        <Typography variant="h5" textAlign={"center"}>
          {statusText}
        </Typography>
      ) : null}
      <Typography variant="h6" textAlign={"center"} fontFamily={"monospace"}>
        {message}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Button onClick={handleBack} startIcon={<FaArrowLeft />}>
            Back
          </Button>
          <Button onClick={handleReload} startIcon={<FaSpinner />}>
            Reload Page
          </Button>
          <Button onClick={handleHome} startIcon={<FaHouse />}>
            Home
          </Button>
        </ButtonGroup>
      </Box>
    </Stack>
  );
}
