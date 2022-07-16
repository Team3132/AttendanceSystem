import {
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useClipboard,
} from "@chakra-ui/react";
import { UserAvatar } from "@components";
import { UpdateUserDto } from "@generated";
import { userAvatar, useUser } from "@hooks";
import { editUser } from "@utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useSWRConfig } from "swr";

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
    mutate(user);
    globalMutate(`/api/user/${userId ?? "me"}`);
  };

  const calendarUrl = `${window.location.origin}/api/calendar?secret=${
    user?.calendarSecret ?? ""
  }`;

  const { hasCopied, onCopy } = useClipboard(calendarUrl);

  return (
    <Container>
      {/* <Center> */}
      {/* <Image
          width={500}
          height={500}
          src={
            user && avatarId
              ? `https://cdn.discordapp.com/avatars/${user?.id}/${avatarId}.png`
              : undefined
          }
          alt="Profile Image"
        /> */}
      <Center>
        <UserAvatar size={"2xl"} />
      </Center>

      <Heading textAlign={"center"}>
        {user?.firstName} {user?.lastName}
      </Heading>

      <Divider my={6} />

      {/* </Center> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <HStack>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                placeholder="First Name"
                {...register("firstName", { required: true })}
                variant={"filled"}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                placeholder="Last Name"
                {...register("lastName", { required: true })}
                variant={"filled"}
              />
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel htmlFor="calendar">Calendar Link</FormLabel>
            <Flex mb={2}>
              <Input
                value={calendarUrl}
                isReadOnly
                id="calendar"
                variant={"filled"}
              />
              <Button onClick={onCopy} ml={2}>
                {hasCopied ? "Copied" : "Copy"}
              </Button>
            </Flex>
          </FormControl>
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
            Save
          </Button>
        </Stack>
        {/* </> */}
      </form>
    </Container>
  );
};

export default ProfileScreen;
