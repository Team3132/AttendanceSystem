import { AppBar, Stack, Toolbar, Typography, styled } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { FaCircleUser } from "react-icons/fa6";
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

export default function TopBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <TitleTypography />
        <Stack direction="row" spacing={1}>
          <ModeSwitchButton />
          <LinkIconButton to="/profile" color="inherit">
            <FaCircleUser />
          </LinkIconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
