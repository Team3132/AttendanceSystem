import {
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { Duration } from "luxon";
import useOutreachReport from "../hooks/useOutreachReport";

interface OutreachReportProps {
  userId?: string;
}

const OutreachReport: React.FC<OutreachReportProps> = ({ userId }) => {
  const { data: report, isLoading } = useOutreachReport(userId);
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
          {hours ?? 0}h {minutes ? Math.round(minutes) : 0}m
        </StatNumber>
        <StatHelpText>Total Number of Outreach Hours</StatHelpText>
      </Stat>
    </StatGroup>
  );
};

export default OutreachReport;
