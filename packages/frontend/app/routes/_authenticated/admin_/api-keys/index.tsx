import { LinkButton } from "@/components/LinkButton";
import useDeleteKey from "@/features/admin/hooks/useDeleteKey";
import { useDisclosure } from "@/hooks/useDisclosure";
import { adminQueries } from "@/queries/adminQueries";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useRef } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

export const Route = createFileRoute("/_authenticated/admin_/api-keys/")({
  head: () => ({
    meta: [
      {
        title: "Admin - API Keys",
      },
    ],
  }),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(adminQueries.apiKeys);
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Stack gap={2}>
      <Suspense fallback={<SkeletonList />}>
        <KeyList />
      </Suspense>
      <LinkButton to="/admin/api-keys/create">Create API Key</LinkButton>
    </Stack>
  );
}

function KeyList() {
  const apiKeysQuery = useSuspenseQuery(adminQueries.apiKeys);

  return (
    <List>
      {apiKeysQuery.data?.map((apiKey) => (
        <ListItem
          key={apiKey.id}
          secondaryAction={<ListItemActions apiKeyId={apiKey.id} />}
        >
          <ListItemText primary={apiKey.name} />
        </ListItem>
      ))}
    </List>
  );
}

function SkeletonList() {
  return (
    <List>
      {[1, 2, 3].map((id) => (
        <ListItem
          key={id}
          secondaryAction={
            <IconButton>
              <FaEllipsisVertical />
            </IconButton>
          }
        >
          <ListItemText primary="Loading..." key={id} />
        </ListItem>
      ))}
    </List>
  );
}

interface ListItemActionsProps {
  apiKeyId: string;
}

function ListItemActions(props: ListItemActionsProps) {
  const { apiKeyId } = props;

  const { getButtonProps, getDisclosureProps } = useDisclosure();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const deleteKeyMutation = useDeleteKey();

  const handleDelete = () => deleteKeyMutation.mutate({ data: apiKeyId });

  return (
    <>
      <IconButton ref={buttonRef} {...getButtonProps()}>
        <FaEllipsisVertical />
      </IconButton>
      <Menu {...getDisclosureProps()} anchorEl={buttonRef.current}>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>
    </>
  );
}
