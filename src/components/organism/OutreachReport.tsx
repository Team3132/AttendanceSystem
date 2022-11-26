import { useOutreachReport } from "@/hooks";
import {
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { Duration } from "luxon";

interface OutreachReportProps {
  userId?: string;
}

const OutreachReport: React.FC<OutreachReportProps> = ({ userId }) => {
  const { report, isLoading } = useOutreachReport(userId);
  const { hours, minutes } = Duration.fromObject({
    hours: report?.hourCount || 0,
  })
    .shiftTo("hours", "minutes")
    .toObject();
  return (
    <StatGroup>
      <Stat>
        <StatLabel>Events</StatLabel>
        <StatNumber>{report?.eventCount}</StatNumber>
        <StatHelpText>Total Number of Outreach Events</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Hours</StatLabel>
        <StatNumber>
          {report?.hourCount ? `${hours}h ${minutes}m` : "Loading"}
        </StatNumber>
        <StatHelpText>Total Number of Outreach Hours</StatHelpText>
      </Stat>
    </StatGroup>
  );
};

export default OutreachReport;
