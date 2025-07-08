import { adminMiddleware } from "@/middleware/authMiddleware";
import { discordQueryKeys } from "@/server/queryKeys";
import {
  getServerChannels,
  getServerRoles,
} from "@/server/services/discordService";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const discordServerRolesFn = createServerFn({ method: "GET" })
  .validator(z.void())
  .middleware([adminMiddleware])
  .handler(() => getServerRoles());

const discordServerChannelsFn = createServerFn({ method: "GET" })
  .validator(z.void())
  .middleware([adminMiddleware])
  .handler(() => getServerChannels());

export const discordQueryOptions = {
  serverRoles: () =>
    queryOptions({
      queryKey: discordQueryKeys.serverRoles,
      queryFn: () => discordServerRolesFn({ data: undefined }),
    }),
  serverChannels: () =>
    queryOptions({
      queryKey: discordQueryKeys.serverChannels,
      queryFn: () => discordServerChannelsFn({ data: undefined }),
    }),
};
