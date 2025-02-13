import { AppBar, IconButton, Toolbar, Typography, styled } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { Fragment, useCallback, useMemo } from "react";
import { FaArrowLeft, FaCircleUser } from "react-icons/fa6";
import { LinkIconButton } from "./LinkIconButton";
import ModeSwitchButton from "./ModeSwitchButton";

const GrowingTypography = styled(Typography)({
  flexGrow: 1,
});

function TitleTypography() {
  const matches = useRouterState({ select: (s) => s.matches });

  const matchingIds = useMemo(() => matches.map((m) => m.id), [matches]);

  const getTitleQuery = useQuery({
    queryKey: ["getTitle", matchingIds],
    queryFn: async () => {
      const matchWithTitle = [...matches]
        .reverse()
        .find((d) => d.context.getTitle);

      return matchWithTitle?.context.getTitle
        ? await matchWithTitle?.context.getTitle()
        : "My App";
    },
    placeholderData: keepPreviousData,
  });

  return (
    <GrowingTypography variant="h6" as="div">
      {getTitleQuery.data}
    </GrowingTypography>
  );
}

function BackArrow() {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  if (!canGoBack) {
    return <Fragment />;
  }

  const handleBack = useCallback(() => {
    router?.history?.back();
  }, [router]);

  return (
    <IconButton onClick={handleBack}>
      <FaArrowLeft />
    </IconButton>
  );
}

const SpacedToolbar = styled(Toolbar)(({ theme }) => ({
  gap: theme.spacing(1),
}));

export default function TopBar() {
  return (
    <AppBar position="static">
      <SpacedToolbar>
        <BackArrow />
        <TitleTypography />
        <ModeSwitchButton />
        <LinkIconButton to="/profile" color="inherit">
          <FaCircleUser />
        </LinkIconButton>
      </SpacedToolbar>
    </AppBar>
  );
}
