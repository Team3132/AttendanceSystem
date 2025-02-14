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
import { useRef } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

export const Route = createFileRoute("/_authenticated/admin_/api-keys/")({
  beforeLoad: () => ({
    getTitle: () => "Admin - API Keys",
  }),
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(adminQueries.apiKeys);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const apiKeysQuery = useSuspenseQuery(adminQueries.apiKeys);

  return (
    <Stack gap={2}>
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
      <LinkButton to="/admin/api-keys/create">Create API Key</LinkButton>
    </Stack>
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
