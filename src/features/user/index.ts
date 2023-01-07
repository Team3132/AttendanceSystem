import loadable from "@loadable/component";

export { default as useUser } from "./hooks/useUser";

export const UserAvatar = loadable(() => import("./components/UserAvatar"))
export const ProfilePage = loadable(() => import("./pages/ProfilePage"))
export const UserList = loadable(() => import("./components/UserList"))
export const Username  = loadable(() => import("./components/Username"))
