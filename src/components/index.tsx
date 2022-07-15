import loadable from "@loadable/component";
import type { AttendanceButtonRowProps } from "./AttendedButtonRow";
import { AttendedListProps } from "./AttendedList";
import { AuthRouteProps } from "./AuthRoute";
import { AuthWrapperProps } from "./AuthWrapper";
import { RSVPButtonRowProps } from "./RSVPButtonRow";
import { RSVPListProps } from "./RSVPList";
import { UserAvatarProps } from "./UserAvatar";

export const AttendedButtonRow = loadable<AttendanceButtonRowProps>(
  () => import("./AttendedButtonRow")
);
export const AttendedList = loadable<AttendedListProps>(
  () => import("./AttendedList")
);
export const AuthRoute = loadable<AuthRouteProps>(() => import("./AuthRoute"));
export const AuthWrapper = loadable<AuthWrapperProps>(
  () => import("./AuthWrapper")
);
export const ChakraAlert = loadable(() => import("./ChakraAlert"));
export const Nav = loadable(() => import("./Nav"));
export const RSVPButtonRow = loadable<RSVPButtonRowProps>(
  () => import("./RSVPButtonRow")
);
export const RSVPList = loadable<RSVPListProps>(() => import("./RSVPList"));

export const TDUIcon = loadable(() => import("./TDUIcon"));
export const UserAvatar = loadable<UserAvatarProps>(
  () => import("./UserAvatar")
);
