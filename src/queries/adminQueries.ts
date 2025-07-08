import { adminMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import {
  getApiKeys,
  getParsingRule,
  getParsingRules,
} from "@/server/services/adminService";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const getAPIKeysFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(() => getApiKeys());

const getEventParsingRulesFn = createServerFn({ method: "GET" })
  .middleware([adminMiddleware])
  .handler(() => getParsingRules());

const getEventParsingRuleFn = createServerFn({ method: "GET" })
  .validator(z.string())
  .middleware([adminMiddleware])
  .handler(({ data }) => getParsingRule(data));

export const adminQueries = {
  eventParsingRules: queryOptions({
    queryFn: () => getEventParsingRulesFn(),
    queryKey: adminQueryKeys.parsingRuleList(),
  }),
  eventParsingRule: (id: string) =>
    queryOptions({
      queryFn: () => getEventParsingRuleFn({ data: id }),
      queryKey: adminQueryKeys.parsingRule(id),
    }),
  apiKeys: queryOptions({
    queryFn: () => getAPIKeysFn(),
    queryKey: adminQueryKeys.apiKeys,
  }),
};
