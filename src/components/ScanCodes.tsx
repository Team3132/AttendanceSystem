import { AddIcon, MinusIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import {
  ApiError,
  CreateScancodeDto,
  Scancode,
  ScancodeService,
} from "../generated";
import { useScancodes } from "../hooks";
import { generateString } from "../utils";

export const ScancodeList: React.FC = () => {
  const { scancodes, mutate } = useScancodes();
  const {
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<CreateScancodeDto>();

  const onSubmit = async (data: CreateScancodeDto) => {
    try {
      const result = await ScancodeService.scancodeControllerCreate(data);
      if (scancodes) {
        mutate(scancodes.concat(result));
      }
      reset();
    } catch (error) {
      if (error instanceof ApiError) {
        const errorMessages = error.body["message"] as string[];
        setError(
          "code",
          { message: errorMessages.join() },
          { shouldFocus: true }
        );
      }
    }
  };

  const onDelete = async (scancode: Scancode) => {
    const { code: resultCode } = await ScancodeService.scancodeControllerRemove(
      scancode.code
    );
    mutate(scancodes?.filter(({ code }) => code !== resultCode));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign={"center"} mt={6}>
        Your Codes
      </Heading>
      <Divider my={6} />
      <Container>
        {" "}
        <Stack>
          {scancodes?.map((scancode) => (
            <ScancodeInput
              key={scancode.code}
              scancode={scancode}
              onDelete={onDelete}
            />
          ))}
          <FormControl isInvalid={!!errors.code}>
            <InputGroup size="md">
              <Input
                pr="7rem"
                {...register("code", {})}
                placeholder={"Paste your code here..."}
                id="newCode"
              />
              <InputRightElement width="3.5rem" mr="2.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  // isLoading={isSubmitting}
                  onClick={() => {
                    const randomString = generateString(6);

                    setValue("code", randomString);
                  }}
                  aria-label={"generate"}
                  icon={<RepeatIcon />}
                />
              </InputRightElement>
              <InputRightElement width="3.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  type="submit"
                  isLoading={isSubmitting}
                  aria-label={"submit"}
                  icon={<AddIcon />}
                />
              </InputRightElement>
            </InputGroup>
            {!!errors.code ? (
              <FormErrorMessage>{errors.code.message}</FormErrorMessage>
            ) : null}
          </FormControl>
        </Stack>
      </Container>
    </form>
  );
};

const ScancodeInput: React.FC<{
  scancode: Scancode;
  onDelete: (scancode: Scancode) => void;
}> = ({ scancode, onDelete }) => {
  const { hasCopied, onCopy } = useClipboard(scancode.code);
  return (
    <InputGroup size="md" key={scancode.code}>
      <Input
        readOnly={true}
        value={scancode.code}
        pr="7rem"
        variant={"filled"}
        isReadOnly={true}
      />
      <InputRightElement width="3.5rem" mr="3.5rem">
        <Button h="1.75rem" size="sm" onClick={onCopy} aria-label={"generate"}>
          {hasCopied ? "Copied" : "Copy"}
        </Button>
      </InputRightElement>
      <InputRightElement width="3.5rem">
        <IconButton
          aria-label="Delete Scancode"
          icon={<MinusIcon />}
          h="1.75rem"
          size="sm"
          onClick={() => onDelete(scancode)}
        />
      </InputRightElement>
    </InputGroup>
  );
};
