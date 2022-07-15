import {
  IndexRouteProps,
  LayoutRouteProps,
  PathRouteProps,
  Route,
} from "react-router-dom";
import { AuthWrapper } from "./AuthWrapper";

type Props = (PathRouteProps | LayoutRouteProps | IndexRouteProps) & {
  to?: string;
  adminOnly?: boolean;
};

export const AuthRoute = ({ to, adminOnly, ...props }: Props) => {
  return (
    <AuthWrapper to={to} adminOnly={adminOnly}>
      <Route {...props} />
    </AuthWrapper>
  );
};
