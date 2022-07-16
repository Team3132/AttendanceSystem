import { EventService, UpdateOrCreateRSVP } from "@/generated";
import { useEventRSVPStatus, useMe } from "@/hooks";
import { Select, SelectProps } from "@chakra-ui/react";

interface RSVPSelectProps {
  eventId: string;
}

export const RSVPSelect: React.FC<
  RSVPSelectProps & Omit<SelectProps, "children">
> = ({ eventId, ...selectProps }) => {
  const { rsvp, mutate } = useEventRSVPStatus(eventId);
  const { user } = useMe();
  // const { mutate: globalMutate } = useSWRConfig();
  const statusEnum = UpdateOrCreateRSVP["status"];
  const onChange: React.ChangeEventHandler<HTMLSelectElement> = async (e) => {
    const currentValue = e.target.value as UpdateOrCreateRSVP["status"];
    if (
      currentValue === statusEnum.MAYBE ||
      currentValue === statusEnum.NO ||
      currentValue === statusEnum.YES
    ) {
      const result = EventService.eventControllerSetEventRsvp(eventId, {
        status: currentValue,
      });
      mutate(result, {
        optimisticData: (current) => ({
          ...(current ?? {
            id: "",
            eventId,
            userId: user?.id ?? "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
          status: currentValue,
        }),
      });
    } else {
      console.log("Not Valid");
    }
  };

  return (
    <Select {...selectProps} onChange={onChange} value={rsvp?.status}>
      <option>Please Select</option>
      <option value={statusEnum.MAYBE}>Maybe</option>
      <option value={statusEnum.NO}>No</option>
      <option value={statusEnum.YES}>Yes</option>
    </Select>
  );
};
export default RSVPSelect;
