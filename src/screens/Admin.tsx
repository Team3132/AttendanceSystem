import { UserList } from "@/components";
import { useUsers } from "@/hooks";
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
  const { users, isLoading } = useUsers();
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
                {isExpanded ? (
                  <UserList users={users} isLoading={isLoading} />
                ) : null}
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
