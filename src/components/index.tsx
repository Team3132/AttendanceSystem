import loadable from "@loadable/component";
import type { AttendanceButtonRowProps } from "./AttendedButtonRow";
import type { AttendedListProps } from "./AttendedList";
import type { AuthRouteProps } from "./AuthRoute";
import type { AuthWrapperProps } from "./AuthWrapper";
import type { RSVPButtonRowProps } from "./RSVPButtonRow";
import type { RSVPListProps } from "./RSVPList";
import type { UserAvatarProps } from "./UserAvatar";

const Box = loadable(() => import("@chakra-ui/react"), {
  resolveComponent: (comps) => comps.Box,
});
const Skeleton = loadable(() => import("@chakra-ui/react"), {
  resolveComponent: (comps) => comps.Skeleton,
});

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
export const Nav = loadable(() => import("./Nav"));
export const RSVPButtonRow = loadable<RSVPButtonRowProps>(
  () => import("./RSVPButtonRow")
);
export const RSVPList = loadable<RSVPListProps>(() => import("./RSVPList"));

export const TDUIcon = loadable(() => import("./TDUIcon"));
export const UserAvatar = loadable<UserAvatarProps>(
  () => import("./UserAvatar")
);
export const CalendarWithLocalizer = loadable(
  () => import("./CalendarWithLocalizer"),
  {
    fallback: (
      <Skeleton>
        <Box height="500px" width="100%" />
      </Skeleton>
    ),
  }
);
export const ChakraProvider = loadable(() => import("./ChakraProvider"));
export const SWToast = loadable(() => import("./SWToast"));
export const UserList = loadable(() => import("./UserList"));
export const RSVPSelect = loadable(() => import("./RSVPSelect"));
export const StatusForRangeButton = loadable(() => import("./StatusForRange"));
export const Calendar = loadable(() => import("./Calendar"));
