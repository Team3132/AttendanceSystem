import { mentorMiddleware } from "@/middleware/authMiddleware";
import { adminQueryKeys } from "@/server/queryKeys";
import { getApiKeys, getParsingRules } from "@/server/services/adminService";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";

const getAPIKeysFn = createServerFn({ method: "GET" })
  .middleware([mentorMiddleware])
  .handler(() => getApiKeys());

const getEventParsingRulesFn = createServerFn({ method: "GET" })
  .middleware([mentorMiddleware])
  .handler(() => getParsingRules());

export const adminQueries = {
  eventParsingRules: queryOptions({
    queryFn: () => getEventParsingRulesFn(),
    queryKey: adminQueryKeys.parsingRules,
  }),
  apiKeys: queryOptions({
    queryFn: () => getAPIKeysFn(),
    queryKey: adminQueryKeys.apiKeys,
  }),
};
