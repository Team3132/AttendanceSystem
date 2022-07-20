import {
  Flex,
  FlexProps,
  LinkBox,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { MonthProps } from ".";

const DayView: React.FC<MonthProps & FlexProps> = ({
  date,
  events,
  onRange,

  ...flexProps
}) => {
  const { colorMode } = useColorMode();
  const [day, setDay] = useState<DateTime>();
  const [hours, setHours] = useState<[DateTime, DateTime][]>();
  const borderColour = colorMode === "light" ? "gray.300" : "gray.600";
  const todayColour = colorMode === "light" ? "blue.200" : "blue.700";
  useEffect(() => {
    const dayEnd = date.endOf("day");
    const dayBegin = date.startOf("day");
    const tempHours: [DateTime, DateTime][] = new Array(24)
      .fill(0)
      .map((hour, index) => [
        dayBegin.startOf("hour").plus({ hour: index }),
        dayBegin.endOf("hour").plus({ hour: index }),
      ]);
    setHours(tempHours);
    setDay(date);

    onRange && onRange(dayBegin, dayEnd);
  }, [date]);
  return (
    <Flex {...flexProps} flexDirection={"column"}>
      <Flex>{day?.toLocaleString(DateTime.DATETIME_FULL)}</Flex>{" "}
      {/** All Day */}
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>Hour</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {hours?.map((hour) => (
              <LinkBox
                borderColor={borderColour}
                as={Tr}
                bgColor={
                  DateTime.local().hasSame(hour[0], "hour")
                    ? todayColour
                    : undefined
                }
              >
                <Td fontWeight={"semibold"} fontSize={"sm"}>
                  <Stack divider={<>-</>}>
                    <Text>{hour[0].toLocaleString(DateTime.TIME_SIMPLE)}</Text>
                    <Text>{hour[1].toLocaleString(DateTime.TIME_SIMPLE)}</Text>
                  </Stack>
                </Td>
                <Td></Td>
              </LinkBox>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Hour</Th>
              <Th></Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default DayView;
