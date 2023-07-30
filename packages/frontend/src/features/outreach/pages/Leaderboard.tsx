import { LoaderFunctionArgs } from "react-router-dom";
import LeaderBoardDataTable from "../components/LeaderBoardDataTable";

export async function loader({}: LoaderFunctionArgs) {
  return null;
}

export function Component() {
  return <LeaderBoardDataTable />;
}
