import { RSVPList } from "@/components";
import { EventResponseType, ScaninDto } from "@/generated";
import { useScanin } from "@/hooks";
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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

      <Stack>
        <RSVPList eventId={event.id} />
      </Stack>
    </>
  );
}
