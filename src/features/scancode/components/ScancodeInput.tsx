import { useScanin } from "@/features/rsvp";
import { ScaninDto } from "@/generated";
import api from "@/services/api";
import {
  Button,
  Center,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useNFC from "../hooks/useNFC";

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
    setValue,
  } = useForm<ScaninDto>();

  const { mutateAsync: scanin } = useScanin();

  const toast = useToast();

  const onSubmit = async (data: ScaninDto) => {
    const rsvp = await scanin({ eventId, scan: data });
    const user = await api.user.getUser(rsvp.userId);
    toast({
      status: "success",
      description: `${user.firstName} ${user.lastName} signed in!`,
    });
    reset();
  };

  const getNfc = useNFC();

  useEffect(() => {
    if (!getNfc.data) return;
    setValue("code", getNfc.data);
  }, [getNfc.isSuccess]);

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
        <FormHelperText>
          The code from scanning a card using the reader. Should be on the codes
          page of your profile.
        </FormHelperText>
      </FormControl>
      <Center>
        {"NDEFReader" in window && (
          <Button
            onClick={async () => {
              const nfcRes = await getNfc.mutateAsync();
              if (nfcRes) {
                setValue("code", nfcRes);
              }
            }}
            isLoading={getNfc.isLoading}
          >
            Scan NFC
          </Button>
        )}
      </Center>
    </form>
  );
}
