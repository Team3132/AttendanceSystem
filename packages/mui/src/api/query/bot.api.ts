import { queryOptions } from "@tanstack/react-query";
import api from "..";
import { cancelableQuery } from "./utils";

export const botKeys = {
  root: ["bot" as const] as const,
  status: () => [...botKeys.root, "status"] as const,
  roles: () => [...botKeys.root, "roles"] as const,
};

const botApi = {
  getStatus: queryOptions({
    queryKey: botKeys.status(),
    queryFn: ({ signal }) => cancelableQuery(api.bot.getStatus(), signal),
  }),
  getRoles: queryOptions({
    queryKey: botKeys.roles(),
    queryFn: ({ signal }) => cancelableQuery(api.bot.getRoles(), signal),
  }),
};

export default botApi;
