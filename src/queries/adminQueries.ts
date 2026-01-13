import { adminQueryKeys } from "@/server/queryKeys";
import {
  getParsingRule,
  getParsingRules,
} from "@/server/services/adminService";
import { queryOptions } from "@tanstack/react-query";

export const adminQueries = {
  eventParsingRules: queryOptions({
    queryFn: ({ signal }) => getParsingRules({ signal }),
    queryKey: adminQueryKeys.parsingRuleList(),
  }),
  eventParsingRule: (id: string) =>
    queryOptions({
      queryFn: ({ signal }) => getParsingRule({ data: id, signal }),
      queryKey: adminQueryKeys.parsingRule(id),
    }),
};
