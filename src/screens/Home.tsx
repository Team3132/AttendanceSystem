import { CalendarGrid } from "../components/calendar";
import { useMe } from "../hooks";

export const Home: React.FC = () => {
  const { user, isLoading, isError } = useMe();
  return (
    <code>
      <CalendarGrid />
      <pre>{JSON.stringify(user, undefined, 2)}</pre>
    </code>
  );
};
