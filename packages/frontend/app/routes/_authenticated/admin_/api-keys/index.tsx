import DefaultAppBar from "@/components/DefaultAppBar";
import { LinkButton } from "@/components/LinkButton";
import useDeleteKey from "@/features/admin/hooks/useDeleteKey";
import { useDisclosure } from "@/hooks/useDisclosure";
import { adminQueries } from "@/queries/adminQueries";
import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";

export const Route = createFileRoute("/_authenticated/admin_/api-keys/")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(adminQueries.apiKeys);
  },
});

function RouteComponent() {
  const apiKeysQuery = useSuspenseQuery(adminQueries.apiKeys);

  return (
    <>
      <DefaultAppBar title="Admin - Users" />
      <Container
        sx={{
          my: 2,
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
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
      </Container>
    </>
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
