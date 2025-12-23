import { adminQueryKeys } from "@/server/queryKeys";
import {
  getParsingRule,
  getParsingRules,
} from "@/server/services/adminService";
import { queryOptions } from "@tanstack/react-query";

export const adminQueries = {
  eventParsingRules: queryOptions({
    queryFn: () => getParsingRules(),
    queryKey: adminQueryKeys.parsingRuleList(),
  }),
  eventParsingRule: (id: string) =>
    queryOptions({
      queryFn: () => getParsingRule({ data: id }),
      queryKey: adminQueryKeys.parsingRule(id),
    }),
};
