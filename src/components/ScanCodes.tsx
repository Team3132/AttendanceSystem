import { AddIcon, MinusIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Container,
  Divider,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateScancodeDto, ScancodeService } from "../generated";
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
  } = useForm<CreateScancodeDto>();

  const onSubmit = async (data: CreateScancodeDto) => {
    const result = await ScancodeService.scancodeControllerCreate(data);
    if (scancodes) {
      mutate(scancodes.concat(result));
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Container borderWidth="1px" borderRadius={"md"} p={5}>
        <Heading>Your Codes</Heading>
        <Divider my={5} />
        <Stack>
          {scancodes?.map((scancode) => (
            <InputGroup size="md" key={scancode.code}>
              <Input
                readOnly={true}
                value={scancode.code}
                pr="3.5rem"
                variant={"filled"}
                isReadOnly={true}
              />
              <InputRightElement width="3.5rem">
                <IconButton
                  aria-label="Delete Scancode"
                  icon={<MinusIcon />}
                  h="1.75rem"
                  size="sm"
                  onClick={async () => {
                    const { code: resultCode } =
                      await ScancodeService.scancodeControllerRemove(
                        scancode.code
                      );
                    mutate(scancodes.filter(({ code }) => code !== resultCode));
                  }}
                />
              </InputRightElement>
            </InputGroup>
          ))}
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
        </Stack>
      </Container>
    </form>
  );
};
