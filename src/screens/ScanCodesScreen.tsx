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
import { CreateScancodeDto, Scancode } from "@generated";
import { useCreateScancode, useDeleteScancode, useScancodes } from "@hooks";
import { generateString } from "@utils";
import { useForm } from "react-hook-form";

export const ScancodeScreen: React.FC = () => {
  const { scancodes } = useScancodes();
  const createScancode = useCreateScancode();
  const {
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<CreateScancodeDto>();

  const onSubmit = async (data: CreateScancodeDto) =>
    new Promise<void>((res, rej) => {
      createScancode
        .mutateAsync(data)
        .then((result) => {
          reset();
          res();
        })
        .catch(rej);
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading textAlign={"center"} mt={6}>
        Your Codes
      </Heading>
      <Divider my={6} />
      <Container>
        <Stack>
          {scancodes?.map((scancode) => (
            <ScancodeInput key={scancode.code} scancode={scancode} />
          ))}
          <FormControl isInvalid={createScancode.isError}>
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
                  isLoading={createScancode.isLoading}
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
            <FormErrorMessage>{createScancode.error?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      </Container>
    </form>
  );
};

const ScancodeInput: React.FC<{
  scancode: Scancode;
}> = ({ scancode }) => {
  const { hasCopied, onCopy } = useClipboard(scancode.code);

  const deleteScancode = useDeleteScancode();

  const onDelete = () => deleteScancode.mutateAsync(scancode.code);

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
          isLoading={deleteScancode.isLoading}
          onClick={onDelete}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default ScancodeScreen;
