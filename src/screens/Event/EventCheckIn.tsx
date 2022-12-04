import { RSVPList } from "@/components";
import { EventResponseType, ScaninDto } from "@/generated";
import { useEventToken, useScanin } from "@/hooks";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  StatGroup,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TotpToken from "./TotpToken";

interface EventCheckinProps {
  event: EventResponseType;
}

export default function EventCheckin(props: EventCheckinProps) {
  const { event } = props;

  const navigate = useNavigate();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ScaninDto>();

  const { mutateAsync: scanin } = useScanin();

  const onSubmit = async (data: ScaninDto) => {
    await scanin({ eventId: event.id, scan: data });

    reset();
  };

  const eventSecret = useEventToken(event.id);

  if (!eventSecret.isSuccess) {
    return <Spinner />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup>
          <Input
            {...register("code")}
            placeholder={"Enter your code here..."}
            autoFocus
          />
          <InputRightElement width="5rem">
            <Button
              type="submit"
              isLoading={isSubmitting}
              h="1.75rem"
              size="sm"
            >
              Submit
            </Button>
          </InputRightElement>
        </InputGroup>
      </form>
      <StatGroup p={5} textAlign="center">
        <TotpToken secret={eventSecret.data.secret} />
      </StatGroup>

      <RSVPList eventId={event.id} />
    </>
  );
}
