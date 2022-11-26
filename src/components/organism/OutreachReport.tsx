import { useOutreachReport } from "@/hooks";
import {
  Stat,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

interface OutreachReportProps {
  userId?: string;
}

const OutreachReport: React.FC<OutreachReportProps> = ({ userId }) => {
  const { report, isLoading } = useOutreachReport(userId);
  return (
    <StatGroup>
      <Stat>
        <StatLabel>Events</StatLabel>
        <StatNumber>{report?.eventCount}</StatNumber>
        <StatHelpText>Total Number of Outreach Events</StatHelpText>
      </Stat>
      <Stat>
        <StatLabel>Hours</StatLabel>
        <StatNumber>{report?.hourCount}</StatNumber>
        <StatHelpText>Total Number of Outreach Hours</StatHelpText>
      </Stat>
    </StatGroup>
  );
};

export default OutreachReport;
