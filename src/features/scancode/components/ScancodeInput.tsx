import { useScanin } from "@/features/rsvp";
import { ScaninDto } from "@/generated";
import { Button, FormControl, FormHelperText, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

interface ScancodeInputProps {
  eventId: string;
}

export default function ScancodeInput(props: ScancodeInputProps) {
  const { eventId } = props;
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ScaninDto>();

  const { mutateAsync: scanin } = useScanin();

  const onSubmit = async (data: ScaninDto) => {
    await scanin({ eventId, scan: data });

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
      <InputGroup>
        <Input
          {...register("code")}
          placeholder={"Enter your code here..."}
          autoFocus
        />
        <InputRightElement width="5rem">
          <Button type="submit" isLoading={isSubmitting} h="1.75rem" size="sm">
            Submit
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormHelperText>The code from scanning a card using the reader. Should be on the codes page of your profile.</FormHelperText>
      </FormControl>
    </form>
  );
}
