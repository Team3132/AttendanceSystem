import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Image,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSWRConfig } from "swr";
import { UpdateUserDto } from "../generated";
import { userAvatar, useUser } from "../hooks";
import { editUser } from "../utils";

export const ProfileScreen: React.FC = () => {
  const { userId } = useParams();
  const { user, mutate } = useUser(userId);
  const { avatarId } = userAvatar(userId);
  const { mutate: globalMutate } = useSWRConfig();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
    reset,
    control,
    setValue,
  } = useForm<UpdateUserDto>();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
      });
    }
  }, [user]);

  const onSubmit = async (data: UpdateUserDto) => {
    const user = await editUser(userId, data);
    // navigate(`/calendar/view/${event.id}`);
    mutate(user);
    globalMutate(`/api/user/${userId ?? "me"}`);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Center>
        <Image
          width={500}
          height={500}
          src={
            user && avatarId
              ? `https://cdn.discordapp.com/avatars/${user?.id}/${avatarId}.png`
              : undefined
          }
          alt="Profile Image"
        />
      </Center>
      <Container>
        <Stack>
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <Input
              id="firstName"
              placeholder="First Name"
              {...register("firstName", { required: true })}
            />
          </FormControl>
          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <Input
              id="lastName"
              placeholder="Last Name"
              {...register("lastName", { required: true })}
            />
          </FormControl>
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
            Save
          </Button>
        </Stack>
      </Container>
    </form>
  );
};
