import loadable from "@loadable/component";
import type { UserAvatarProps } from "./atoms/UserAvatar";
import type { AuthWrapperProps } from "./AuthWrapper";
import type { RSVPButtonRowProps } from "./RSVPButtonRow";
import type { RSVPListProps } from "./RSVPList";

const Box = loadable(() => import("@chakra-ui/react"), {
  resolveComponent: (comps) => comps.Box,
});
const Skeleton = loadable(() => import("@chakra-ui/react"), {
  resolveComponent: (comps) => comps.Skeleton,
});

export const AuthWrapper = loadable<AuthWrapperProps>(
  () => import("./AuthWrapper")
);
export const Nav = loadable(() => import("./organism/Nav"));
export const RSVPButtonRow = loadable<RSVPButtonRowProps>(
  () => import("./RSVPButtonRow")
);
export const RSVPList = loadable<RSVPListProps>(() => import("./RSVPList"));

export const TDUIcon = loadable(() => import("./atoms/TDUIcon"));
export const UserAvatar = loadable<UserAvatarProps>(
  () => import("./atoms/UserAvatar")
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
export const UserList = loadable(() => import("./organism/UserList"));
export const RSVPSelect = loadable(() => import("./atoms/RSVPSelect"));
export const StatusForRangeButton = loadable(
  () => import("./atoms/StatusForRange")
);
export const Calendar = loadable(() => import("./organism/Calendar"));
