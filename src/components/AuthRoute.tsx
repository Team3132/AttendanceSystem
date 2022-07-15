import {
  IndexRouteProps,
  LayoutRouteProps,
  PathRouteProps,
  Route,
} from "react-router-dom";
import { AuthWrapper } from "./AuthWrapper";

export type AuthRouteProps = (
  | PathRouteProps
  | LayoutRouteProps
  | IndexRouteProps
) & {
  to?: string;
  adminOnly?: boolean;
};

export const AuthRoute = ({ to, adminOnly, ...props }: AuthRouteProps) => {
  return (
    <AuthWrapper to={to} adminOnly={adminOnly}>
      <Route {...props} />
    </AuthWrapper>
  );
};
export default AuthRoute;
