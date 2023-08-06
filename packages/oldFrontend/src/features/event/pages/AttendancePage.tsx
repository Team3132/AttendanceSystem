import { RSVPList } from "@/features/rsvp";
import { useParams } from "react-router-dom";

export default function AttendancePage() {
  const { eventId } = useParams();
  return <RSVPList eventId={eventId} />;
}
