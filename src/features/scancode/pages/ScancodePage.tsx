import { AddIcon, MinusIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useClipboard
} from "@chakra-ui/react";
import { ApiError, CreateScancodeDto, Scancode } from "@generated";
import { generateString } from "@utils";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import useCreateScancode from "../hooks/useCreateScancode";
import useDeleteScancode from "../hooks/useDeleteScancode";
import useScancodes from "../hooks/useScancodes";

export const ScancodeScreen: React.FC = () => {
  const {userId} = useParams()
  const { data: scancodes } = useScancodes(userId);
  const createScancode = useCreateScancode(userId);
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
      await createScancode.mutateAsync(data);
      reset();
    } catch (error) {
      if (error instanceof ApiError) {
        setError("code", {
          type: "custom",
          message: error.body.message,
        });
      } else {
        throw error;
      }
    }
  };

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
          <FormControl isInvalid={!!errors.code}>
            <InputGroup size="md">
              <Input
                pr="7rem"
                {...register("code")}
                placeholder={"Paste your code here..."}
                id="newCode"
                autoFocus
              />
              <InputRightElement width="3.5rem" mr="2.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
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
            {errors.code ? <FormErrorMessage>{errors.code?.message}</FormErrorMessage> : <FormHelperText>A code from using the card scanner or something you'll remember. It can't be the same as someone else's code.</FormHelperText>}
            
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
