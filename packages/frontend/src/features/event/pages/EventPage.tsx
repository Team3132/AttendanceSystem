import { useAuthStatus } from "@/features/auth";
import { RSVPList, RSVPStatus } from "@/features/rsvp";
import {
  Button,
  Container,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AdminCheckin from "../components/AdminCheckin";
import EventDetails from "./EventDetailsPage";
import UserCheckin from "../components/UserCheckin";
import useEvent from "../hooks/useEvent";
import useRouteMatch from "../hooks/useRouteMatch";

export default function EventPage() {
  const { eventId } = useParams();
  const event = useEvent(eventId);
  const auth = useAuthStatus();

  const { pathname } = useLocation();

  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (v: string) => {
    navigate(v);
  };

  const routeMatchFound = useRouteMatch(
    [
      "/event/:eventId",
      "/event/:eventId/attendance",
      "/event/:eventId/checkin",
    ].concat(
      auth?.isAdmin
        ? ["/event/:eventId/admin-attendance", "/event/:eventId/admin-checkin"]
        : []
    )
  );

  const currentTab = routeMatchFound?.match.pattern.path;

  const currentIndex = routeMatchFound?.i;

  if (!event.isSuccess || !auth.isSuccess) {
    return <Spinner />;
  }

  return (
    <>
      <Heading
        textAlign={"center"}
        mt={6}
        position="relative"
        right={0}
        bottom={"auto"}
        top={"auto"}
      >
        {event.data.title}
        {auth.isAdmin && (
          <Button
            rightIcon={<FaArrowRight />}
            position="absolute"
            right={0}
            bottom="auto"
            top="auto"
            as={Link}
            to={`/event/${eventId}/edit`}
          >
            Edit
          </Button>
        )}
      </Heading>
      <Tabs index={currentIndex}>
        <TabList justifyContent={"center"}>
          <Tab onClick={() => navigate(`/event/${eventId}`)}>Details</Tab>
          <Tab onClick={() => navigate(`/event/${eventId}/attendance`)}>
            Attendance
          </Tab>

          <Tab onClick={() => navigate(`/event/${eventId}/checkin`)}>
            User Check-in
          </Tab>
          {!auth.isLoading && auth.isAdmin ? (
            <>
              <Tab
                onClick={() => navigate(`/event/${eventId}/admin-attendance`)}
              >
                Admin Attendance
              </Tab>
              <Tab onClick={() => navigate(`/event/${eventId}/admin-checkin`)}>
                Event Check-in
              </Tab>
            </>
          ) : null}
        </TabList>

        <TabPanels>
          <TabPanel>
            <Outlet />
          </TabPanel>
          <TabPanel>
            <Outlet />
          </TabPanel>
          <TabPanel>
            <Outlet />
          </TabPanel>
          {!auth.isLoading && auth.isAdmin ? (
            <>
              <TabPanel>
                <Outlet />
              </TabPanel>
              {/* <TabPanel>
                <Outlet />
              </TabPanel> */}
            </>
          ) : null}
        </TabPanels>
      </Tabs>
    </>
  );
}
