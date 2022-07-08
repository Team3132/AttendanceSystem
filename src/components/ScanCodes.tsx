import { DeleteIcon } from "@chakra-ui/icons";
import {
  Divider,
  Flex,
  IconButton,
  Input,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { CreateScancodeDto, ScancodeService } from "../generated";
import { useScancodes } from "../hooks";

export const ScancodeList: React.FC = () => {
  const { scancodes, mutate } = useScancodes();
  const {
    formState: { errors, isSubmitting },
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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex>
          <Input
            {...register("code")}
            placeholder={"Paste your code here..."}
          />
          <Spacer />
          <IconButton
            aria-label="Add scancode"
            type="submit"
            isLoading={isSubmitting}
          />
        </Flex>
      </form>
      <Stack divider={<Divider />}>
        {scancodes?.map((scancode) => (
          <Flex key={scancode.code}>
            <Input readOnly={true} value={scancode.code} />
            <Spacer />
            <IconButton
              aria-label="Delete Scancode"
              icon={<DeleteIcon />}
              onClick={async () => {
                await ScancodeService.scancodeControllerRemove(scancode.code);
                mutate(scancodes.filter(({ code }) => code !== scancode.code));
              }}
            />
          </Flex>
        ))}
      </Stack>
    </>
  );
};
