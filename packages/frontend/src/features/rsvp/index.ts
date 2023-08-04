import loadable from "@loadable/component";

export const RSVPStatus = loadable(() => import("./components/RSVPStatus"));
export const RSVPList = loadable(() => import("./components/RSVPList"));
export const AdminRSVPList = loadable(
  () => import("./components/AdminRSVPList"),
);
export const RSVPButtonRow = loadable(
  () => import("./components/RSVPButtonRow"),
);
export { default as useScanin } from "./hooks/useScanin";
export { default as useAttend } from "./hooks/useAttend";
