import { AdminRSVPList } from "@/features/rsvp";
import { useParams } from "react-router-dom";

export default function AdminAtttendancePage() {
  const { eventId } = useParams();
  return <AdminRSVPList eventId={eventId} />;
}
