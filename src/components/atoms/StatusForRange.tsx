import { useUpdateEventsRSVPStatus } from "@/hooks/events";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  InputGroup,
  Select,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UpdateRangeRSVP } from "../../generated";
interface StatusForRangeButtonProps {
  to: string;
  from: string;
}

type Promiseable<T> = Promise<T> | T;

interface FormData {
  status: UpdateRangeRSVP["status"];
}
export const StatusForRangeButton: React.FC<StatusForRangeButtonProps> = ({
  to,
  from,
}) => {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
  } = useForm<FormData>();

  const { mutate: mutateEvents } = useUpdateEventsRSVPStatus();
  // const { mutate: globalMutate } = useSWRConfig();

  const onSubmit: SubmitHandler<FormData> = async ({ status }) => {
    mutateEvents({ from, to, status });
  };

  return (
    <FormControl
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      isInvalid={!!errors.status}
    >
      <FormLabel htmlFor="updateSelect">Set Range RSVP</FormLabel>
      <InputGroup>
        <Select
          {...register("status", {
            required: "This is required",
          })}
          id="updateSelect"
          placeholder="Select One"

          // as={Input}
        >
          {/* <option value={"None"}>Please Select</option> */}
          <option value={UpdateRangeRSVP["status"].MAYBE}>Maybe</option>
          <option value={UpdateRangeRSVP["status"].NO}>No</option>
          <option value={UpdateRangeRSVP["status"].YES}>Yes</option>
        </Select>
        <Button type="submit" isLoading={isSubmitting}>
          Submit
        </Button>
      </InputGroup>
      {!errors.status ? (
        <FormHelperText>
          Set your RSVP status for events within a set of dates.
        </FormHelperText>
      ) : (
        <FormErrorMessage>{errors.status.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};
export default StatusForRangeButton;
