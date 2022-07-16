import { UserList } from "@/components";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Heading,
} from "@chakra-ui/react";

export const AdminScreen: React.FC = () => {
  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        Admin
      </Heading>
      <Divider my={6} />
      <Accordion allowMultiple>
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    User List
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {isExpanded ? <UserList /> : null}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
        {/* <AccordionItem>
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Attendance
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {isExpanded ? <AttendedList eventId={event?.id} /> : null}
              </AccordionPanel>
            </>
          )}
        </AccordionItem> */}
      </Accordion>
    </>
  );
};
export default AdminScreen;
