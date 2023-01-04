import { useAttend } from "@/features/rsvp";
import { EventResponseType } from "@/generated";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";

interface UserCheckinProps {
  event: EventResponseType;
}

interface FormFields {
  token: string;
}

export default function UserCheckin(props: UserCheckinProps) {
  const { event } = props;

  const tokenCheckin = useAttend(event.id);

  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormFields>();

  const onSubmit: SubmitHandler<FormFields> = ({ token }) =>
    tokenCheckin.mutateAsync({ token });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
      <FormLabel>Event Code</FormLabel>
        <InputGroup>
     
          <Input
            placeholder={"Enter the checkin code here..."}
            autoFocus
            {...register("token", { required: "A code is required!" })}
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
        <FormHelperText>{tokenCheckin.error?.body.message}</FormHelperText>
      </FormControl>
    </form>
  );
}
