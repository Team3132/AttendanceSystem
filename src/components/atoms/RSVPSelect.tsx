import { Select, SelectProps } from "@chakra-ui/react";
import { api } from "../../client";
import { UpdateOrCreateRSVP } from "../../generated";
import {
  useEventRSVPStatus,
  useMe,
  useUpdateEventRSVPStatus,
} from "../../hooks";

interface RSVPSelectProps {
  eventId: string;
}

export const RSVPSelect: React.FC<
  RSVPSelectProps & Omit<SelectProps, "children">
> = ({ eventId, ...selectProps }) => {
  const { rsvp } = useEventRSVPStatus(eventId);
  const { mutate: mutateEventRSVP } = useUpdateEventRSVPStatus();
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
      const result = api.event.setEventRsvp(eventId, {
        status: currentValue,
      });
      mutateEventRSVP({
        eventId,
        rsvp: {
          status: currentValue,
        },
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
